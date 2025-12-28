'use client';

import React from 'react';
import Grid from '@mui/material/GridLegacy';

import { 
  Box, 
  Container, 
  Typography, 
  
  Card, 
  CardContent,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

export default function KiwiPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    'Find and book appointments with doctors',
    'Check your medical history and test results',
    'Get personalized health recommendations',
    'Natural language interaction for easy use',
    'Discuss your health problems with our AI assistant'
  ];

 

  return (
    <Box sx={{ bgcolor: 'white', color: 'black', py: 8, minHeight: { xs: '10vh', md: '100vh' } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Grid container spacing={16.5} alignItems="center">
          {/* Left Side - Image */}
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="/img/about.jpg" // Update this path to your actual image
              alt="AI Health Assistant"
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>
          
          {/* Right Side - Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  color: theme.palette.primary.main
                }}
              >
                SHIVEN SUPPORT
              </Typography>
              
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
                Your Personal Health Assistant
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                SHIVEN is your 24/7 AI-powered health assistant <br /> that helps you manage your healthcare needs at Shiven Clinic.
              </Typography>
              
              <List sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <ListItem key={index} disableGutters sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" sx={{ color: 'black' }}>
                          {feature}
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
              
              
              
              
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}