'use client';

import React from 'react';
import Grid from '@mui/material/GridLegacy';

import { 
  Box, 
  Container, 
  Typography, 
   
  useTheme,
  useMediaQuery
} from '@mui/material';
import Image from 'next/image';

export default function GrowthPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: 'white', color: 'black', py: 8 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 } }}>
  <Grid container spacing={6} alignItems="center" justifyContent="space-between">
    {/* Left Side - Text Content */}
    <Grid item xs={12} md={4.8} sx={{ 
      order: { xs: 2, md: 1 },
      width: '40%'
    }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 'bold',
          mb: 3,
          fontSize: { xs: '2rem', md: '2.5rem' },
          color: 'black'
        }}
      >
        GROWTH CHARTS
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'black' }}>
        Track your baby's growth with Shiven Clinic's advanced growth charts. 
        Our comprehensive tools help you monitor your child's development 
        and ensure they're growing healthily with accurate tracking.
      </Typography>

      <Typography variant="body1" sx={{ color: 'black' }}>
        Get detailed insights and compare with standard growth percentiles 
        to stay informed about your child's progress.
      </Typography>
    </Grid>

    {/* Right Side - Content */}
    <Grid item xs={12} md={4.8} sx={{ 
      order: { xs: 1, md: 2 },
      width: '40%'
    }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, md: 400 },
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 4,
          '&:hover': {
            boxShadow: 6,
            '& img': {
              transform: 'scale(1.03)'
            }
          }
        }}
      >
        <Image
          src="/img/growth.webp"
          alt="Child Growth Tracking"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.3s ease-in-out'
          }}
          sizes="(max-width: 900px) 100vw, 40vw"
          priority
        />
      </Box>
    </Grid>
  </Grid>
</Container>
    </Box>
  );
}