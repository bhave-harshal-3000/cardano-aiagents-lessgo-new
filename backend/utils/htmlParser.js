import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Call the Python flexible parser to parse Google Pay HTML
 * Returns transactions with all extracted fields mapped to MongoDB schema
 */
export const parseGPayHtmlWithPython = (htmlContent, fileName = 'unknown.html') => {
  return new Promise((resolve, reject) => {
    try {
      // Create temporary HTML file
      const tempDir = path.join(__dirname, '..', '..', 'ai_backend', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFileName = `temp_${Date.now()}.html`;
      const tempFilePath = path.join(tempDir, tempFileName);
      fs.writeFileSync(tempFilePath, htmlContent, 'utf-8');
      
      console.log('[htmlParser] Temp file created:', tempFilePath);
      console.log('[htmlParser] Temp file size:', fs.statSync(tempFilePath).size);
      console.log('[htmlParser] Calling Python parser...');

      // Run Python parser
      const pythonScript = path.join(__dirname, '..', '..', 'ai_backend', 'parse_html_to_json.py');
      
      const python = spawn('python', [pythonScript, tempFilePath]);

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFilePath);
        } catch (e) {
          console.error('Failed to cleanup temp file:', e);
        }

        console.log('[htmlParser] Python process exited with code:', code);
        console.log('[htmlParser] Stdout length:', stdout.length);
        console.log('[htmlParser] Stderr:', stderr);
        console.log('[htmlParser] Stdout preview (first 500):', stdout.substring(0, 500));

        if (code !== 0) {
          console.error('Python script error:', stderr);
          reject(new Error(`Python parser failed: ${stderr}`));
          return;
        }

        try {
          const parsed = JSON.parse(stdout);
          console.log('[htmlParser] Parsed transactions count:', parsed.length);
          
          // Map Python parser output to MongoDB schema
          const transactions = parsed.map(tx => ({
            type: tx.amount > 0 ? 'expense' : 'income',
            amount: Math.abs(tx.amount),
            currency: tx.currency || 'USD',
            category: 'Uncategorized', // Will be categorized later
            description: tx.recipient || 'Transaction',
            recipient: tx.recipient,
            paymentMethod: tx.payment_method,
            accountNumber: tx.account_number,
            transactionId: tx.transaction_id,
            status: tx.status || 'Completed',
            date: new Date(tx.timestamp),
            inputSource: 'UPI', // HTML parsing = UPI input
            tags: ['imported', 'html-parse'],
            htmlFile: {
              fileName: fileName,
              uploadDate: new Date(),
              // Note: don't store content in each transaction to save space
            }
          }));

          resolve(transactions);
        } catch (err) {
          console.error('Failed to parse Python output:', err);
          reject(new Error(`Failed to parse Python output: ${err.message}`));
        }
      });

      python.on('error', (err) => {
        reject(new Error(`Failed to spawn Python process: ${err.message}`));
      });
    } catch (error) {
      reject(error);
    }
  });
};
