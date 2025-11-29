import express from 'express';
import Transaction from '../models/Transaction.js';
import { parseGPayHtmlWithPython } from '../utils/htmlParser.js';

const router = express.Router();

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .select('-htmlFile.content') // Exclude HTML content from response
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    // Check if this is an HTML file upload that needs parsing
    if (req.body.htmlFile && req.body.htmlFile.content) {
      const htmlContent = req.body.htmlFile.content;
      const fileName = req.body.htmlFile.fileName;
      
      console.log('\n========== HTML UPLOAD DEBUG ==========');
      console.log('Parsing HTML file:', fileName);
      console.log('HTML content type:', typeof htmlContent);
      console.log('HTML content length:', htmlContent.length);
      console.log('HTML is string:', typeof htmlContent === 'string');
      console.log('HTML starts with:', htmlContent.substring(0, 200));
      console.log('HTML ends with:', htmlContent.substring(htmlContent.length - 200));
      console.log('HTML contains "<html":', htmlContent.includes('<html'));
      console.log('HTML contains "₹":', htmlContent.includes('₹'));
      console.log('HTML contains "Sent":', htmlContent.includes('Sent'));
      console.log('HTML contains "Received":', htmlContent.includes('Received'));
      console.log('HTML contains "outer-cell":', htmlContent.includes('outer-cell'));
      console.log('HTML contains "Google Pay":', htmlContent.includes('Google Pay'));
      console.log('========================================\n');
      
      try {
        // Use Python flexible parser
        const parsedTransactions = await parseGPayHtmlWithPython(htmlContent, fileName);
        
        console.log('Parsed transactions count:', parsedTransactions.length);
        if (parsedTransactions.length > 0) {
          console.log('Sample transaction:', JSON.stringify(parsedTransactions[0], null, 2));
        }
        
        if (parsedTransactions.length === 0) {
          return res.status(400).json({ 
            error: 'No transactions found in HTML file. Please ensure you uploaded a valid Google Pay/Google Wallet activity file. The file should contain transaction history with amounts, dates, and descriptions.' 
          });
        }
        
        // Save all parsed transactions to database
        const savedTransactions = [];
        for (const txData of parsedTransactions) {
          const transaction = new Transaction({
            userId: req.body.userId,
            type: txData.type,
            amount: txData.amount,
            currency: txData.currency,
            category: txData.category,
            description: txData.description,
            recipient: txData.recipient,
            paymentMethod: txData.paymentMethod,
            accountNumber: txData.accountNumber,
            transactionId: txData.transactionId,
            status: txData.status,
            date: txData.date,
            UPI: 1,           // HTML import
            UserInput: 0,     // Not manual input
            tags: txData.tags,
            htmlFile: {
              fileName: fileName,
              uploadDate: new Date(),
            }
          });
          await transaction.save();
          savedTransactions.push(transaction);
        }
        
        return res.status(201).json({ 
          message: `Successfully imported ${savedTransactions.length} transactions`,
          count: savedTransactions.length,
          transactions: savedTransactions
        });
      } catch (parseError) {
        console.error('HTML parsing error:', parseError);
        return res.status(400).json({ 
          error: `Failed to parse HTML: ${parseError.message}` 
        });
      }
    }
    
    // Regular transaction creation (manual text input)
    const transactionData = {
      ...req.body,
      UPI: 0,           // Not HTML import
      UserInput: 1      // Manual text input
    };
    
    const transaction = new Transaction(transactionData);
    await transaction.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.params.userId };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query);
    
    const stats = {
      totalIncome: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpense: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      transactionCount: transactions.length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
