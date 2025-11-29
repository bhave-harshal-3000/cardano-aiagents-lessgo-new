"""
Insights Agent using CrewAI with Gemini LLM
Analyzes transaction data and provides financial insights, alerts, and suggestions
"""

import os
import json
import subprocess
import re
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from crewai_tools import tool

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(dotenv_path)

# Initialize Gemini API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# Set environment variable for CrewAI to use Gemini
os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY

def export_transactions_to_csv():
    """Run the export script to get fresh transaction data"""
    try:
        export_script = os.path.join(os.path.dirname(__file__), 'export_transactions_to_csv.py')
        result = subprocess.run(
            ['python', export_script],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode != 0:
            print(f"Export script error: {result.stderr}")
            return None
        
        # CSV is generated as transactions_export.csv
        csv_path = os.path.join(os.path.dirname(__file__), 'transactions_export.csv')
        if os.path.exists(csv_path):
            return csv_path
        else:
            print("CSV file not generated")
            return None
    except Exception as e:
        print(f"Error exporting transactions: {e}")
        return None

@tool
def read_csv_file(file_path: str) -> str:
    """Read and return CSV file content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {e}"

def analyze_spending_patterns():
    """
    Main function to run the Insights Agent using CrewAI
    """
    
    # Step 1: Export latest transactions to CSV
    print("📊 Exporting transactions...")
    csv_path = export_transactions_to_csv()
    
    if not csv_path:
        print("Failed to export transactions")
        return None
    
    print(f"✅ Transactions exported to: {csv_path}")
    
    # Step 2: Read CSV content
    with open(csv_path, 'r', encoding='utf-8') as f:
        csv_content = f.read()
    
    print("📝 Setting up CrewAI agents with Gemini...")
    
    # Step 3: Create Agents with Gemini
    
    # Financial Analyst Agent
    analyst_agent = Agent(
        role="Financial Analyst",
        goal="Analyze spending patterns and transaction data to identify trends, anomalies, and opportunities for financial improvement",
        backstory="You are an expert financial analyst with years of experience in personal finance management. "
                 "You excel at identifying spending patterns, detecting anomalies, and providing actionable insights. "
                 "You work with detailed transaction data to provide comprehensive financial analysis.",
        tools=[read_csv_file],
        model="gemini-1.5-pro",
        temperature=0.7,
        verbose=True
    )
    
    # Budget Advisor Agent
    advisor_agent = Agent(
        role="Budget Advisor",
        goal="Provide targeted suggestions and alerts based on spending analysis to help optimize personal finances",
        backstory="You are a certified financial advisor specializing in personal budget optimization. "
                 "You provide clear, actionable recommendations to help people manage their money better. "
                 "You focus on identifying high-spending areas and suggesting practical ways to reduce expenses.",
        tools=[read_csv_file],
        model="gemini-1.5-pro",
        temperature=0.7,
        verbose=True
    )
    
    # Step 4: Create Tasks
    
    analysis_task = Task(
        description=f"""Analyze the following CSV transaction data and provide comprehensive financial insights:

CSV DATA:
{csv_content}

Please analyze this data and identify:
1. Top spending categories with amounts
2. Spending trends over time
3. Average transaction amount
4. Most frequent payment methods
5. Any unusual or significant transactions
6. Income vs Expenses ratio

Format your response as valid JSON with these exact keys:
- top_categories: list of top 5 spending categories with amounts
- spending_trends: description of spending patterns
- average_transaction: average transaction amount
- frequent_methods: most used payment methods
- unusual_transactions: any notable transactions
- income_expense_ratio: ratio of income to expenses

Return ONLY valid JSON, no other text or explanation.""",
        agent=analyst_agent,
        expected_output="JSON formatted financial analysis"
    )
    
    suggestions_task = Task(
        description=f"""Based on the CSV transaction data provided, create specific alerts and suggestions:

CSV DATA:
{csv_content}

Please provide:
1. ALERTS: Spending categories where there is excessive spending (categorize by severity: high, medium, low)
   - Identify overspending on fastfood, groceries, entertainment, shopping, etc.
   - Only flag if spending is notably high compared to average transactions
2. SUGGESTIONS: Specific recommendations to optimize spending for each category
3. KEY_INSIGHTS: Most important findings from analyzing the transaction data
4. OPPORTUNITIES: Concrete ways to save money and improve financial health

Format your response as valid JSON with these exact keys:
- alerts: list of alert objects with {{category, amount, severity, reason}}
- suggestions: list of suggestion objects with {{category, current_spend, recommended_spend, action}}
- key_insights: list of important insights as strings
- opportunities: list of money-saving opportunities as strings

Return ONLY valid JSON, no other text or explanation.""",
        agent=advisor_agent,
        expected_output="JSON formatted alerts and suggestions"
    )
    
    # Step 5: Create and run Crew
    crew = Crew(
        agents=[analyst_agent, advisor_agent],
        tasks=[analysis_task, suggestions_task],
        verbose=True,
        memory=True
    )
    
    print("\n🚀 Running CrewAI Insights Analysis with Gemini...")
    result = crew.kickoff()
    
    return result

def parse_json_response(response_text: str) -> dict:
    """Extract JSON from response text"""
    try:
        # Try direct JSON parse first
        return json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from text
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                return {"raw_response": response_text}
        return {"raw_response": response_text}

def run_insights_agent():
    """
    Entry point for running the insights agent
    Returns JSON with insights, alerts, and suggestions
    """
    try:
        result = analyze_spending_patterns()
        
        if result:
            print("\n" + "="*60)
            print("✅ INSIGHTS ANALYSIS COMPLETE")
            print("="*60)
            
            # Try to parse the response
            if isinstance(result, str):
                parsed_result = parse_json_response(result)
            else:
                parsed_result = result
            
            # Return as JSON string
            return json.dumps({"success": True, "data": parsed_result}, indent=2)
        else:
            print("❌ Failed to generate insights")
            return json.dumps({"success": False, "error": "Failed to generate insights"})
            
    except Exception as e:
        print(f"❌ Error running insights agent: {e}")
        import traceback
        traceback.print_exc()
        return json.dumps({"success": False, "error": str(e)})

if __name__ == "__main__":
    insights = run_insights_agent()
    print(insights)
