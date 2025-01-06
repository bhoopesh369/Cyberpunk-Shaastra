from fastapi import FastAPI,File, UploadFile, HTTPException, Body , status
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from typing import Dict, List
from helper import diversification, sector_diversification ,industry_diversification, ROI
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import PyPDF2 
import io

import os
from dotenv import load_dotenv

async def extract_text_from_pdf(file_content):
    try:
      pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
      text = ""
      for page in pdf_reader.pages:
          text += page.extract_text()
      return text
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None
    
app = FastAPI()

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")


genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    enum = [],
    required = ["ESG_Report"],
    properties = {
      "ESG_Report": content.Schema(
        type = content.Type.OBJECT,
        enum = [],
        required = ["year", "symbol", "Total_Score", "Environmental_Score", "Social_Score", "Governance_Score"],
        properties = {
          "year": content.Schema(
            type = content.Type.NUMBER,
          ),
          "symbol": content.Schema(
            type = content.Type.STRING,
          ),
          "Total_Score": content.Schema(
            type = content.Type.NUMBER,
          ),
          "Environmental_Score": content.Schema(
            type = content.Type.NUMBER,
          ),
          "Social_Score": content.Schema(
            type = content.Type.NUMBER,
          ),
          "Governance_Score": content.Schema(
            type = content.Type.NUMBER,
          ),
        },
      ),
    },
  ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
  system_instruction="you are an expert ESG surveyor that gives ESG RISK scores after reading the reports of company. Make sure you give the risk score properly after analyzing and extracting the documents",
)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def find_ticker_from_name(name):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    url_query = f'https://query2.finance.yahoo.com/v1/finance/search?q={name}&recommendCount=5'

    try:
        data = requests.get(url_query, headers=headers)
        data = json.loads(data.content)
        ticker = data['quotes'][0]['symbol']
        return ticker
    except (KeyError, IndexError):
        raise HTTPException(status_code=404, detail="Ticker not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ticker")
async def get_ticker(name: str):
    return {"ticker": find_ticker_from_name(name)}

@app.post("/diversify")
async def diversify_portfolio(
    budget_dollars: float = Body(..., embed=True),
    risk_tolerance: float = Body(..., embed=True),
    max_companies: int = Body(..., embed=True),
    min_value: float = Body(..., embed=True)
) -> Dict[str, float]:
    """
    Endpoint for basic diversification.
    """
    try:
        portfolio = diversification(budget_dollars, risk_tolerance, max_companies, min_value)
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/sector-diversify")
async def diversify_sector_portfolio(
    budget_dollars: float = Body(..., embed=True),
    risk_tolerance: float = Body(..., embed=True),
    max_companies: int = Body(..., embed=True),
    min_value: float = Body(..., embed=True),
    min_sectors: int = Body(..., embed=True)
) -> Dict[str, float]:
    """
    Endpoint for diversification with sector constraints.
    """
    try:
        portfolio = sector_diversification(budget_dollars, risk_tolerance, max_companies, min_value, min_sectors)
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/industry-diversify")
async def diversify_industry_portfolio(
    budget_dollars: float = Body(..., embed=True),
    risk_tolerance: float = Body(..., embed=True),
    max_companies: int = Body(..., embed=True),
    min_value: float = Body(..., embed=True),
    min_industries: int = Body(..., embed=True)
) -> Dict[str, float]:
    """
    Endpoint for diversification with industry constraints.
    """
    try:
        portfolio = industry_diversification(budget_dollars, risk_tolerance, max_companies, min_value, min_industries)
        return portfolio
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ROI")
async def get_ROI(
    ticker: str = Body(..., embed=True),
    years: int = Body(..., embed=True)
) -> Dict[str, float]:
    """
    Endpoint for calculating ROI.
    """
    try:
        roi, annualized_roi = ROI(ticker, years)
        return {"roi": roi, "annualized_roi": annualized_roi}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/upload-documents")
async def upload_documents(files: List[UploadFile] = File(...)):
    try:
        if not files:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No files were uploaded")

        all_responses = []
        for file in files:
            file_content = await file.read()
            print(f"Processing file: {file.filename}")
            
            text_content = None  # Initialize text_content
            
            # Attempt to read as UTF-8
            try:
                text_content = file_content.decode('utf-8')
                print(f"Text content from UTF-8: {text_content[:100]}...") # Print a snippet for large files
            except UnicodeDecodeError:
                # If UTF-8 fails, try PDF parsing
                if file.filename.lower().endswith(".pdf"):
                    text_content = await extract_text_from_pdf(file_content)
                    if text_content:
                        print(f"Text content extracted from PDF: {text_content[:100]}...")
                    else:
                        print("Failed to extract text from PDF")
            
            # Prepare response
            if text_content:
                prompt = f"give score based on sample scoree: {text_content}"
                response = model.generate_content(prompt)
                all_responses.append({
                    "file_name": file.filename,
                    "gemini_response": response.text
                })
            else:
                all_responses.append({
                    "file_name": file.filename,
                    "gemini_response": "Unable to read the file because it does not appear to be a readable text file or PDF"
                })
        
        return {"message": "Files processed successfully.", "responses": all_responses}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred: {e}") 



