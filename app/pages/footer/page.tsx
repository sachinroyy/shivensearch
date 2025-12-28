'use client';

import React from 'react';
import Grid from '@mui/material/GridLegacy';

import { 
  Box, 
  Container, 
   
  Typography, 
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  Instagram as InstagramIcon, 
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#e6f7ff', 
        color: 'text.primary',
        
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
        <Grid container spacing={{ xs: 8, md: 12 }}>
          {/* About Us */}
          <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                mt: 1,
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  bgcolor: 'primary.main',
                }
              }}
            >
              About Us
            </Typography>
            <Typography variant="body2" sx={{ mt: 4, mb: 4, color: 'text.secondary', lineHeight: 1.8  }}>
              We are committed to providing the highest quality <br /> healthcare services to our<br /> patients with compassion and excellence.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 6, mb: 4 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                mt: 1,
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  bgcolor: 'primary.main',
                }
              }}
            >
             Our Services
            </Typography>
            <List dense sx={{ '& .MuiListItem-root': { py: 1 } }}>
              {[ 'Health Checkup', 'Patient Management', 'Appointment Scheduling', 'Follow-up Management', ].map((item) => (
                <ListItem 
                  key={item} 
                  disableGutters 
                  sx={{ 
                    py: 1,
                    '&:hover': { '& .MuiTypography-root': { color: 'primary.main' } }
                  }}
                >
                  <MuiLink 
                    component={Link} 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    color="text.secondary"
                    underline="none"
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.3s',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>•</span>
                    {item}
                  </MuiLink>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Our Services */}
          <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                mt: 1,
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  bgcolor: 'primary.main',
                }
              }}
            >
              *
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 8 } }}>
              <Box sx={{ minWidth: '180px' }}>
                <List dense disablePadding>
                  {['Primary Care', 'Emergency Care', 'Dental Care', 'Diagnosis'].map((service) => (
                    <ListItem 
                      key={service} 
                      disableGutters 
                      sx={{ 
                        py: 1,
                        '&:hover': { '& .MuiTypography-root': { color: 'primary.main' } }
                      }}
                    >
                      <MuiLink 
                        component={Link} 
                        href={`#${service.toLowerCase().replace(/\s+/g, '-')}`}
                        color="text.secondary"
                        underline="none"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.3s',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>•</span>
                        {service}
                      </MuiLink>
                    </ListItem>
                  ))}
                </List>
              </Box>
             
            </Box>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 4, md: 0 } }}>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                mt: 1,
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '50px',
                  height: '3px',
                  bgcolor: 'primary.main',
                }
              }}
            >
              Contact Us
            </Typography>
            <List dense sx={{ '& .MuiListItem-root': { py: 1 } }}>
             
              <ListItem disableGutters sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <PhoneIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <MuiLink 
                  href="tel:+911234567890" 
                  color="text.secondary" 
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  +91 70392 05715
                </MuiLink>
              </ListItem>

            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ 
          my: 6, 
          height: '2px',
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
          border: 'none',
          opacity: 0.8
        }} />
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center"
          sx={{ 
            mt: 4,
            mb: 2,
            fontSize: '1rem',
            letterSpacing: '0.5px'
          }}
        >
          {new Date().getFullYear()} Shiven Clinic. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}