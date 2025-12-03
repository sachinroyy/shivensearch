'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // User not found, redirect to registration
          router.push(`/application/register?email=${encodeURIComponent(email)}`);
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      // Login successful, redirect to dashboard
      router.push('/Admin');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during login');
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
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Sign in to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link 
                  href="/pages/register"
                  sx={{
                    color: themeConfig.primaryColor,
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}