import React, { useState } from "react";
import {
    Box,
    Slider,
    Typography,
    Paper,
    TextField,
    Button,
    Card,
    Grid,
    CircularProgress,
    Alert,
    InputAdornment,
    Tabs,
    Tab,
} from "@mui/material";
import { AccountBalance, TrendingUp, Groups, BarChart } from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CalculatorInputs {
    budget_dollars: number;
    risk_tolerance: number;
    max_companies: number;
    min_value: number;
}

const InvestmentCalculator = () => {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        budget_dollars: 10000,
        risk_tolerance: 0.7,
        max_companies: 10,
        min_value: 0.01,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    interface InvestmentResult {
        expected_return: number;
        portfolio_beta: number;
        [key: string]: number; // This allows for dynamic keys with number values
    }
    const [result, setResult] = useState<InvestmentResult | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleCalculate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8000/diversify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });

            if (!response.ok) throw new Error("Failed to calculate investment strategy");

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#AF19FF",
        "#FF69B4",
        "#00FFFF",
        "#FFFF00",
        "#7FFF00",
        "#FFA500",
        "#4B0082",
        "#00FA9A",
        "#DC143C",
        "#00008B",
        "#8FBC8F",
        "#FFD700",
        "#800080",
        "#2E8B57",
        "#FF4500",
        "#1E90FF",
    ];

    const pieChartData = result
        ? Object.entries(result)
              .filter(([key]) => key !== "expected_return" && key !== "portfolio_beta")
              .map(([stock, amount], index) => ({
                  name: stock,
                  value: amount,
                  color: COLORS[index % COLORS.length],
              }))
        : [];

    // sort Object.entries by value
    pieChartData.sort((a, b) => b.value - a.value);

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-gray-200 rounded p-2 shadow-md">
                    <p className="text-sm font-medium text-gray-800">{`${
                        data.name
                    }: $${data.value.toFixed(2)} (${(
                        (data.value / pieChartData.reduce((sum, item) => sum + item.value, 0)) *
                        100
                    ).toFixed(2)}%)`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Investment Strategy Calculator
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: "#f8faff" }}>
                        <Typography variant="h6" gutterBottom>
                            Input Parameters
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <AccountBalance sx={{ mr: 1, color: "#2196f3" }} />
                                <Typography variant="subtitle1">Investment Budget</Typography>
                            </Box>
                            <TextField
                                fullWidth
                                value={inputs.budget_dollars}
                                onChange={(e) =>
                                    setInputs({ ...inputs, budget_dollars: Number(e.target.value) })
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">$</InputAdornment>
                                    ),
                                }}
                                type="number"
                                sx={{ mb: 1 }}
                            />
                            <Slider
                                value={inputs.budget_dollars}
                                onChange={(_, value) =>
                                    setInputs({ ...inputs, budget_dollars: value as number })
                                }
                                min={1000}
                                max={100000}
                                step={1000}
                                marks={[
                                    { value: 1000, label: "$1K" },
                                    { value: 50000, label: "$50K" },
                                    { value: 100000, label: "$100K" },
                                ]}
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <TrendingUp sx={{ mr: 1, color: "#ff4081" }} />
                                <Typography variant="subtitle1">Risk Tolerance </Typography>
                            </Box>
                            <Slider
                                value={inputs.risk_tolerance}
                                onChange={(_, value) =>
                                    setInputs({ ...inputs, risk_tolerance: value as number })
                                }
                                min={0}
                                max={2}
                                step={0.1}
                                marks={[
                                    { value: 0, label: "Low" },
                                    { value: 1, label: "Market" },
                                    { value: 2, label: "High" },
                                ]}
                                valueLabelDisplay="auto"
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <Groups sx={{ mr: 1, color: "#4caf50" }} />
                                <Typography variant="subtitle1">Maximum Companies</Typography>
                            </Box>
                            <Slider
                                value={inputs.max_companies}
                                onChange={(_, value) =>
                                    setInputs({ ...inputs, max_companies: value as number })
                                }
                                min={2}
                                max={20}
                                step={1}
                                marks={[
                                    { value: 2, label: "2" },
                                    { value: 10, label: "10" },
                                    { value: 20, label: "20" },
                                ]}
                                valueLabelDisplay="auto"
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <BarChart sx={{ mr: 1, color: "#9c27b0" }} />
                                <Typography variant="subtitle1">Minimum Allocation (%)</Typography>
                            </Box>
                            <Slider
                                value={inputs.min_value * 100}
                                onChange={(_, value) =>
                                    setInputs({ ...inputs, min_value: (value as number) / 100 })
                                }
                                min={1}
                                max={20}
                                step={1}
                                marks={[
                                    { value: 1, label: "1%" },
                                    { value: 10, label: "10%" },
                                    { value: 20, label: "20%" },
                                ]}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `${value}%`}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleCalculate}
                            disabled={loading}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                background: "linear-gradient(45deg, #2196f3 30%, #1976d2 90%)",
                                "&:hover": {
                                    background: "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Calculate Investment Strategy"
                            )}
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: "#f8faff", height: "100%" }}>
                        <Typography variant="h6" gutterBottom>
                            Results
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {result && !loading && (
                            <Box>
                                <Tabs
                                    value={selectedTab}
                                    onChange={handleChangeTab}
                                    aria-label="investment results tabs"
                                    centered
                                    sx={{ mb: 2 }}
                                >
                                    <Tab label="Allocation Chart" />
                                    <Tab label="Recommended Allocations" />
                                </Tabs>
                                {selectedTab === 0 && (
                                    <Box sx={{ height: "300px" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Portfolio Allocation
                                        </Typography>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieChartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={CustomTooltip} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                )}
                                {selectedTab === 1 && (
                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Recommended Allocations
                                        </Typography>
                                        <Box>
                                            {Object.entries(result)
                                                .filter(
                                                    ([key]) =>
                                                        key !== "expected_return" &&
                                                        key !== "portfolio_beta",
                                                )
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([stock, amount]: [string, number], index) => (
                                                    <Card
                                                        key={stock}
                                                        sx={{
                                                            mb: 1,
                                                            p: 2,
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            backgroundColor: "#e3f2fd",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: "#757575",
                                                                    minWidth: "24px",
                                                                }}
                                                            >
                                                                {index + 1}.
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: "#1976d2",
                                                                    textDecoration: "underline",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    (window.location.href = `/${stock}`)
                                                                }
                                                            >
                                                                {stock}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1">
                                                            ${amount.toFixed(2)}
                                                        </Typography>
                                                    </Card>
                                                ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {!result && !loading && !error && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "400px",
                                    color: "text.secondary",
                                }}
                            >
                                <Typography variant="body1">
                                    Adjust the parameters and calculate to see results
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InvestmentCalculator;
