"""CrewAI Financial Analyst - Analyzes transactions and provides insights"""

import os
import json
import subprocess
import traceback
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from crewai.llm import LLM

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

gemini_llm = LLM(model="gemini-2.0-flash", api_key=GEMINI_API_KEY)

def export_transactions_to_csv(user_id=None):
    """Run the export script to get fresh transaction data
    
    Args:
        user_id: Optional user ID to filter transactions for specific user
    """
    try:
        export_script = os.path.join(os.path.dirname(__file__), 'export_transactions_to_csv.py')
        cmd = ['python', export_script]
        if user_id:
            cmd.append(user_id)
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            print(f"[ERROR] Export failed: {result.stderr}")
            return None
        
        csv_path = os.path.join(os.path.dirname(__file__), 'transactions_export.csv')
        if not os.path.exists(csv_path):
            print("[ERROR] CSV file not generated")
            return None
            
        return csv_path
    except Exception as e:
        print(f"[ERROR] Error exporting transactions: {e}")
        traceback.print_exc()
        return None

# ============================
# 👤 AGENT
# ============================

analyzer_agent = Agent(
    role="Financial Analyst",
    goal="Analyze spending patterns and provide insights, alerts, and recommendations",
    backstory="Expert at identifying financial patterns and anomalies",
    llm=gemini_llm,
    verbose=True
)

# ============================
# 🎯 TASK
# ============================

def create_analysis_task(csv_content: str) -> Task:
    """Create the analysis task with CSV data"""
    return Task(
        description=f"""Analyze this financial dataset and provide insights in STRICT JSON format ONLY:

{{
  "keyInsights": [
    {{"title": "string", "description": "string"}},
    {{"title": "string", "description": "string"}}
  ],
  "alerts": [
    {{"type": "string", "severity": "high|medium|low", "description": "string", "recommendation": "string"}}
  ],
  "suggestions": [
    {{"category": "string", "suggestion": "string"}}
  ]
}}
Note: ignore fields like category , transactionId, description if doesn't have informative data; that is not user's fault. use simple words
TRANSACTION DATA:
{csv_content}

Return ONLY the JSON object with no additional text.""",
        expected_output="Valid JSON with keyInsights, alerts, and suggestions",
        agent=analyzer_agent,
    )

# ============================
# 🚀 CREW & RUN
# ============================

def analyze_spending_patterns(user_id=None):
    """Main function to run the CrewAI financial analyzer
    
    Args:
        user_id: Optional user ID to filter transactions for specific user
    """
    try:
        if user_id:
            print(f"[INFO] Analyzing spending patterns for user: {user_id}")
        else:
            print("[INFO] Analyzing spending patterns for all transactions")
        
        csv_path = export_transactions_to_csv(user_id)
        if not csv_path:
            print("[ERROR] Failed to export transactions")
            return None
        
        with open(csv_path, 'r', encoding='utf-8') as f:
            csv_content = f.read()
        
        analysis_task = create_analysis_task(csv_content)
        crew = Crew(
            agents=[analyzer_agent],
            tasks=[analysis_task],
            verbose=True,
        )
        
        print("[INFO] Running CrewAI Financial Analyzer...")
        result = crew.kickoff()
        
        if result:
            if hasattr(result, 'raw'):
                return result.raw
            elif hasattr(result, 'output'):
                return result.output
            return str(result)
        
        return None
    except Exception as e:
        print(f"[ERROR] Error running insights agent: {str(e)}")
        traceback.print_exc()
        return None

def run_insights_agent(user_id=None):
    """Entry point for running the insights agent
    
    Args:
        user_id: Optional user ID to filter transactions for specific user
    """
    try:
        result = analyze_spending_patterns(user_id)
        if result:
            return json.dumps({"success": True, "data": str(result)}, indent=2)
        
        print("[ERROR] Failed to generate insights")
        return json.dumps({"success": False, "error": "Failed to generate insights"})
    except Exception as e:
        print(f"[ERROR] Error in run_insights_agent: {str(e)}")
        traceback.print_exc()
        return json.dumps({"success": False, "error": str(e)})

if __name__ == "__main__":
    insights = run_insights_agent()
    print(insights)
