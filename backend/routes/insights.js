import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get financial insights from transaction data
router.get('/', async (req, res) => {
  try {
    const aiBackendPath = path.join(__dirname, '..', '..', 'ai_backend');
    
    console.log('🚀 Running insights agent...');
    console.log('AI Backend path:', aiBackendPath);
    
    // Spawn Python process to run insights agent
    const pythonProcess = spawn('python', [path.join(aiBackendPath, 'run_insights.py')], {
      cwd: aiBackendPath,
      timeout: 120000 // 2 minute timeout for AI processing
    });
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error('[Insights] Python stderr:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
      console.log('[Insights] Python process exited with code:', code);
      
      if (code !== 0) {
        console.error('[Insights] Error output:', stderr);
        return res.status(500).json({
          success: false,
          error: 'Failed to generate insights',
          details: stderr
        });
      }
      
      try {
        // Parse the JSON output from Python script
        const result = JSON.parse(stdout);
        console.log('[Insights] Generated insights successfully');
        res.json(result);
      } catch (parseError) {
        console.error('[Insights] JSON parse error:', parseError.message);
        console.error('[Insights] Raw stdout:', stdout);
        res.status(500).json({
          success: false,
          error: 'Failed to parse insights response',
          details: parseError.message
        });
      }
    });
    
    pythonProcess.on('error', (error) => {
      console.error('[Insights] Process error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start insights agent',
        details: error.message
      });
    });
    
  } catch (error) {
    console.error('❌ Error in insights endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
