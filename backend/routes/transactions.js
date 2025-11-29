import express from 'express';
import Transaction from '../models/Transaction.js';

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

// Parse Google Pay HTML and extract transactions
const parseGPayHtml = (htmlContent) => {
  const transactions = [];
  
  try {
    // Multiple parsing strategies for different Google Pay/Google Wallet formats
    
    // Strategy 1: Look for common Google Takeout patterns
    const patterns = [
      // Pattern for amounts with various currency symbols
      {
        amount: /[₹$€£¥]\s*([\d,]+(?:\.\d{2})?)/g,
        date: /(\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[-\/\s]\d{2,4})/gi,
        altDate: /(\d{4}-\d{2}-\d{2})/g
      },
      // Pattern for numbers without currency symbols
      {
        amount: /(?:Amount|Total|Price)[\s:]*(?:[₹$€£¥])?\s*([\d,]+(?:\.\d{2})?)/gi,
        date: /(\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\/\s]\d{2,4})/gi,
        altDate: /(\d{4}-\d{2}-\d{2})/g
      }
    ];

    // Strategy 2: Parse by content cells (Google Material Design structure)
    const contentCellRegex = /<div class="content-cell[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    const cells = [...htmlContent.matchAll(contentCellRegex)];
    
    let tempData = {
      description: null,
      amount: null,
      date: null
    };
    
    cells.forEach((cell, index) => {
      const cellContent = cell[1].replace(/<[^>]*>/g, '').trim();
      
      // Try to extract amount
      const amountMatch = cellContent.match(/[₹$€£¥]?\s*([\d,]+(?:\.\d{2})?)/);
      if (amountMatch && parseFloat(amountMatch[1].replace(/,/g, '')) > 0) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (amount > 0 && amount < 1000000) { // Reasonable amount range
          tempData.amount = amount;
        }
      }
      
      // Try to extract date
      const dateMatch = cellContent.match(/(\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[-\/\s]\d{2,4})/i);
      const altDateMatch = cellContent.match(/(\d{4}-\d{2}-\d{2})/);
      
      if (dateMatch) {
        tempData.date = new Date(dateMatch[1]);
      } else if (altDateMatch) {
        tempData.date = new Date(altDateMatch[1]);
      }
      
      // Try to extract description (text without numbers/dates)
      if (cellContent.length > 3 && cellContent.length < 200 && 
          !cellContent.match(/^[\d,.\s₹$€£¥]+$/) && 
          !dateMatch && !altDateMatch) {
        tempData.description = cellContent;
      }
      
      // If we have all three fields or reached a boundary, save transaction
      if (tempData.description && tempData.amount && tempData.date) {
        transactions.push({
          description: tempData.description,
          amount: tempData.amount,
          date: tempData.date,
          type: 'expense',
          category: 'Uncategorized'
        });
        tempData = { description: null, amount: null, date: null };
      }
    });

    // Strategy 3: Parse line by line if no structured data found
    if (transactions.length === 0) {
      const lines = htmlContent.split(/\n/);
      let buffer = [];
      
      lines.forEach((line) => {
        const cleaned = line.replace(/<[^>]*>/g, '').trim();
        if (cleaned.length > 0) {
          buffer.push(cleaned);
        }
        
        // Process buffer when we have enough context (3-5 lines)
        if (buffer.length >= 3) {
          const text = buffer.join(' ');
          
          const amountMatch = text.match(/[₹$€£¥]?\s*([\d,]+(?:\.\d{2})?)/);
          const dateMatch = text.match(/(\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\/\s]\d{2,4})/i) || 
                           text.match(/(\d{4}-\d{2}-\d{2})/);
          const descMatch = buffer.find(b => b.length > 3 && b.length < 200 && 
                                        !b.match(/^[\d,.\s₹$€£¥-]+$/) && 
                                        !b.match(/\d{4}-\d{2}-\d{2}/) &&
                                        !b.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i));
          
          if (amountMatch && dateMatch && descMatch) {
            const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
            if (amount > 0 && amount < 1000000) {
              transactions.push({
                description: descMatch,
                amount: amount,
                date: new Date(dateMatch[1]),
                type: 'expense',
                category: 'Uncategorized'
              });
            }
          }
          
          buffer.shift(); // Remove oldest line from buffer
        }
      });
    }

    // Strategy 4: Look for table rows
    if (transactions.length === 0) {
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      const rows = [...htmlContent.matchAll(rowRegex)];
      
      rows.forEach(row => {
        const cells = row[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
        if (cells && cells.length >= 2) {
          const cellTexts = cells.map(c => c.replace(/<[^>]*>/g, '').trim());
          
          let desc = null, amt = null, dt = null;
          
          cellTexts.forEach(text => {
            if (!amt && text.match(/[\d,]+(?:\.\d{2})?/)) {
              const match = text.match(/([\d,]+(?:\.\d{2})?)/);
              if (match) {
                amt = parseFloat(match[1].replace(/,/g, ''));
              }
            }
            if (!dt && text.match(/\d{4}-\d{2}-\d{2}|\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)) {
              const match = text.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\/\s]\d{2,4})/i);
              if (match) {
                dt = new Date(match[0]);
              }
            }
            if (!desc && text.length > 3 && text.length < 200 && 
                !text.match(/^[\d,.\s₹$€£¥-]+$/) && !text.match(/\d{4}-\d{2}-\d{2}/)) {
              desc = text;
            }
          });
          
          if (desc && amt && dt && amt > 0 && amt < 1000000) {
            transactions.push({
              description: desc,
              amount: amt,
              date: dt,
              type: 'expense',
              category: 'Uncategorized'
            });
          }
        }
      });
    }

    // Remove duplicates based on description, amount, and date
    const uniqueTransactions = [];
    const seen = new Set();
    
    transactions.forEach(tx => {
      const key = `${tx.description}-${tx.amount}-${tx.date.toISOString()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTransactions.push(tx);
      }
    });
    
    return uniqueTransactions;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return [];
  }
};

// Create new transaction
router.post('/', async (req, res) => {
  try {
    // Check if this is an HTML file upload that needs parsing
    if (req.body.htmlFile && req.body.htmlFile.content) {
      const htmlContent = req.body.htmlFile.content;
      
      // Log HTML file info for debugging
      console.log('Parsing HTML file:', req.body.htmlFile.fileName);
      console.log('HTML content length:', htmlContent.length);
      console.log('HTML preview:', htmlContent.substring(0, 500));
      
      const parsedTransactions = parseGPayHtml(htmlContent);
      
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
          category: txData.category,
          description: txData.description,
          date: txData.date,
        });
        await transaction.save();
        savedTransactions.push(transaction);
      }
      
      return res.status(201).json({ 
        message: `Successfully imported ${savedTransactions.length} transactions`,
        count: savedTransactions.length,
        transactions: savedTransactions
      });
    }
    
    // Regular transaction creation
    const transaction = new Transaction(req.body);
    await transaction.save();
    
    // Return transaction without HTML content
    const responseData = transaction.toObject();
    if (responseData.htmlFile) {
      delete responseData.htmlFile.content;
    }
    
    res.status(201).json(responseData);
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
