# 🚀 Quick Deployment Checklist

## Pre-Deployment (Local)

- [ ] Update `requirements.txt`:
  ```bash
  cd ai_backend
  pip install gunicorn requests
  pip freeze > requirements.txt
  ```

- [ ] Create `Procfile` ✅ (already created)

- [ ] Verify `.env` has all keys:
  - `GEMINI_API_KEY`
  - `MONGODB_URI`
  - `MASUMI_API_KEY` (optional)

- [ ] Test locally:
  ```bash
  python app.py
  curl http://localhost:5002/health
  curl http://localhost:5002/insights
  ```

## GitHub Push

```bash
git add .
git commit -m "Deploy: AI insights backend with Masumi integration"
git push origin main
```

## Render Deployment (5 Steps)

### 1. Go to Render.com → Dashboard

### 2. Click "New" → "Web Service"

### 3. Connect GitHub Repository
- Select: `bhave-harshal-3000/cardano-lessgo`
- Branch: `main`

### 4. Configure Service
```
Name:              cardano-insights-api
Root Directory:    ai_backend
Runtime:           Python 3
Build Command:     pip install -r requirements.txt
Start Command:     gunicorn app:app
```

### 5. Add Environment Variables (CRITICAL)

In Render Dashboard → Environment:

```env
GEMINI_API_KEY=<your-gemini-key>
MONGODB_URI=<your-mongodb-connection-string>
MASUMI_API_KEY=<your-masumi-api-key>
MASUMI_ENDPOINT=https://masumi.io/api
FLASK_ENV=production
```

### 6. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for build

## Post-Deployment Testing

```bash
# Replace with your Render URL
RENDER_URL="https://cardano-insights-api.onrender.com"

# Health check
curl $RENDER_URL/health

# Get insights (takes 60+ seconds)
curl -X GET $RENDER_URL/insights

# Check Masumi logs (from Masumi dashboard)
# Look for agent: "Senior Financial Analyst"
```

## Monitoring

### Render Logs
- URL: https://dashboard.render.com
- Service: cardano-insights-api
- Logs tab: Real-time output

### Masumi Logs
- URL: https://masumi.io or your instance
- Filter by agent: "Senior Financial Analyst"
- View all activity

## Troubleshooting

### 502 Bad Gateway
```
Check Render logs for errors:
1. Module import errors → verify requirements.txt
2. API key issues → verify environment variables
3. MongoDB connection → test MONGODB_URI locally
```

### 504 Timeout
```
Insights generation taking too long:
1. First call: May take 60+ seconds (normal)
2. Subsequent calls: Should be faster
3. If persists: Increase Render plan or optimize CSV
```

### Masumi Not Logging
```
1. Verify MASUMI_API_KEY in Render environment
2. Verify MASUMI_ENDPOINT is correct
3. Check app logs: Look for "Masumi logger initialized"
4. Test locally: python app.py
```

## API Endpoints

### Production URLs

```
Health Check:
GET https://cardano-insights-api.onrender.com/health

Get Insights:
GET https://cardano-insights-api.onrender.com/insights

Expected Response:
{
  "success": true,
  "keyInsights": [...],
  "alerts": [...],
  "suggestions": [...]
}
```

## Frontend Integration

```typescript
// Use production URL
const API_URL = 'https://cardano-insights-api.onrender.com';

fetch(`${API_URL}/insights`)
  .then(res => res.json())
  .then(data => console.log(data.keyInsights))
```

## Useful Commands

```bash
# Check Render service status
curl https://cardano-insights-api.onrender.com/health

# Monitor logs in real-time
# (Use Render dashboard Logs tab)

# Trigger rebuild (in Render dashboard)
# Settings → Redeploy

# Check environment variables (in Render dashboard)
# Settings → Environment
```

## Success Indicators ✅

- [ ] Render deployment shows "Active" (green)
- [ ] Health endpoint returns 200 OK
- [ ] Insights endpoint returns JSON (takes time first call)
- [ ] Masumi shows agent logs in dashboard
- [ ] Frontend can fetch insights from production URL

---

**Estimated Time: 15-20 minutes**

Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions!
