# import json
# import pandas as pd
# import requests



# import requests
# from bs4 import BeautifulSoup

# URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
# response = requests.get(URL)
# soup = BeautifulSoup(response.content, 'html.parser')

# # Find the table containing the list of S&P 500 companies
# table = soup.find('table', {'id': 'constituents'})

# # Extract company names from the table
# companies_500 = []
# for row in table.findAll('tr')[1:]:
#     columns = row.findAll('td')
#     company_name = columns[0].get_text(strip=True)
#     companies_500.append(company_name)

# # print(companies_500)




# headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
#     }

# # query = 'Apple'

# # url_query = 'https://query2.finance.yahoo.com/v1/finance/search?q='+query +'&recommendCount=5'

# # data = requests.get(url_query, headers=headers)
# # data = json.loads(data.content)
# # ticker = data['quotes'][0]['symbol']

# for ticker in companies_500:


#     url = 'https://query2.finance.yahoo.com/v1/finance/esgChart?symbol=' + ticker


#     # url = "https://finance.yahoo.com/quote/" + ticker + "/sustainability"


#     data = requests.get(url, headers=headers)
#     data = json.loads(data.content)



# import json
# import pandas as pd
# import requests
# from bs4 import BeautifulSoup

# # Fetch the list of S&P 500 companies
# URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
# response = requests.get(URL)
# soup = BeautifulSoup(response.content, 'html.parser')

# # Find the table containing the list of S&P 500 companies
# table = soup.find('table', {'id': 'constituents'})

# # Extract company tickers from the table
# companies_500 = []
# for row in table.findAll('tr')[1:]:
#     columns = row.findAll('td')
#     ticker = columns[0].get_text(strip=True)
#     companies_500.append(ticker)

# # Prepare headers for the API requests
# headers = {
#     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
# }

# # Initialize an empty list to store the data
# esg_data = []

# # Loop through each ticker to fetch ESG data
# for ticker in companies_500:
#     url = f'https://query2.finance.yahoo.com/v1/finance/esgChart?symbol={ticker}'
#     try:
#         response = requests.get(url, headers=headers)
#         data = json.loads(response.content)
        
#         # Extract relevant fields if available
#         esg_chart = data.get('esgChart', {}).get('result', [])
#         if esg_chart:
#             result = esg_chart[0]
#             esg_scores = result.get('symbolSeries', {})
#             timestamps = esg_scores.get('timestamp', [])
#             esg_score = esg_scores.get('esgScore', [])
#             governance_score = esg_scores.get('governanceScore', [])
#             environment_score = esg_scores.get('environmentScore', [])
#             social_score = esg_scores.get('socialScore', [])
            
#             # Combine all data for the ticker
#             for i in range(len(timestamps)):
#                 esg_data.append({
#                     'Ticker': ticker,
#                     'Timestamp': timestamps[i],
#                     'ESG Score': esg_score[i] if i < len(esg_score) else None,
#                     'Governance Score': governance_score[i] if i < len(governance_score) else None,
#                     'Environment Score': environment_score[i] if i < len(environment_score) else None,
#                     'Social Score': social_score[i] if i < len(social_score) else None
#                 })
#     except Exception as e:
#         print(f"Failed to fetch data for {ticker}: {e}")

#     print(f"Processed data for {ticker}.")

# # Convert the data into a Pandas DataFrame
# df = pd.DataFrame(esg_data)

# # Write the data to a CSV file
# output_file = "esg_data_sp500.csv"
# df.to_csv(output_file, index=False)

# print(f"ESG data has been written to {output_file}.")

def find_ticker_from_name(name):
    import requests
    import json

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }

    url_query = 'https://query2.finance.yahoo.com/v1/finance/search?q='+name +'&recommendCount=5'

    data = requests.get(url_query, headers=headers)
    data = json.loads(data.content)
    ticker = data['quotes'][0]['symbol']

    return ticker


import pandas as pd

df = pd.read_csv('rating-per-year.csv')

# sort csv by ticker

df = df.sort_values(by=['Company_Symbol', 'year'])

# write to csv

df.to_csv('rating-per-year.csv', index=False)



