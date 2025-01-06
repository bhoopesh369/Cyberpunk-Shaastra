// RiskAnalysis.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Rating,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface StockData {
  ticker: string;
  E_score: number;
  S_score: number;
  G_score: number;
  ESG_score: number;
  Sectors: string;
  Market_Cap: number;
  Beta_1Y: number;
}

interface RiskAnalysisProps {
  selectedRisk: 'High-Risk' | 'Low-Risk' | 'Balanced' | null;
  stockData: StockData[];
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ selectedRisk, stockData }) => {
  const [recommendedStocks, setRecommendedStocks] = useState<StockData[]>([]);

  const navigate = useNavigate();

  const analyzeRisk = (data: StockData[], riskLevel: string | null) => {
    if (!riskLevel) return [];

    const sortedData = [...data];

    switch (riskLevel) {
      case 'High-Risk':
        // High risk strategy: High Beta, Higher Market Cap, Lower ESG considerations
        return sortedData
          .filter(stock => stock.Beta_1Y > 1.2) // Higher volatility
          .sort((a, b) => {
            const scoreA = (a.Beta_1Y * 0.4) + (a.Market_Cap * 0.4) + (a.ESG_score * 0.2);
            const scoreB = (b.Beta_1Y * 0.4) + (b.Market_Cap * 0.4) + (b.ESG_score * 0.2);
            return scoreB - scoreA;
          })
          .slice(0, 5);

      case 'Low-Risk':
        // Low risk strategy: Low Beta, Stable Market Cap, High ESG score
        return sortedData
          .filter(stock => stock.Beta_1Y < 1) // Lower volatility
          .sort((a, b) => {
            const scoreA = (a.ESG_score * 0.4) + ((1 / a.Beta_1Y) * 0.4) + (a.Market_Cap * 0.2);
            const scoreB = (b.ESG_score * 0.4) + ((1 / b.Beta_1Y) * 0.4) + (b.Market_Cap * 0.2);
            return scoreB - scoreA;
          })
          .slice(0, 5);

      case 'Balanced':
        // Balanced strategy: Moderate Beta, Good ESG scores, Decent Market Cap
        return sortedData
          .filter(stock => stock.Beta_1Y >= 0.8 && stock.Beta_1Y <= 1.2) // Moderate volatility
          .sort((a, b) => {
            const scoreA = (a.ESG_score * 0.4) + (a.Market_Cap * 0.3) + ((1 - Math.abs(1 - a.Beta_1Y)) * 0.3);
            const scoreB = (b.ESG_score * 0.4) + (b.Market_Cap * 0.3) + ((1 - Math.abs(1 - b.Beta_1Y)) * 0.3);
            return scoreB - scoreA;
          })
          .slice(0, 5);

      default:
        return [];
    }
  };

  useEffect(() => {
    const analyzed = analyzeRisk(stockData, selectedRisk);
    setRecommendedStocks(analyzed);
  }, [selectedRisk, stockData]);

  const getRiskColor = (beta: number) => {
    if (beta > 1.2) return '#ff8a80';
    if (beta < 0.8) return '#81c784';
    return '#64b5f6';
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(marketCap);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ mb: 4, backgroundColor: '#f8faff' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {selectedRisk || 'Select'} Investment Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on ESG scores, market capitalization, and risk metrics
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Ticker</TableCell>
                  <TableCell>ESG Risk Score</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell>Market Cap</TableCell>
                  <TableCell>Risk (Beta)</TableCell>
                  <TableCell>Individual Scores</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recommendedStocks.map((stock) => (
                  <TableRow 
                    key={stock.ticker}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/${stock.ticker}`)}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">{stock.ticker}</Typography>
                    </TableCell>
                    <TableCell>
                      <Rating
                        value={stock.ESG_score / 20}
                        readOnly
                        precision={0.5}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={stock.Sectors}
                        size="small"
                        sx={{ backgroundColor: '#e3f2fd' }}
                      />
                    </TableCell>
                    <TableCell>{formatMarketCap(stock.Market_Cap)}</TableCell>
                    <TableCell>
                      <Chip
                        label={`β: ${stock.Beta_1Y.toFixed(2)}`}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(stock.Beta_1Y),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`E: ${stock.E_score.toFixed(1)}`}
                          size="small"
                          sx={{ backgroundColor: '#e8f5e9' }}
                        />
                        <Chip
                          label={`S: ${stock.S_score.toFixed(1)}`}
                          size="small"
                          sx={{ backgroundColor: '#fff3e0' }}
                        />
                        <Chip
                          label={`G: ${stock.G_score.toFixed(1)}`}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd' }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskAnalysis;
