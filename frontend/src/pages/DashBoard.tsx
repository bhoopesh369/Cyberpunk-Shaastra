import { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Balance,
  Close as CloseIcon,
} from '@mui/icons-material';
import RiskAnalysis from './Algorithm';

import csg from './00mbu'

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

const DashBoard = () => {
  const [open, setOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);

 const [stockData, setStockData] = useState<StockData[]>([]);


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

    


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStrategySelect = (strategy: any) => {
    setSelectedStrategy(strategy);
  };

  const investmentStrategies = [
    {
      title: 'High-Risk',
      description: 'Aggressive growth strategy with potentially higher returns and higher risk',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#ff4444' }} />,
      color: '#ffebee',
    },
    {
      title: 'Balanced',
      description: 'Moderate strategy balancing growth and stability',
      icon: <Balance sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Low-Risk',
      description: 'Conservative strategy focused on capital preservation with stable returns',
      icon: <TrendingDown sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#e8f5e9',
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClickOpen}
        sx={{ 
          mb: 3,
          borderRadius: '28px',
          padding: '12px 24px',
          textTransform: 'none',
          fontSize: '1.1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          }
        }}
      >
        Choose Investment Strategy
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #2196f3, #1976d2)',
          color: 'white',
          padding: '20px 24px',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              Choose Your Investment Strategy
            </Typography>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                color: 'white',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {investmentStrategies.map((strategy) => (
              <Grid item xs={12} md={4} key={strategy.title}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: selectedStrategy?.title === strategy.title 
                      ? `${strategy.color}99`
                      : strategy.color,
                    cursor: 'pointer',
                    borderRadius: '16px',
                    border: selectedStrategy?.title === strategy.title 
                      ? '2px solid #1976d2' 
                      : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => handleStrategySelect(strategy)}
                >
                  <CardContent sx={{ padding: '24px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          background: 'white',
                          borderRadius: '50%',
                          padding: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        {strategy.icon}
                      </Box>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {strategy.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {strategy.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {selectedStrategy && (
            <Fade in={Boolean(selectedStrategy)}>
              <Box sx={{ 
                mt: 4,
                p: 3,
                borderRadius: '16px',
                backgroundColor: '#f5f5f5',
              }}>
                <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                  Selected Strategy: {selectedStrategy.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStrategy.description}
                </Typography>
              </Box>
            </Fade>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              padding: '8px 20px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            disabled={!selectedStrategy}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              padding: '8px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              }
            }}
          >
            Confirm Strategy
          </Button>
        </DialogActions>
      </Dialog>
      {selectedStrategy && (
        <RiskAnalysis
          selectedRisk={selectedStrategy.title}
          stockData={stockData}
        />
      )}
    </Box>
  );
};

export default DashBoard;
