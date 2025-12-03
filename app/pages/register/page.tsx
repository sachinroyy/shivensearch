'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/GridLegacy';

import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
 
  Link, 
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { themeConfig } from '../../theme/theme';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    } else if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/sendotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setIsOtpSent(true);
      setError('');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Redirect to login after successful registration
      router.push('/Admin/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e6f8f8 100%)',
        p: 3
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: `linear-gradient(90deg, ${themeConfig.primaryColor} 0%, ${themeConfig.secondaryColor} 100%)`,
            }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: '#2B2B2B' }}>
              Create an Account
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Join us today and experience the best healthcare management
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={isOtpSent ? handleSubmit : handleSendOtp}>
            {!isOtpSent ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: `linear-gradient(90deg, ${themeConfig.primaryColor} 0%, ${themeConfig.secondaryColor} 100%)`,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Verify Your Email
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    We've sent a verification code to {formData.email}
                  </Typography>
                </Box>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="Enter OTP"
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{
                    maxLength: 6,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: `linear-gradient(90deg, ${themeConfig.primaryColor} 0%, ${themeConfig.secondaryColor} 100%)`,
                    '&:hover': {
                      opacity: 0.9,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Verify & Register'
                  )}
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setIsOtpSent(false)}
                    disabled={isLoading}
                    sx={{
                      color: themeConfig.primaryColor,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'transparent',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Back to registration
                  </Button>
                </Box>
              </>
            )}
            
            <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{' '}
                  <Link 
                    href="/pages/login" 
                    variant="body2"
                    sx={{
                      color: themeConfig.primaryColor,
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;