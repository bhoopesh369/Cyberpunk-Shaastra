import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Rating,
} from '@mui/material';
import {
  LocalHospital,
  AccountBalance,
  ShoppingCart,
  Factory,
  Computer,
  Close as CloseIcon,
  Power,
  Cast,
} from '@mui/icons-material';

import csg from './00mbu';
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

const SectorAnalysis = () => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockData[]>([]);

  const navigate = useNavigate();

  // Fetch CSV data
  useEffect(() => {
    const csvText = csg;

    const rows = csvText.split('\n').filter((row:any) => row.trim());
    // const headers = rows[0].split(',');
    
    const parsedData = rows.slice(1).map((row:any) => {
      const values = row.split(',');
      return {
        'ticker': values[0],
        'E_score': parseFloat(values[1]),
        'S_score': parseFloat(values[2]),
        'G_score': parseFloat(values[3]),
        'ESG_score': parseFloat(values[4]),
        'Sectors': values[5],
        'Market_Cap': parseFloat(values[6]),
        'Beta_1Y': parseFloat(values[7]),
      };
    }
    );
    console.log('parsedData:', parsedData);
    setStockData(parsedData);

  }
  , []);

  const sectors = Array.from(new Set(stockData.map(stock => stock.Sectors)));

  const sectorIcons: { [key: string]: JSX.Element } = {
    'Health Care': <LocalHospital sx={{ fontSize: 40 }} />,
    'Financials': <AccountBalance sx={{ fontSize: 40 }} />,
    'Consumer': <ShoppingCart sx={{ fontSize: 40 }} />,
    'Industrials': <Factory sx={{ fontSize: 40 }} />,
    'Information Technology': <Computer sx={{ fontSize: 40 }} />,
    'Utilities': <Power sx={{ fontSize: 40 }} />,
    'Communication Services': <Cast sx={{ fontSize: 40 }} />,
};

  const sectorColors: { [key: string]: string } = {
    'Health Care': '#ff8a80',
    'Financials': '#81c784',
    'Consumer': '#64b5f6',
    'Industrials': '#ffd54f',
    'Information Technology': '#9575cd',
    'Utilities': '#4db6ac',
    'Communication Services': '#4fc3f7',
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8faff', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Sector Analysis
      </Typography>

      <Grid container spacing={3}>
        {sectors.map((sector) => {
          const sectorStocks = stockData.filter(stock => stock.Sectors === sector);
          const avgESG = sectorStocks.reduce((acc, stock) => acc + stock.ESG_score, 0) / sectorStocks.length;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={sector}>
              <Card
                className='bg-slate-600'
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 8px 24px ${sectorColors[sector]}40`,
                  },
                }}
                onClick={() => setSelectedSector(sector)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: `${sectorColors[sector]}20`,
                        borderRadius: '50%',
                        p: 2,
                        color: sectorColors[sector],
                      }}
                    >
                      {sectorIcons[sector]}
                    </Box>
                    <Typography variant="h6" component="div">
                      {sector}
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Companies: {sectorStocks.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg ESG Score: {avgESG.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={Boolean(selectedSector)}
        onClose={() => setSelectedSector(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedSector && (
                <Box
                  sx={{
                    backgroundColor: `${sectorColors[selectedSector]}20`,
                    borderRadius: '50%',
                    p: 1,
                    color: sectorColors[selectedSector],
                  }}
                >
                  {sectorIcons[selectedSector]}
                </Box>
              )}
              {selectedSector} Companies
            </Typography>
            <IconButton onClick={() => setSelectedSector(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticker</TableCell>
                  <TableCell>ESG Score</TableCell>
                  <TableCell>Market Cap</TableCell>
                  <TableCell>Beta</TableCell>
                  <TableCell>Individual Scores</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockData
                  .filter(stock => stock.Sectors === selectedSector)
                  .map((stock) => (
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
                      <TableCell>{formatMarketCap(stock.Market_Cap)}</TableCell>
                      <TableCell>
                        <Chip
                          label={`β: ${stock.Beta_1Y.toFixed(2)}`}
                          size="small"
                          sx={{
                            backgroundColor: 
                              stock.Beta_1Y > 1.2 ? '#ff8a80' :
                              stock.Beta_1Y < 0.8 ? '#81c784' : '#64b5f6',
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
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SectorAnalysis;
