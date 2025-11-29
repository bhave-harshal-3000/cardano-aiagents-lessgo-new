# 🚀 Deployment Guide: AI Insights Backend + Masumi Integration on Render

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Render Deployment](#render-deployment)
3. [Masumi Integration](#masumi-integration)
4. [Environment Configuration](#environment-configuration)
5. [Testing](#testing)
6. [Monitoring & Logs](#monitoring--logs)

---

## Prerequisites

### Required Accounts
- ✅ Render.com account (free tier available)
- ✅ Gemini API key (Google AI Studio)
- ✅ MongoDB cloud connection string
- ✅ Masumi account/API credentials (if applicable)

### Required Files (Already Created)
```
ai_backend/
├── app.py                           # Flask app with /insights endpoint
├── insights_agent.py                # CrewAI + Gemini LLM agent
├── export_transactions_to_csv.py    # MongoDB to CSV exporter
├── requirements.txt                 # Python dependencies
└── .env                            # Environment variables (DO NOT COMMIT)
```

---

## Render Deployment

### Step 1: Prepare for Deployment

#### Create `ai_backend/Procfile`
```
web: gunicorn app:app
```

#### Create `ai_backend/runtime.txt`
```
python-3.11.7
```

#### Update `requirements.txt` with production server
```bash
cd ai_backend
pip install gunicorn
pip freeze > requirements.txt
```

#### Create `.gitignore` (if not exists)
```
.env
__pycache__/
*.pyc
.DS_Store
ai_backend/__pycache__/
ai_backend/*.egg-info/
transactions_export.csv
```

### Step 2: Push to GitHub

```bash
cd "c:\Users\Lenovo\Desktop\cardano hack\new frontend\cardano-hackathon"

# Add all files
git add .

# Commit
git commit -m "feat: Add AI insights backend with CrewAI + Gemini integration"

# Push to main branch
git push origin main
```

### Step 3: Create Render Service

1. **Go to Render.com** → Dashboard → **Create new** → **Web Service**

2. **Connect Repository**
   - Select: `bhave-harshal-3000/cardano-lessgo`
   - Branch: `main`

3. **Configure Service**
   - **Name**: `cardano-insights-api`
   - **Root Directory**: `ai_backend` ✨ **IMPORTANT**
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

4. **Environment Variables** (Add in Render Dashboard)
   ```
   GEMINI_API_KEY = your_gemini_api_key_here
   MONGODB_URI = your_mongodb_connection_string
   INSIGHTS_API_PORT = 10000  # Render assigns this automatically
   FLASK_ENV = production
   ```

5. **Deploy**
   - Click **Create Web Service**
   - Render will auto-deploy from your GitHub repo
   - Wait for build to complete (~5-10 minutes)

### Step 4: Verify Deployment

Once deployed, you'll get a URL like:
```
https://cardano-insights-api.onrender.com
```

**Test the endpoint:**
```bash
# Health check
curl https://cardano-insights-api.onrender.com/health

# Get insights (first call might take 60+ seconds)
curl https://cardano-insights-api.onrender.com/insights
```

---

## Masumi Integration

### What is Masumi?

Masumi is an AI agent management/logging platform for tracking AI model usage, agent interactions, and audit trails.

### Integration Steps

#### Option A: Masumi API Logging

Create `ai_backend/masumi_logger.py`:

```python
import requests
import json
from datetime import datetime
import os

class MasumiLogger:
    """Log AI agent activities to Masumi"""
    
    def __init__(self, masumi_api_key, masumi_endpoint):
        self.api_key = masumi_api_key
        self.endpoint = masumi_endpoint
        self.headers = {
            "Authorization": f"Bearer {masumi_api_key}",
            "Content-Type": "application/json"
        }
    
    def log_agent_activity(self, agent_name, action, status, details):
        """Log agent activity to Masumi"""
        try:
            payload = {
                "timestamp": datetime.utcnow().isoformat(),
                "agent_name": agent_name,
                "action": action,
                "status": status,
                "details": details,
                "service": "cardano-insights-api"
            }
            
            response = requests.post(
                f"{self.endpoint}/logs",
                json=payload,
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ Masumi log recorded: {agent_name} - {action}")
                return True
            else:
                print(f"❌ Masumi error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error logging to Masumi: {str(e)}")
            return False
    
    def log_insights_generation(self, user_id, transaction_count, result_status):
        """Log insights generation"""
        self.log_agent_activity(
            agent_name="Senior Financial Analyst",
            action="generate_insights",
            status=result_status,
            details={
                "user_id": user_id,
                "transaction_count": transaction_count,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
    
    def log_api_call(self, endpoint, method, status_code, duration_ms):
        """Log API calls"""
        self.log_agent_activity(
            agent_name="Flask API",
            action=f"{method} {endpoint}",
            status="success" if status_code < 400 else "error",
            details={
                "status_code": status_code,
                "duration_ms": duration_ms
            }
        )
```

#### Option B: Integrate Masumi Logger in app.py

Update `ai_backend/app.py`:

```python
from flask import Flask, jsonify, request
from insights_agent import analyze_spending_patterns
from masumi_logger import MasumiLogger
import json
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize Masumi Logger (optional)
MASUMI_API_KEY = os.getenv('MASUMI_API_KEY')
MASUMI_ENDPOINT = os.getenv('MASUMI_ENDPOINT', 'https://masumi.io/api')

masumi_logger = None
if MASUMI_API_KEY:
    masumi_logger = MasumiLogger(MASUMI_API_KEY, MASUMI_ENDPOINT)
    print("✅ Masumi logger initialized")
else:
    print("⚠️ Masumi logging disabled (no API key)")

@app.route('/insights', methods=['GET'])
def get_insights():
    """Get financial insights from transaction data"""
    start_time = time.time()
    
    try:
        print("🚀 Generating financial insights...")
        
        # Run the insights agent
        analysis_result = analyze_spending_patterns()
        
        if analysis_result is None:
            if masumi_logger:
                masumi_logger.log_insights_generation(
                    user_id="unknown",
                    transaction_count=0,
                    result_status="failed"
                )
            
            return jsonify({
                "success": False,
                "error": "No analysis result",
                "message": "Failed to generate insights"
            }), 500
        
        # Convert CrewOutput to string
        result_str = str(analysis_result).strip()
        
        # Extract JSON from the result
        try:
            json_start = result_str.find('{')
            json_end = result_str.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = result_str[json_start:json_end]
                analysis_data = json.loads(json_str)
            else:
                raise ValueError("No JSON found in response")
            
            # Validate structure
            if "keyInsights" not in analysis_data or "alerts" not in analysis_data or "suggestions" not in analysis_data:
                raise ValueError("Missing required fields")
            
            # Log successful analysis to Masumi
            if masumi_logger:
                masumi_logger.log_insights_generation(
                    user_id="default_user",
                    transaction_count=528,  # Update dynamically if possible
                    result_status="success"
                )
            
            response = {
                "success": True,
                "keyInsights": analysis_data.get("keyInsights", []),
                "alerts": analysis_data.get("alerts", []),
                "suggestions": analysis_data.get("suggestions", [])
            }
            
            # Log API call
            duration_ms = int((time.time() - start_time) * 1000)
            if masumi_logger:
                masumi_logger.log_api_call("/insights", "GET", 200, duration_ms)
            
            return jsonify(response), 200
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {str(e)}")
            
            if masumi_logger:
                masumi_logger.log_agent_activity(
                    agent_name="JSON Parser",
                    action="parse_response",
                    status="error",
                    details={"error": str(e)}
                )
            
            return jsonify({
                "success": False,
                "error": f"Invalid JSON response from AI: {str(e)}",
                "message": "Failed to parse insights"
            }), 500
        
    except Exception as e:
        print(f"❌ Error generating insights: {str(e)}")
        
        if masumi_logger:
            masumi_logger.log_agent_activity(
                agent_name="Insights API",
                action="generate_insights",
                status="error",
                details={"error": str(e)}
            )
        
        duration_ms = int((time.time() - start_time) * 1000)
        if masumi_logger:
            masumi_logger.log_api_call("/insights", "GET", 500, duration_ms)
        
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to generate insights"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Cardano Insights API",
        "version": "1.0.0",
        "masumi_enabled": masumi_logger is not None
    }), 200

@app.route('/', methods=['GET'])
def index():
    """API documentation"""
    return jsonify({
        "name": "Cardano Insights API",
        "version": "1.0.0",
        "endpoints": {
            "GET /health": "Health check",
            "GET /insights": "Get financial insights from transaction data"
        },
        "documentation": "Use Postman to access /insights endpoint"
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('INSIGHTS_API_PORT', 5002))
    app.run(debug=False, host='0.0.0.0', port=port)
```

#### Step 1: Add Masumi to requirements.txt
```bash
# In ai_backend/requirements.txt, add:
requests>=2.31.0
```

#### Step 2: Add Masumi Environment Variables in Render

In Render Dashboard → Environment:
```
MASUMI_API_KEY = your_masumi_api_key
MASUMI_ENDPOINT = https://masumi.io/api  # or your Masumi instance
```

---

## Environment Configuration

### Local Development (.env file)
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/financebot?retryWrites=true&w=majority

# Flask
FLASK_ENV=development
INSIGHTS_API_PORT=5002

# Masumi (Optional)
MASUMI_API_KEY=your_masumi_api_key
MASUMI_ENDPOINT=https://masumi.io/api
```

### Production (Render Environment Variables)
```env
GEMINI_API_KEY=[paste your key]
MONGODB_URI=[paste your connection string]
FLASK_ENV=production
INSIGHTS_API_PORT=10000
MASUMI_API_KEY=[paste your key]
MASUMI_ENDPOINT=https://masumi.io/api
```

---

## Testing

### Test Deployed Endpoint

```bash
# Health check
curl https://cardano-insights-api.onrender.com/health

# Get insights (takes 60+ seconds first time)
curl -X GET https://cardano-insights-api.onrender.com/insights \
  -H "Content-Type: application/json"
```

### Postman Testing

1. **Create new collection**: `Cardano Production`
2. **Add variable**: `base_url = https://cardano-insights-api.onrender.com`
3. **Create GET request** to `{{base_url}}/insights`
4. Send and check response

Expected Response:
```json
{
  "success": true,
  "keyInsights": [
    {
      "title": "...",
      "description": "..."
    }
  ],
  "alerts": [...],
  "suggestions": [...]
}
```

---

## Monitoring & Logs

### View Render Logs
1. Go to Render Dashboard
2. Select `cardano-insights-api` service
3. Click **Logs** tab
4. Monitor real-time output

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Check `requirements.txt` in Render build logs |
| `GEMINI_API_KEY not found` | Verify environment variable in Render |
| `502 Bad Gateway` | Service crashed; check logs for errors |
| `504 Gateway Timeout` | Insights generation taking too long; increase timeout or optimize CSV |
| Masumi logs not appearing | Verify `MASUMI_API_KEY` and `MASUMI_ENDPOINT` |

### Monitor Masumi Logs
1. Go to Masumi Dashboard (https://masumi.io or your instance)
2. Filter by agent: `Senior Financial Analyst`
3. View activity logs and timestamps

---

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test `/insights` endpoint
3. ✅ Integrate Masumi logging
4. ✅ Monitor logs on Render & Masumi
5. ✅ Connect frontend to production API

---

## Frontend Integration

Update your frontend to call production API:

```typescript
// frontend/src/services/api.ts
const INSIGHTS_API = process.env.NODE_ENV === 'production' 
  ? 'https://cardano-insights-api.onrender.com'
  : 'http://localhost:5002';

export async function getInsights() {
  const response = await fetch(`${INSIGHTS_API}/insights`);
  return response.json();
}
```

---

## Support

For issues:
- **Render Support**: https://render.com/docs
- **Gemini API Docs**: https://ai.google.dev
- **CrewAI Docs**: https://docs.crewai.com
- **Masumi Support**: Check your Masumi dashboard documentation
