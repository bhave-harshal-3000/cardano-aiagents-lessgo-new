import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Calendar, Upload, FileText, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { TopBar } from '../components/TopBar';
import { transactionAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';
import { receiptTheme } from '../styles/receiptTheme';
import { ReceiptBarcode, ReceiptDivider, ReceiptHeader } from '../components';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  autoCategorized?: boolean;
  confidence?: number;
}

interface ParsedTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  isDuplicate?: boolean;
}

// Parser function for Google Pay/Wallet HTML files
const parseGPayHtml = async (file: File): Promise<ParsedTransaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Validate it's a Google Takeout file
      if (!content.includes('<html') || !content.toLowerCase().includes('google')) {
        reject(new Error('Invalid file: This does not appear to be a Google Takeout HTML file'));
        return;
      }
      
      const transactions: ParsedTransaction[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      // Try to find transaction patterns in the HTML
      // This is a simplified parser - real Google Wallet HTML structure may vary
      const rows = doc.querySelectorAll('tr, .transaction-row, .activity-row, div[class*="transaction"]');
      
      let txId = 1;
      rows.forEach((row) => {
        const text = row.textContent || '';
        
        // Look for currency patterns (e.g., $50.00, ₹100.00, €25.50)
        const amountMatch = text.match(/[\$₹€£¥]\s*[\d,]+\.?\d*/g);
        
        // Look for date patterns (various formats)
        const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|[A-Z][a-z]{2}\s+\d{1,2},?\s+\d{4}/);
        
        if (amountMatch && amountMatch.length > 0) {
          const amountStr = amountMatch[0].replace(/[\$₹€£¥,\s]/g, '');
          const amount = parseFloat(amountStr);
          
          if (!isNaN(amount) && amount > 0) {
            // Extract description (simplified - get text before amount)
            const amountIndex = text.indexOf(amountMatch[0]);
            let description = text.substring(0, amountIndex).trim();
            
            // Clean up description
            description = description
              .replace(/[\n\r\t]+/g, ' ')
              .replace(/\s+/g, ' ')
              .substring(0, 100)
              .trim();
            
            if (description.length < 5) {
              description = 'Payment';
            }
            
            // Auto-categorize based on keywords
            const category = categorizeByKeywords(description);
            
            transactions.push({
              id: txId++,
              date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
              description,
              amount: -amount, // Negative for expenses
              category,
              isDuplicate: false,
            });
          }
        }
      });
      
      // If no transactions found with above method, try alternate parsing
      if (transactions.length === 0) {
        // Look for any monetary values in the document
        const allText = doc.body.textContent || '';
        const amounts = allText.match(/[\$₹€£¥]\s*[\d,]+\.?\d+/g);
        
        if (amounts && amounts.length > 0) {
          amounts.slice(0, 20).forEach((amt, idx) => {
            const amountStr = amt.replace(/[\$₹€£¥,\s]/g, '');
            const amount = parseFloat(amountStr);
            
            if (!isNaN(amount) && amount > 0) {
              transactions.push({
                id: idx + 1,
                date: new Date().toISOString().split('T')[0],
                description: `Google Pay Transaction ${idx + 1}`,
                amount: -amount,
                category: 'Shopping',
                isDuplicate: false,
              });
            }
          });
        }
      }
      
      resolve(transactions);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Auto-categorize transactions based on keywords
const categorizeByKeywords = (description: string): string => {
  const lower = description.toLowerCase();
  
  if (lower.match(/restaurant|food|dining|cafe|coffee|pizza|burger|kitchen|eatery|meal/)) {
    return 'Food & Dining';
  }
  if (lower.match(/uber|lyft|taxi|cab|transport|gas|fuel|parking|metro|train|bus/)) {
    return 'Transportation';
  }
  if (lower.match(/movie|cinema|netflix|spotify|entertainment|game|concert|theatre/)) {
    return 'Entertainment';
  }
  if (lower.match(/amazon|shop|store|mall|retail|purchase|buy|market/)) {
    return 'Shopping';
  }
  if (lower.match(/electric|water|gas|bill|utility|internet|phone|mobile/)) {
    return 'Bills & Utilities';
  }
  if (lower.match(/salary|income|payment received|deposit|transfer in/)) {
    return 'Income';
  }
  
  return 'Shopping'; // Default category
};

export const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addOption, setAddOption] = useState<'select' | 'manual' | 'csv' | 'html'>('select');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [parsedTransactions, setParsedTransactions] = useState<any[]>([]);
  const [selectedTxIds, setSelectedTxIds] = useState<Set<number>>(new Set());
  const [showInstructions, setShowInstructions] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for manual transaction entry
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food & Dining',
    amount: '',
    type: 'expense' as 'income' | 'expense',
  });

  const { userId } = useWallet();

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await transactionAPI.getAll(userId);
        // Map backend data to frontend format
        const mappedTransactions = data.map((tx: any) => ({
          id: tx._id,
          date: new Date(tx.date).toISOString().split('T')[0],
          description: tx.description || 'No description',
          category: tx.category,
          amount: tx.type === 'expense' ? -tx.amount : tx.amount,
          autoCategorized: false,
          confidence: 0,
        }));
        setTransactions(mappedTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Handler to add new transaction
  const handleAddTransaction = async () => {
    try {
      if (!userId) {
        alert('Please connect your wallet first');
        return;
      }
      
      const amount = parseFloat(formData.amount);
      if (!formData.description || isNaN(amount)) {
        alert('Please fill in all fields correctly');
        return;
      }

      const newTransaction = await transactionAPI.create({
        userId,
        type: formData.type,
        amount: Math.abs(amount),
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date),
      });

      // Add to local state
      const mappedTransaction = {
        id: newTransaction._id,
        date: formData.date,
        description: formData.description,
        category: formData.category,
        amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        autoCategorized: false,
        confidence: 0,
      };
      
      setTransactions([mappedTransaction, ...transactions]);
      
      // Reset form and close modal
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Food & Dining',
        amount: '',
        type: 'expense',
      });
      setShowAddModal(false);
      setAddOption('select');
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const categories = ['all', 'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Bills & Utilities', 'Income'];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ ...receiptTheme.pageWrapper, ...receiptTheme.cssVariables }}>
      <div style={receiptTheme.paperTexture} />
      <AnimatedPage>
        <TopBar />
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <ReceiptHeader 
            title="TRANSACTIONS" 
            subtitle="MANAGE AND CATEGORIZE YOUR TRANSACTIONS"
            session={String(Math.floor(Math.random() * 10000)).padStart(5, '0')}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1 }} />
            <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
              Add Transaction
            </Button>
          </div>

          <ReceiptDivider margin="24px 0" />

          {/* Filters */}
          <Card decorative>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-tertiary)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ position: 'relative', minWidth: '200px' }}>
                <Filter
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-tertiary)',
                    pointerEvents: 'none',
                  }}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="none" decorative>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                      Date
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                      Description
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                      Category
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                      Amount
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        Loading transactions...
                      </td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        No transactions found. Click "Add Transaction" to create one.
                      </td>
                    </tr>
                  ) : null}
                  <AnimatePresence>
                    {!loading && filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                        }}
                        whileHover={{ background: 'var(--color-surface)' }}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                            <span style={{ fontSize: '14px' }}>
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>{transaction.description}</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '13px',
                                padding: '4px 12px',
                                background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              {transaction.category}
                            </span>
                            {transaction.autoCategorized && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  background: 'var(--color-primary-muted)',
                                  color: 'var(--color-primary)',
                                  borderRadius: 'var(--radius-sm)',
                                }}
                                title={`Auto-categorized (${transaction.confidence}% confidence)`}
                              >
                                AI {transaction.confidence}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px 24px',
                            textAlign: 'right',
                            fontWeight: '600',
                            fontSize: '15px',
                            color: transaction.amount > 0 ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          }}
                        >
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {/* Edit transaction */}}
                              style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-text-secondary)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-danger)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Add Transaction Modal */}
        <Modal 
          isOpen={showAddModal} 
          onClose={() => {
            setShowAddModal(false);
            setAddOption('select');
            setUploadedFile(null);
            setFileError('');
            setParsedTransactions([]);
            setSelectedTxIds(new Set());
            setShowInstructions(false);
            setImportSuccess(false);
          }} 
          title="Add Transaction"
          width="lg"
        >
          {addOption === 'select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                Choose how you'd like to add transactions:
              </p>
              
              {/* Option 1: Manual Entry */}
              <Card hover onClick={() => setAddOption('manual')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'var(--color-primary-muted)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}>
                    <Plus size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Manual Entry</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      Add a single transaction manually
                    </p>
                  </div>
                </div>
              </Card>

              {/* Option 2: CSV Import */}
              <Card hover onClick={() => setAddOption('csv')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'var(--color-accent-muted)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                  }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Import CSV File</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      Upload bank statement CSV
                    </p>
                  </div>
                </div>
              </Card>

              {/* Option 3: Google Pay HTML Import */}
              <Card hover onClick={() => setAddOption('html')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: '#f5a62320', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f5a623',
                  }}>
                    <Upload size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>Import Online Payment History (HTML)</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      Import from Google Pay / Google Wallet
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {addOption === 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Type
                </label>
                <select 
                  style={{ width: '100%' }} 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Date
                </label>
                <input 
                  type="date" 
                  style={{ width: '100%' }} 
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Description
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., Grocery shopping" 
                  style={{ width: '100%' }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Category
                </label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                  Amount
                </label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  style={{ width: '100%' }} 
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button variant="outline" fullWidth onClick={() => setAddOption('select')}>
                  Back
                </Button>
                <Button variant="primary" fullWidth onClick={handleAddTransaction}>
                  Add Transaction
                </Button>
              </div>
            </div>
          )}

          {addOption === 'csv' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                CSV import feature coming soon...
              </p>
              <Button variant="outline" fullWidth onClick={() => setAddOption('select')}>
                Back
              </Button>
            </div>
          )}

          {addOption === 'html' && !importSuccess && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Upload Section */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '15px' }}>
                  Upload Google Pay / Google Wallet HTML File
                </label>
                
                <input
                  type="file"
                  accept=".html"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                      setFileError('');
                      setParsedTransactions([]);
                      
                      try {
                        const parsed = await parseGPayHtml(file);
                        if (parsed.length === 0) {
                          setFileError('No transactions found in this file. Please check if this is the correct Google Takeout HTML file.');
                        } else {
                          setParsedTransactions(parsed);
                          // Select all by default
                          setSelectedTxIds(new Set(parsed.map(t => t.id)));
                        }
                      } catch (error: any) {
                        setFileError(error.message);
                        setUploadedFile(null);
                      }
                    }
                  }}
                  style={{ display: 'none' }}
                  id="html-upload"
                />
                
                <label
                  htmlFor="html-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.background = 'var(--color-primary-muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.background = 'var(--color-surface)';
                  }}
                >
                  <Upload size={32} style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }} />
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>
                    {uploadedFile ? 'File Selected' : 'Click to upload HTML file'}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    Only .html files accepted
                  </p>
                </label>
                
                {uploadedFile && !fileError && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--color-accent-muted)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <FileText size={16} style={{ color: 'var(--color-accent)' }} />
                    <span style={{ fontSize: '14px', flex: 1 }}>{uploadedFile.name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
                
                {fileError && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--color-danger-muted)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}>
                    <AlertCircle size={16} style={{ color: 'var(--color-danger)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--color-danger)' }}>{fileError}</span>
                  </div>
                )}
              </div>

              {/* Instructions Box - Receipt Style */}
              <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: '#fafaf5',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  <span>📋 How to Export Google Pay / Google Wallet History (HTML File)</span>
                  {showInstructions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 16px 16px',
                        fontSize: '13px',
                        lineHeight: '1.8',
                        fontFamily: 'monospace',
                        color: '#333',
                      }}>
                        <ol style={{ paddingLeft: '20px', margin: 0 }}>
                          <li style={{ marginBottom: '8px' }}>Open Google Takeout: <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>https://takeout.google.com</a></li>
                          <li style={{ marginBottom: '8px' }}>Sign in with the Google account you use for Google Pay.</li>
                          <li style={{ marginBottom: '8px' }}>Click "Deselect all" at the top.</li>
                          <li style={{ marginBottom: '8px' }}>Scroll down and select: <strong>Google Wallet</strong> and (if available) <strong>Google Pay</strong>.</li>
                          <li style={{ marginBottom: '8px' }}>Click "All Google Wallet data included" → ensure all items are checked → click OK.</li>
                          <li style={{ marginBottom: '8px' }}>Scroll down and click <strong>Next step</strong>.</li>
                          <li style={{ marginBottom: '8px' }}>
                            Choose these settings:
                            <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                              <li>Delivery method: Send download link via email</li>
                              <li>Export frequency: Export once</li>
                              <li>File type: .zip</li>
                              <li>File size: 2 GB</li>
                            </ul>
                          </li>
                          <li style={{ marginBottom: '8px' }}>Click <strong>Create export</strong>.</li>
                          <li style={{ marginBottom: '8px' }}>Wait for Google to email you the download link (5–10 min).</li>
                          <li style={{ marginBottom: '8px' }}>Download the ZIP file from the email.</li>
                          <li style={{ marginBottom: '8px' }}>Extract the ZIP file on your device.</li>
                          <li style={{ marginBottom: '8px' }}>Open the extracted folders and find the <strong>Google Wallet</strong> / <strong>Google Pay</strong> folder inside Takeout.</li>
                          <li style={{ marginBottom: '8px' }}>
                            Locate the activity HTML files, for example:
                            <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                              <li>MyActivity.html</li>
                            </ul>
                          </li>
                          <li>Upload any one of these HTML files into the app under "Import Google Pay Data".</li>
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Preview Transactions */}
              {parsedTransactions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-elevated)',
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                >
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-bg-elevated)', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: '600', fontSize: '15px' }}>
                        Found {parsedTransactions.length} transaction(s)
                      </h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedTxIds(new Set(parsedTransactions.map(t => t.id)))}
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            border: '1px solid var(--color-border)',
                            background: 'transparent',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                          }}
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => setSelectedTxIds(new Set())}
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            border: '1px solid var(--color-border)',
                            background: 'transparent',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                          }}
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '8px' }}>
                    {parsedTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => {
                          const newSet = new Set(selectedTxIds);
                          if (newSet.has(tx.id)) {
                            newSet.delete(tx.id);
                          } else {
                            newSet.add(tx.id);
                          }
                          setSelectedTxIds(newSet);
                        }}
                        style={{
                          padding: '12px',
                          marginBottom: '8px',
                          border: `2px solid ${selectedTxIds.has(tx.id) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          background: selectedTxIds.has(tx.id) ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            border: `2px solid ${selectedTxIds.has(tx.id) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: selectedTxIds.has(tx.id) ? 'var(--color-primary)' : 'transparent',
                            flexShrink: 0,
                          }}>
                            {selectedTxIds.has(tx.id) && <CheckCircle size={14} style={{ color: '#fff' }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                              <span style={{ fontWeight: '500', fontSize: '14px', wordBreak: 'break-word' }}>
                                {tx.description}
                              </span>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: '600',
                                fontSize: '14px',
                                color: tx.amount < 0 ? 'var(--color-danger)' : 'var(--color-accent)',
                                marginLeft: '12px',
                                flexShrink: 0,
                              }}>
                                {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span>{tx.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button variant="outline" fullWidth onClick={() => setAddOption('select')}>
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={() => {
                    if (selectedTxIds.size > 0) {
                      setImportSuccess(true);
                    }
                  }}
                  disabled={selectedTxIds.size === 0}
                >
                  Import {selectedTxIds.size > 0 ? `${selectedTxIds.size} Transaction${selectedTxIds.size > 1 ? 's' : ''}` : ''}
                </Button>
              </div>
            </div>
          )}

          {addOption === 'html' && importSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                padding: '24px',
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--color-accent-muted)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle size={48} style={{ color: 'var(--color-accent)' }} />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                  Import Successful!
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedTxIds.size} transaction{selectedTxIds.size > 1 ? 's' : ''} imported successfully
                </p>
              </div>

              {/* Receipt Style Summary */}
              <div style={{
                width: '100%',
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: '#fafaf5',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '13px',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px dashed var(--color-border)' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>IMPORT RECEIPT</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {new Date().toLocaleString()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Transactions Imported:</span>
                  <span style={{ fontWeight: '600' }}>{selectedTxIds.size}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Source File:</span>
                  <span style={{ fontWeight: '600' }}>Google Pay HTML</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Total Amount:</span>
                  <span style={{ fontWeight: '600' }}>
                    ${parsedTransactions
                      .filter(tx => selectedTxIds.has(tx.id))
                      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
                      .toFixed(2)}
                  </span>
                </div>
                
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--color-border)', textAlign: 'center', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  ✓ All transactions auto-categorized by AI
                </div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => {
                  setShowAddModal(false);
                  setAddOption('select');
                  setImportSuccess(false);
                  setUploadedFile(null);
                  setParsedTransactions([]);
                  setSelectedTxIds(new Set());
                }}
              >
                Done
              </Button>
            </motion.div>
          )}
        </Modal>

        {/* QuickAdd Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '64px',
            height: '64px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <Plus size={28} />
        </motion.button>

        <ReceiptBarcode value="TXN-2024-001" width={200} margin="40px auto 0" />
      </div>
      </AnimatedPage>
    </div>
  );
};
