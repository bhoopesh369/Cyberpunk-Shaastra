import { Slider } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ROICalculator: React.FC = () => {
    const [years, setYears] = useState<number>(1);
    const [results, setResults] = useState<{ roi: number; annualized_roi: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(1000);

    const ticker = useParams<{ ticker: string }>();

    const calculateROI = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8000/ROI", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticker: ticker.ticker, years }),
            });

            if (!response.ok) {
                throw new Error("Failed to calculate ROI");
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    function formatCurrency(amount: number): string {
        return amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }
    
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">ROI Calculator</h2>
            <div className="space-y-4">
                <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                Initial Investment Amount
                            </label>
                            <span className="text-sm font-semibold text-blue-600">
                                {formatCurrency(amount)}
                            </span>
                        </div>
                        <Slider
                            value={amount}
                            onChange={(_, newValue) => setAmount(newValue as number)}
                            min={1000}
                            max={1000000}
                            step={1000}
                            sx={{
                                color: "#2563eb", // blue-600
                                "& .MuiSlider-thumb": {
                                    height: 24,
                                    width: 24,
                                    backgroundColor: "#fff",
                                    border: "2px solid currentColor",
                                    "&:hover": {
                                        boxShadow: "0 0 0 8px rgba(37, 99, 235, 0.16)",
                                    },
                                },
                                "& .MuiSlider-track": {
                                    height: 4,
                                },
                                "& .MuiSlider-rail": {
                                    height: 4,
                                    opacity: 0.2,
                                },
                            }}
                            marks={[
                                { value: 1000, label: "$1K" },
                                { value: 250000, label: "$250K" },
                                { value: 500000, label: "$500K" },
                                { value: 1000000, label: "$1M" },
                            ]}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                Investment Period
                            </label>
                            <span className="text-sm font-semibold text-blue-600">
                                {years} {years === 1 ? "Year" : "Years"}
                            </span>
                        </div>
                        <Slider
                            value={years}
                            onChange={(_, newValue) => setYears(newValue as number)}
                            min={1}
                            max={10}
                            marks={[
                                { value: 1, label: "1Y" },
                                { value: 5, label: "5Y" },
                                { value: 10, label: "10Y" },
                            ]}
                            sx={{
                                color: "#2563eb", // blue-600
                                "& .MuiSlider-thumb": {
                                    height: 24,
                                    width: 24,
                                    backgroundColor: "#fff",
                                    border: "2px solid currentColor",
                                    "&:hover": {
                                        boxShadow: "0 0 0 8px rgba(37, 99, 235, 0.16)",
                                    },
                                },
                                "& .MuiSlider-track": {
                                    height: 4,
                                },
                                "& .MuiSlider-rail": {
                                    height: 4,
                                    opacity: 0.2,
                                },
                            }}
                        />
                    </div>
                </div>
                <button
                    onClick={calculateROI}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {loading ? "Calculating..." : "Calculate ROI"}
                </button>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                {results && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">ROI:</span>
                                <span className={results.roi < 0 ? "text-red-600" : "text-green-600"}>
                                    {(results.roi).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Annualized ROI:</span>
                                <span className={results.annualized_roi < 0 ? "text-red-600" : "text-green-600"}>
                                    {(results.annualized_roi).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Total Profit:</span>
                                <span className={results.annualized_roi < 0 ? "text-red-600" : "text-green-600"}>
                                    {formatCurrency(results.annualized_roi * amount / 100)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default ROICalculator;