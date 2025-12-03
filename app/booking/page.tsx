'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Grid from '@mui/material/GridLegacy';

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
  alpha,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
 
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
  },
});

// Main booking page component with Suspense
export default function Booking() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <BookingContent />
    </Suspense>
  );
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorEmail = searchParams.get('email');
  const doctorId = searchParams.get('id');
  const doctorName = searchParams.get('name') || 'Doctor';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    appointmentType: 'online',
    date: '',
    time: '',
    userId: 'guest' // Default user ID for unauthenticated users
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [doctor, setDoctor] = useState<{
    category: any;
    phone: string;
    address: any;
    name: string;
    email: string;
    specialization?: string;
    experience?: string;
    image?: string;
    consultationFee?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorEmail && !doctorId) return;
      
      try {
        setLoading(true);
        const url = doctorEmail 
          ? `/api/doctors?email=${encodeURIComponent(doctorEmail)}`
          : `/api/doctors?id=${doctorId}`;
          
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch doctor details');
        
        const data = await response.json();
        if (data && data.length > 0) {
          const doc = data[0];
          setDoctor({
            name: doc.name,
            email: doc.email,
            specialization: doc.specialization,
            experience: doc.experience,
            image: doc.image,
            phone: doc.phone,
            consultationFee: doc.consultationFee || doc.price || 500,
            category: doc.category,
            address: doc.address
          });
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
        setSubmitError('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorEmail, doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          doctorId,
          doctorName,
          doctorEmail: doctorName,
          userId: formData.userId || 'guest', // Ensure userId is always present
          // You might want to pass the actual doctor's email here
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        gender: '',
        appointmentType: 'online',
        date: '',
        time: '',
        userId: 'guest' // Keep the userId in the reset form
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          py: 4,
        }}
      >
      
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Doctor Details Card - Left Side */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  width: { xs: '100%', md: '700px' },
                  maxWidth: '100%',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 'none',
                  height: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'transparent'
                }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
              </Box>
            ) : doctor ? (
              <>
                <Box textAlign="center" mb={3}>
                  <Box 
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto 16px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `2px solid ${theme.palette.primary.light}`,
                     
                    
                    }}
                  >
                    <Box
                      component="img"
                      src={doctor.image || '/img/doctors/doctor-default.jpg'}
                      alt={doctor.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ 
                    color: theme.palette.primary.dark,
                    mt: 2
                  }}>
                    Dr. {doctor.name}
                  </Typography>
                  
                  {doctor.specialization && (
                    <Chip
                      label={doctor.specialization}
                      color="primary"
                      variant="outlined"
                      size="medium"
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        px: 1.5,
                        py: 0.8,
                        borderWidth: '2px'
                      }}
                    />
                  )}
                  
                  <Box sx={{ 
                    width: '100%',
                    '& > *:not(:last-child)': {
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid rgba(0,0,0,0.08)'
                    },
                    '& > *:last-child': {
                      mb: 0,
                      pb: 0,
                      borderBottom: 'none'
                    }
                  }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} color="primary">
                        {doctor.experience || '5+'} Years
                      </Typography>
                    </Box>
                    
                    {doctor.category && (
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {doctor.category}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" color="text.secondary">
                        Consultation
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        ₹{doctor.consultationFee || '500'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                 
                  borderRadius: 2,
                  mb: 3
                }}>
                  <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.primary">
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                      p: 1, 
                      borderRadius: '50%',
                      display: 'flex',
                      mr: 2
                    }}>
                      <PhoneIcon color="primary" fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {doctor.phone || 'Not available'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                      p: 1, 
                      borderRadius: '50%',
                      display: 'flex',
                      mr: 2
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-word' }}>
                        {doctor.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {doctor.address && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                      <Box sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1), 
                        p: 1, 
                        borderRadius: '50%',
                        display: 'flex',
                        mr: 2,
                        mt: 0.5
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Address</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {doctor.address}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box mt="auto" sx={{ textAlign: 'center' }}>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Available Today: 9:00 AM - 8:00 PM
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography color="error">Doctor details not available</Typography>
            )}
          </Paper>
        </Grid>

        {/* Booking Form - Right Side */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={0}
            sx={{ 
              width: { xs: '100%', md: '700px' },
              maxWidth: '100%',
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'transparent',
              boxShadow: 'none',
              height: '80%',
              position: 'sticky',
              top: '20px'
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.dark,
                mb: 3,
              }}
            >
              Book an Appointment
            </Typography>
            {doctorName && (
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  bgcolor: alpha(theme.palette.primary.light, 0.1),
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.dark,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Doctor:</span> {doctorName}
                </Typography>
              </Box>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      label="Gender"
                      onChange={handleSelectChange}
                      variant="outlined"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}
                    >
                      Appointment Type
                    </Typography>
                    <RadioGroup
                      row
                      name="appointmentType"
                      value={formData.appointmentType}
                      onChange={handleChange}
                      sx={{
                        '& .MuiButtonBase-root': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="online"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>Online</span>
                          </Box>
                        }
                        sx={{ mr: 4 }}
                      />
                      <FormControlLabel
                        value="offline"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>In-person</span>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Appointment Date"
                    name="date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Preferred Time"
                    name="time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 900 }}
                    value={formData.time}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                {submitError && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      {submitError}
                    </Box>
                  </Grid>
                )}
                {submitSuccess && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: 1,
                        textAlign: 'center',
                      }}
                    >
                      Appointment booked successfully! Redirecting to home page...
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting || submitSuccess}
                    sx={{
                      mt: 2,
                      py: 2,
                      fontSize: '1.1rem',
                      background: submitSuccess 
                        ? '#4caf50'
                        : `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': submitSuccess ? {} : {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                      '&.Mui-disabled': {
                        background: '#e0e0e0',
                        color: '#9e9e9e',
                      },
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Appointment'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
</ThemeProvider>
);
}
