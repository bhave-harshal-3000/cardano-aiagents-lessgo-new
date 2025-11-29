# Insights API Endpoint

## Overview
The Insights API endpoint analyzes your transaction data using Google Gemini LLM and returns financial insights, alerts, and spending suggestions.

## Endpoint Details

### URL
```
http://localhost:5001/api/insights
```

### Method
```
GET
```

### Description
Fetches all transactions from the database, analyzes them using the CrewAI framework with Gemini LLM, and returns:
- **Top spending categories** with amounts
- **Spending trends** over time
- **Average transaction amount**
- **Frequent payment methods**
- **Unusual transactions** (if any)
- **Income vs Expenses ratio**
- **Alerts** for overspending (fastfood, groceries, entertainment, etc.)
- **Suggestions** for optimizing spending
- **Key insights** and money-saving opportunities

### Response Format (Success)
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "category": "fastfood",
        "amount": 5000,
        "severity": "high",
        "reason": "Spending significantly on fast food"
      }
    ],
    "suggestions": [
      {
        "category": "groceries",
        "current_spend": 15000,
        "recommended_spend": 12000,
        "action": "Plan meals in advance to reduce grocery expenses"
      }
    ],
    "key_insights": [
      "Your largest spending category is food-related expenses",
      "Average transaction is ₹250"
    ],
    "opportunities": [
      "Consolidate multiple small transactions",
      "Reduce dining out frequency"
    ]
  }
}
```

### Response Format (Error)
```json
{
  "success": false,
  "error": "Error message here",
  "details": "Additional error details"
}
```

## How to Use in Postman

### Step 1: Open Postman
- Launch Postman application

### Step 2: Create New Request
- Click **+** to create a new request
- Or use Ctrl+Shift+N

### Step 3: Configure Request
1. **Request Type**: Select **GET** from dropdown
2. **URL**: Enter `http://localhost:5001/api/insights`
3. **Headers**: No special headers required (Content-Type is auto-handled)
4. **Body**: Leave empty (GET request)

### Step 4: Send Request
- Click the **Send** button
- Wait for the response (may take 30-60 seconds for AI analysis)

### Step 5: View Response
- The response appears in the **Body** tab below
- Response will be formatted as JSON

## Example Postman Request

```
GET http://localhost:5001/api/insights
```

No headers or body required.

## Prerequisites

Before using this endpoint:

1. **Backend Server Running**
   ```bash
   cd backend
   npm start
   ```

2. **Database Configured**
   - MongoDB must have transaction data
   - Ensure MONGODB_URI is set in backend/.env

3. **AI Backend Dependencies**
   - CrewAI installed
   - Gemini API key configured in backend/.env
   - Python 3.10+ installed

4. **Environment Variables** (backend/.env)
   ```
   MONGODB_URI=mongodb+srv://chirag:...
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5001
   ```

## Response Time
- **Typical**: 30-60 seconds (includes CSV export + AI analysis)
- **Maximum**: 120 seconds (timeout limit)

## What Happens Behind the Scenes

1. **CSV Export**: Exports all transactions from MongoDB to CSV
2. **Python Analysis**: Runs flexible parser to analyze spending patterns
3. **CrewAI Agents**: 
   - Financial Analyst Agent: Identifies trends and patterns
   - Budget Advisor Agent: Provides alerts and suggestions
4. **Gemini LLM**: Processes data and generates insights
5. **JSON Response**: Returns structured insights data

## Features

✅ **Spending Pattern Analysis**
- Identifies top spending categories
- Detects spending trends over time
- Calculates average transaction amounts

✅ **Smart Alerts**
- Alerts for overspending on specific categories
- Severity levels (high, medium, low)
- Explains why spending is high

✅ **Actionable Suggestions**
- Specific recommendations for each category
- Recommended spending limits
- Action items to reduce expenses

✅ **Key Insights**
- Most important findings
- Income vs expense analysis
- Money-saving opportunities

## Troubleshooting

### Error: Connection Refused (localhost:5001)
- Ensure backend server is running: `npm start` in backend folder
- Check if port 5001 is available

### Error: No transactions found
- Ensure you have uploaded transaction data
- Check MongoDB connection in .env file

### Error: Failed to generate insights
- Verify GEMINI_API_KEY is set correctly in backend/.env
- Check AI backend dependencies are installed
- Ensure Python path is configured

### Timeout (120 seconds)
- Large transaction datasets may take longer
- Consider exporting first with `/api/transactions`

## Integration Example

### Frontend (React/TypeScript)
```typescript
const fetchInsights = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/insights');
    const data = await response.json();
    
    if (data.success) {
      console.log('Insights:', data.data);
      // Display insights in UI
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch insights:', error);
  }
};
```

### cURL Command
```bash
curl -X GET http://localhost:5001/api/insights
```

### Python Requests
```python
import requests

response = requests.get('http://localhost:5001/api/insights')
insights = response.json()

if insights['success']:
    print(insights['data'])
else:
    print(f"Error: {insights['error']}")
```

## API Limits

- **Request Timeout**: 120 seconds
- **Max Transactions**: Unlimited (processes all)
- **Response Size**: Typically 2-10 KB
- **Rate Limit**: No limit (local endpoint)

## Support

For issues or questions:
1. Check backend logs: `npm start` output in terminal
2. Verify MongoDB connection
3. Ensure Gemini API key is valid
4. Check Python environment setup

---

**Created**: November 29, 2025
**Last Updated**: November 29, 2025
