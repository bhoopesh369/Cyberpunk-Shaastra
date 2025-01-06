import { useState } from "react";
import {
    Box,
    // ... (previous imports)
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
} from "@mui/material";
import { AccountBalance, Groups, Home } from "@mui/icons-material";
import InvestmentCalculator from "./InvestmentCalculator";
import SectorCalculator from "./SectorCalculator";
import IndustryCalculator from "./IndustryCalculator";

enum CalculatorType {
    INVESTMENT = "investment",
    SECTOR = "sector",
    INDUSTRY = "industry",
}

// Add type for the calculator selector
interface CalculatorSelector {
    type: CalculatorType;
    label: string;
    icon: JSX.Element;
}

const calculatorOptions: CalculatorSelector[] = [
    {
        type: CalculatorType.INVESTMENT,
        label: "High ESG Portfolio Optimization",
        icon: <AccountBalance />,
    },
    {
        type: CalculatorType.SECTOR,
        label: "Sector Based Diversification",
        icon: <Groups />,
    },
    {
        type: CalculatorType.INDUSTRY,
        label: "Industrty Based Diversification",
        icon: <Home />,
    },
];

const Calculator = () => {
    const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(
        CalculatorType.INVESTMENT,
    );

    const renderCalculator = () => {
        switch (selectedCalculator) {
            case CalculatorType.INVESTMENT:
                return <InvestmentCalculator />;
            case CalculatorType.SECTOR:
                return <SectorCalculator />; // You'll need to create this component
            case CalculatorType.INDUSTRY:
                return <IndustryCalculator />; // You'll need to create this component
            default:
                return <InvestmentCalculator />;
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
            <Typography variant="h3" gutterBottom>
                Investment Strategies
            </Typography>
            <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="calculator-type-label">Calculator Type</InputLabel>
                <Select
                    labelId="calculator-type-label"
                    value={selectedCalculator}
                    label="Calculator Type"
                    onChange={(e) => setSelectedCalculator(e.target.value as CalculatorType)}
                    sx={{
                        backgroundColor: "#fff",
                        "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                        },
                    }}
                >
                    {calculatorOptions.map((option) => (
                        <MenuItem
                            key={option.type}
                            value={option.type}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            {option.icon}
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {renderCalculator()}
        </Box>
    );
};


export default Calculator;
