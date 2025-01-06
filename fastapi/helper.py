import pulp
import pandas as pd
import logging
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


df = pd.read_csv('averaged_scores_sector_with_beta.csv')


def diversification(budget_dollars, risk_tolerance, max_companies, min_value):
    """
    Calculates a diversified portfolio with constraints using PuLP.

    Args:
        budget_dollars (float): Total budget for the portfolio.
        risk_tolerance (float):  Maximum beta-weighted allocation, as fraction of budget.
        max_companies (int): Maximum number of companies to include in the portfolio.
        min_value (float): Minimum fraction of the budget to allocate to each company.

    Returns:
         dict: A dictionary of company symbols and their allocated amounts.
    """
    # Define the problem
    problem = pulp.LpProblem("Minimize_Total_Score", pulp.LpMinimize)

    # Decision variables
    companies = df['Company_Symbol']
    x = pulp.LpVariable.dicts("Allocation", companies, lowBound=0, upBound=budget_dollars)  # Dollars allocated to each company
    y = pulp.LpVariable.dicts("Include", companies, cat="Binary")  # Binary variable: 1 if company is included, 0 otherwise

    # Objective function: Minimize Total Score (ESG Risk)
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0] for company in companies]), "Total_Score"

    # Constraints
    # 1. Budget constraint: Sum of allocations <= budget_dollars
    problem += pulp.lpSum([x[company] for company in companies]) == budget_dollars, "Budget_Constraint"

    # 2. Risk constraint: Sum of (allocation * beta) <= risk_tolerance * budget_dollars
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'beta'].values[0] for company in companies]) <= risk_tolerance * budget_dollars, "Risk_Constraint"

    # 3. Cardinality constraint: Invest in exactly `max_companies` companies
    problem += pulp.lpSum([y[company] for company in companies]) == max_companies, "Cardinality_Constraint"

    # 4. Linking constraint: Allocation can only be non-zero if the company is included
    for company in companies:
        problem += x[company] <= y[company] * budget_dollars, f"Linking_{company}"

    # 5. Minimum allocation constraint: Ensure each selected company gets at least a small allocation
    min_allocation = min_value * budget_dollars  # At least 1% of the budget
    for company in companies:
        problem += x[company] >= y[company] * min_allocation, f"Min_Allocation_{company}"

    # Solve the problem
    problem.solve()

    # Prepare the result
    portfolio = {}

    # Output results
    for company in companies:
        if x[company].varValue > 0:  # Only show included companies
            allocation = x[company].varValue
            portfolio[company] = round(allocation, 2)

    # Output the results
    logging.info(f"Status: {pulp.LpStatus[problem.status]}")
    logging.info(f"Optimal Allocations (Total ESG Score Minimization):")
    for company, allocation in portfolio.items():
        logging.info(f"{company}: ${allocation:.2f}")

    return portfolio


def sector_diversification(budget_dollars, risk_tolerance, max_companies, min_value, min_sectors):
    """
    Calculates a diversified portfolio with sector constraints using PuLP.

    Args:
        budget_dollars (float): Total budget for the portfolio.
        risk_tolerance (float): Maximum beta-weighted allocation, as fraction of budget.
        max_companies (int): Maximum number of companies to include in the portfolio.
        min_value (float): Minimum fraction of the budget to allocate to each company.
        min_sectors (int): Minimum number of sectors to include in the portfolio.

    Returns:
        dict: A dictionary of company symbols and their allocated amounts.
    """
    # Define the problem
    problem = pulp.LpProblem("Minimize_Total_Score_Sector_Diversification", pulp.LpMinimize)

    # Decision variables
    companies = df['Company_Symbol']
    x = pulp.LpVariable.dicts("Allocation", companies, lowBound=0, upBound=budget_dollars)  # Dollars allocated to each company
    y = pulp.LpVariable.dicts("Include", companies, cat="Binary")  # Binary variable: 1 if company is included, 0 otherwise

    # Sector variables
    sectors = df['SECTOR'].unique()
    sector_included = pulp.LpVariable.dicts("Sector_Included", sectors, cat="Binary")  # Binary variable: 1 if sector is included, 0 otherwise

    # Objective function: Minimize Total Score (ESG Risk)
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0] for company in companies]), "Total_Score"

    # Constraints
    # 1. Budget constraint: Sum of allocations <= budget_dollars
    problem += pulp.lpSum([x[company] for company in companies]) == budget_dollars, "Budget_Constraint"

    # 2. Risk constraint: Sum of (allocation * beta) <= risk_tolerance * budget_dollars
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'beta'].values[0] for company in companies]) <= risk_tolerance * budget_dollars, "Risk_Constraint"

    # 3. Cardinality constraint: Invest in exactly `max_companies` companies
    problem += pulp.lpSum([y[company] for company in companies]) == max_companies, "Cardinality_Constraint"

    # 4. Linking constraint: Allocation can only be non-zero if the company is included
    for company in companies:
        problem += x[company] <= y[company] * budget_dollars, f"Linking_{company}"

    # 5. Minimum allocation constraint: Ensure each selected company gets at least a small allocation
    min_allocation = min_value * budget_dollars  # At least 1% of the budget
    for company in companies:
        problem += x[company] >= y[company] * min_allocation, f"Min_Allocation_{company}"

    # 6. Sector diversification constraint: Include at least `min_sectors` sectors
    problem += pulp.lpSum([sector_included[sector] for sector in sectors]) >= min_sectors, "Sector_Diversification_Constraint"

    # 7. Linking sector inclusion to company inclusion
    for company in companies:
        sector = df.loc[df['Company_Symbol'] == company, 'SECTOR'].values[0]
        problem += y[company] <= sector_included[sector], f"Sector_Link_{company}"

    # Solve the problem
    problem.solve()

    # Prepare the result
    portfolio = {}

    # Output results
    for company in companies:
        if y[company].varValue == 1:  # Only show included companies
            allocation = x[company].varValue
            portfolio[company] = round(allocation, 2)

    # List included sectors
    included_sectors = [sector for sector in sectors if sector_included[sector].varValue == 1]
    
    # Output the results
    logging.info(f"Status: {pulp.LpStatus[problem.status]}")
    logging.info(f"Optimal Allocations (Total ESG Score Minimization):")
    for company, allocation in portfolio.items():
        logging.info(f"{company}: ${allocation:.2f} (Total Score: {df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0]}, Sector: {df.loc[df['Company_Symbol'] == company, 'SECTOR'].values[0]})")
    
    logging.info(f"Included Sectors: {included_sectors}")
    
    return portfolio


def industry_diversification(budget_dollars, risk_tolerance, max_companies, min_value, min_industries):
    """
    Calculates a diversified portfolio with industry constraints using PuLP.

    Args:
        budget_dollars (float): Total budget for the portfolio.
        risk_tolerance (float): Maximum beta-weighted allocation, as fraction of budget.
        max_companies (int): Maximum number of companies to include in the portfolio.
        min_value (float): Minimum fraction of the budget to allocate to each company.
        min_industries (int): Minimum number of industries to include in the portfolio.

    Returns:
         dict: A dictionary of company symbols and their allocated amounts.
    """
        # Define the problem
    problem = pulp.LpProblem("Minimize_Total_Score_Portfolio_Optimization", pulp.LpMinimize)

    # Decision variables
    companies = df['Company_Symbol']
    x = pulp.LpVariable.dicts("Allocation", companies, lowBound=0, upBound=budget_dollars)  # Dollars allocated to each company
    y = pulp.LpVariable.dicts("Include", companies, cat="Binary")  # Binary variable: 1 if company is included, 0 otherwise
    
    # Industry variables
    industries = df['INDUSTRY'].unique()
    industry_included = pulp.LpVariable.dicts("Industry_Included", industries, cat = "Binary")

    # Objective function: Minimize Total ESG Score
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0] for company in companies]), "Total_Score"

    # Constraints
    # 1. Budget constraint: Sum of allocations <= budget_dollars
    problem += pulp.lpSum([x[company] for company in companies]) == budget_dollars, "Budget_Constraint"

    # 2. Risk constraint: Sum of (allocation * beta) <= risk_tolerance * budget_dollars
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'beta'].values[0] for company in companies]) <= risk_tolerance * budget_dollars, "Risk_Constraint"

    # 3. Cardinality constraint: Invest in exactly `max_companies` companies
    problem += pulp.lpSum([y[company] for company in companies]) == max_companies, "Cardinality_Constraint"

    # 4. Linking constraint: Allocation can only be non-zero if the company is included
    for company in companies:
        problem += x[company] <= y[company] * budget_dollars, f"Linking_{company}"

    # 5. Minimum allocation constraint: Ensure each selected company gets at least a small allocation
    min_allocation = min_value * budget_dollars  # At least 1% of the budget
    for company in companies:
        problem += x[company] >= y[company] * min_allocation, f"Min_Allocation_{company}"
        
    # 6. Industry diversification constraint: Include at least `min_industries` industries
    problem += pulp.lpSum([industry_included[industry] for industry in industries]) >= min_industries, "Industry_Diversification_Constraint"

     # 7. Linking sector inclusion to company inclusion
    for company in companies:
        industry = df.loc[df['Company_Symbol'] == company, 'INDUSTRY'].values[0]
        problem += y[company] <= industry_included[industry], f"Industry_Link_{company}"

    # Solve the problem
    problem.solve()

    # Prepare the result
    portfolio = {}

    # Output results
    for company in companies:
        if y[company].varValue == 1:  # Only show included companies
            allocation = x[company].varValue
            portfolio[company] = round(allocation, 2)
    
    # List included industries
    included_industries = [industry for industry in industries if industry_included[industry].varValue == 1]
    
    # Output the results
    logging.info(f"Status: {pulp.LpStatus[problem.status]}")
    logging.info(f"Optimal Allocations (Total ESG Score Minimization):")
    for company, allocation in portfolio.items():
        logging.info(f"{company}: ${allocation:.2f} (Total Score: {df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0]}, Industry: {df.loc[df['Company_Symbol'] == company, 'INDUSTRY'].values[0]})")
    
    logging.info(f"Included Industries: {included_industries}")

    return portfolio