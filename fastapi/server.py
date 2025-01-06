from fastapi import FastAPI, HTTPException
import requests
import json

app = FastAPI()

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