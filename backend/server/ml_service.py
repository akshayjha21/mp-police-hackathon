from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
import pandas as pd
import joblib
from io import BytesIO
from datetime import datetime
from sklearn.ensemble import IsolationForest
import tempfile
import camelot  # for PDF parsing, install with: pip install camelot-py[cv]

app = FastAPI()

# Global model variable
model = None

def preprocess_features(df):
    df['startTime'] = pd.to_datetime(df['startTime'])
    df['endTime'] = pd.to_datetime(df['endTime'])
    df['duration'] = (df['endTime'] - df['startTime']).dt.total_seconds()
    df['hourOfDay'] = df['startTime'].dt.hour
    access_map = {'2G': 1, '3G': 2, '4G': 3, '5G': 4, '1G': -1, '6G': -1, 'Unknown': -1}
    df['accessTypeEncoded'] = df['accessType'].map(access_map).fillna(0)
    return df[['duration', 'uplinkVolume', 'downlinkVolume', 'hourOfDay', 'accessTypeEncoded']]

def train_model(json_path="non_suspicious_ipdr_10000.json"):
    df = pd.read_json(json_path)
    features = preprocess_features(df)
    clf = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    clf.fit(features)
    return clf

def parse_pdf(file_bytes):
    with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp.flush()
        tables = camelot.read_pdf(tmp.name, pages='all')
        if not tables:
            raise ValueError("No tables found in PDF")
        # Combine all tables
        df = pd.concat([table.df for table in tables], ignore_index=True)
        # Assume the first row is header, set columns and drop first row
        df.columns = df.iloc[0]
        df = df.drop(0).reset_index(drop=True)
        return df

@app.on_event("startup")
def startup_event():
    global model
    model = train_model()
    print("Model trained and ready.")

@app.post("/predict")
async def predict(file: UploadFile = File(None), request: Request = None):
    try:
        if file:
            contents = await file.read()
            filename = file.filename.lower()
            if filename.endswith(".csv"):
                df = pd.read_csv(BytesIO(contents))
            elif filename.endswith(".json"):
             df = pd.read_json(BytesIO(contents))
            elif filename.endswith(".pdf"):
                df = parse_pdf(contents)
            else:
                raise HTTPException(status_code=400, detail="Unsupported file format. Use CSV, JSON, or PDF.")
        else:
            # If no file, try to read JSON array from request body
            json_body = await request.json()
            if not isinstance(json_body, list):
                raise HTTPException(status_code=400, detail="Expected a list of records in JSON body")
            df = pd.DataFrame(json_body)

        # Check required columns exist
        required_cols = ['startTime', 'endTime', 'uplinkVolume', 'downlinkVolume', 'accessType']
        missing = [col for col in required_cols if col not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing columns in data: {missing}")

        features = preprocess_features(df)
        predictions = model.predict(features)  # -1 suspicious, 1 not suspicious

        # Create boolean suspicious flags: True = not suspicious, False = suspicious (for frontend)
        df['not_suspicious'] = [pred == 1 for pred in predictions]

        # Prepare simplified response: list of booleans
        response = df['not_suspicious'].tolist()

        return JSONResponse(content={"predictions": response})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
