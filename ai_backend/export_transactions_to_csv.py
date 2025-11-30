import pymongo
import pandas as pd
import os
import sys
from datetime import datetime
from bson.objectid import ObjectId
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(dotenv_path)

MONGO_URI = os.getenv('MONGODB_URI')
DB_NAME = 'financebot'

def export_transactions_to_csv(user_id=None):
    """Export transactions from MongoDB to CSV for AI analysis
    
    Args:
        user_id: Optional user ID to filter transactions. If provided, only that user's transactions are exported.
                 If None, exports all transactions.
    """
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Build filter
        filter_query = {}
        if user_id:
            try:
                filter_query['userId'] = ObjectId(user_id)
                print(f"[INFO] Filtering transactions for user: {user_id}")
            except Exception as e:
                print(f"[WARN] Invalid user_id format: {e}, exporting all transactions")
        
        transactions = list(db['transactions'].find(filter_query))
        
        if not transactions:
            print("[ERROR] No transactions found")
            return None
        
        df = pd.DataFrame(transactions)
        
        for col in ['_id', 'userId']:
            if col in df.columns:
                df[col] = df[col].astype(str)
        
        if 'htmlFile' in df.columns:
            df['htmlFile'] = df['htmlFile'].apply(
                lambda x: f"{x.get('fileName')} ({x.get('uploadDate')})" if isinstance(x, dict) else str(x)
            )
        
        if 'tags' in df.columns:
            df['tags'] = df['tags'].apply(lambda x: ','.join(x) if isinstance(x, list) else str(x))
        
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].apply(lambda x: x.isoformat() if isinstance(x, datetime) else x)
        
        cols = ['_id', 'userId', 'type', 'amount', 'currency', 'category', 'description',
                'recipient', 'paymentMethod', 'status', 'date', 'walletAddress', 'tags']
        df = df[[c for c in cols if c in df.columns] + [c for c in df.columns if c not in cols]]
        
        csv_path = os.path.join(os.path.dirname(__file__), 'transactions_export.csv')
        df.to_csv(csv_path, index=False, encoding='utf-8')
        client.close()
        print(f"[SUCCESS] Exported {len(df)} transactions")
        return csv_path
        
    except Exception as e:
        print(f"[ERROR] Export failed: {str(e)}")
        raise

if __name__ == '__main__':
    try:
        user_id = sys.argv[1] if len(sys.argv) > 1 else None
        export_transactions_to_csv(user_id)
    except Exception as e:
        print(f"[ERROR] {str(e)}", flush=True)
