import pulp
import pandas as pd

def diversification(budget_dollars, risk_tolerance, max_companies, min_value):
    
    problem = pulp.LpProblem("Minimize_Total_Score", pulp.LpMinimize)

    
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

    for company in companies:
        problem += x[company] <= y[company] * budget_dollars, f"Linking_{company}"

    # 4. Minimum allocation constraint: Ensure each selected company gets at least a small allocation
    min_allocation = min_value * budget_dollars  # At least 1% of the budget
    for company in companies:
        problem += x[company] >= y[company] * min_allocation, f"Min_Allocation_{company}"


    problem.solve()

    portfolio = {}


    for company in companies:
        if x[company].varValue > 0:  
            allocation = x[company].varValue
            portfolio[company] = round(allocation, 2)


    print(f"Status: {pulp.LpStatus[problem.status]}")
    print(f"Optimal Allocations (Total ESG Score Minimization):")
    for company, allocation in portfolio.items():
        print(f"{company}: ${allocation:.2f}")

    return portfolio



def sector_diversification(budget_dollars, risk_tolerance, max_companies, min_value, min_sectors):

    problem = pulp.LpProblem("Minimize_Total_Score_Sector_Diversification", pulp.LpMinimize)


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

    for company in companies:
        problem += x[company] <= y[company] * budget_dollars, f"Linking_{company}"

    # 4. Minimum allocation constraint: Ensure each selected company gets at least a small allocation
    min_allocation = min_value * budget_dollars  # At least 1% of the budget
    for company in companies:
        problem += x[company] >= y[company] * min_allocation, f"Min_Allocation_{company}"

    # 5. Sector diversification constraint: Include at least `min_sectors` sectors
    problem += pulp.lpSum([sector_included[sector] for sector in sectors]) >= min_sectors, "Sector_Diversification_Constraint"

    for company in companies:
        sector = df.loc[df['Company_Symbol'] == company, 'SECTOR'].values[0]
        problem += y[company] <= sector_included[sector], f"Sector_Link_{company}"


    problem.solve()

    portfolio = {}


    for company in companies:
        if y[company].varValue == 1: 
            allocation = x[company].varValue
            portfolio[company] = round(allocation, 2)

    included_sectors = [sector for sector in sectors if sector_included[sector].varValue == 1]
    
    print(f"Status: {pulp.LpStatus[problem.status]}")
    print(f"Optimal Allocations (Total ESG Score Minimization):")
    for company, allocation in portfolio.items():
        print(f"{company}: ${allocation:.2f} (Total Score: {df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0]}, Sector: {df.loc[df['Company_Symbol'] == company, 'SECTOR'].values[0]})")
    
    print(f"Included Sectors: {included_sectors}")
    
    return portfolio


def industry_diversification(budget_dollars, risk_tolerance, max_companies, min_value, min_industries):

    problem = pulp.LpProblem("Minimize_Total_Score_Portfolio_Optimization", pulp.LpMinimize)


    companies = df['Company_Symbol']
    x = pulp.LpVariable.dicts("Allocation", companies, lowBound=0, upBound=budget_dollars)  # Dollars allocated to each company
    y = pulp.LpVariable.dicts("Include", companies, cat="Binary")  # Binary variable: 1 if company is included, 0 otherwise

    # Objective function: Minimize Total ESG Risk Score
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'Total-Score'].values[0] for company in companies]), "Total_Score"

    # Constraints
    # 1. Budget constraint: Sum of allocations <= budget_dollars
    problem += pulp.lpSum([x[company] for company in companies]) == budget_dollars, "Budget_Constraint"

    # 2. Risk constraint: Sum of (allocation * beta) <= risk_tolerance * budget_dollars
    problem += pulp.lpSum([x[company] * df.loc[df['Company_Symbol'] == company, 'beta'].values[0] for company in companies]) <= risk_tolerance * budget_dollars, "Risk_Constraint"

    # 3. Cardinality constraint: Invest in exactly `max_companies` companies
    problem += pulp.lpSum([y[company] for company in companies]) == max_companies, "Cardinality_Constraint"


    for company in companies:
        problem += x[company] <= y[company] * budget_dollars, f"Linking_{company}"

    # 4. Minimum allocation constraint: Ensure each selected company gets at least a small allocation
    min_allocation = min_value * budget_dollars  # At least 1% of the budget
    for company in companies:
        problem += x[company] >= y[company] * min_allocation, f"Min_Allocation_{company}"


    problem.solve()

    portfolio = {}

    for company in companies:
        if y[company].varValue == 1:  
            allocation = x[company].varValue
            portfolio[company] = round(allocation, 2)

    return portfolio

