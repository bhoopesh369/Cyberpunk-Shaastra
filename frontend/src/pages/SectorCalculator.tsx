import { useState } from "react";
import {
    Box,
    Slider,
    Typography,
    Paper,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    InputAdornment,
} from "@mui/material";
import { AccountBalance, TrendingUp, Groups, BarChart } from "@mui/icons-material";

interface CalculatorInputs {
    budget_dollars: number;
    risk_tolerance: number;
    max_companies: number;
    min_value: number;
    min_sectors: number;
}

const SectorCalculator = () => {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        budget_dollars: 10000,
        risk_tolerance: 0.7,
        max_companies: 10,
        min_value: 0.01,
        min_sectors: 1,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("YOUR_API_ENDPOINT", {
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

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                <BarChart sx={{ mr: 1, color: "#9c27b0" }} />
                                <Typography variant="subtitle1">Minimum Sectors</Typography>
                            </Box>
                            <Slider
                                value={inputs.min_sectors}
                                onChange={(_, value) =>
                                    setInputs({ ...inputs, min_sectors: value as number })
                                }
                                min={1}
                                max={5}
                                step={1}
                                marks={[
                                    { value: 1, label: "1" },
                                    { value: 5, label: "5" },
                                ]}
                                valueLabelDisplay="auto"
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
                                <Card sx={{ mb: 2, backgroundColor: "#fff" }}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary">
                                            Portfolio Summary
                                        </Typography>
                                        {/* Add your result visualization here */}
                                        <Typography variant="body1">
                                            Expected Return: {result.expected_return}%
                                        </Typography>
                                        <Typography variant="body1">
                                            Portfolio Beta: {result.portfolio_beta}
                                        </Typography>
                                        {/* Add more result details */}
                                    </CardContent>
                                </Card>

                                <Typography variant="subtitle1" gutterBottom>
                                    Recommended Allocations
                                </Typography>
                                {/* Add allocation visualization here */}
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

export default SectorCalculator;
