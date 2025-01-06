from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from typing import Dict
from helper import diversification, sector_diversification, industry_diversification # Import helper functions


app = FastAPI()

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