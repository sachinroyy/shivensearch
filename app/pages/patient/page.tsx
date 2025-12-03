'use client';

import React from 'react';
import Grid from '@mui/material/GridLegacy';

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from 'next/image';

export default function PatientPortal() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    { title: 'Doctor Search & Booking', items: [
     
    ]},
    { title: 'Medical Records', items: [
      
    ]},
    { title: 'Appointment Management', items: [

    ]},
    { title: 'Prescription Management', items: [
      
    ]},
    { title: 'Billing & Insurance', items: [
      
    ]}
    
    
  ];

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.paper', color: 'black' }}>
      {/* Header */}
      

      <Container maxWidth="lg" sx={{ py: 8  }}>
        <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
          {/* Left side - Content */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
           <Typography 
  variant="h3" 
  component="h1" 
  sx={{ 
    fontFamily: 'sans-serif',
    mb: 3,
    pt: 8,
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
    lineHeight: 1.2,
    color: 'black',
    textAlign: 'center',
    width: '100%'
  }}
>
  CLINIC FOR PATIENTS
</Typography>
            
            <Box sx={{ mb: 10 }}>

              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {features.map((section, index) => (
                  <Box 
                    key={index}
                    sx={{
                      p: 2,
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: '0 8px 8px 0',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        fontSize: '1.05rem'
                      }}
                    >
                      <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      {section.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px 0 rgba(37, 99, 235, 0.4)',
                  }
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>

          {/* Right side - Image */}
          <Grid item xs={12} md={6} component="div" sx={{ order: { xs: 1, md: 2,   } }}>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              
                height: 'auto',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.shadows[10],
              }}
            >
              <Image 
                src="/img/patient.webp" 
                alt="Patient using ShivenClinic"
                width={500}
                height={500}
                style={{
                  
                  width: '100%',
                  height: 'auto',
                  maxWidth: '500px',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}