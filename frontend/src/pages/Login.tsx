import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Fade,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue color
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
      
      // Mock validation - in real app, this would be your API call
      if (formData.username === 'admin' && formData.password === 'password') {
        setSuccess(true);
        toast.success('Successfully logged in!');
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
        setError('');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 4,
                width: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Logo/Icon */}
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  p: 1,
                  mb: 2,
                }}
              >
                <LockOutlined sx={{ color: 'background.paper', fontSize: 30 }} />
              </Box>

              {/* Title */}
              <Typography
                component="h1"
                variant="h5"
                sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}
              >
                Sign In
              </Typography>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {/* Username Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                    },
                  }}
                />

                {/* Error Message */}
                {error && (
                  <Fade in={!!error}>
                    <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.15)' }}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                {/* Success Message */}
                {success && (
                  <Fade in={success}>
                    <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(46, 125, 50, 0.15)' }}>
                      Successfully logged in!
                    </Alert>
                  </Fade>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || success}
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    position: 'relative',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Additional Links */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Button color="primary" size="small">
                    Forgot password?
                  </Button>
                  <Button color="primary" size="small">
                    Create account
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;