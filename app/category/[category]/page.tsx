'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Grid from '@mui/material/GridLegacy';

import {
  Box, Typography, Button, Container, Card, CardContent,
  Avatar, Rating, Divider, IconButton, CircularProgress, Chip, Stack
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import Link from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';

type Doctor = {
  id: string | number;
  name: string;
  speciality: string;
  specialization: string;
  experience: string;
  location: string;
  fee: string;
  rating: number;
  reviews: number;
  image: string;
  email: string;
  phone: string;
  consultationFee: number;
};

export default function CategoryDoctors() {
  const router = useRouter();
  const { category } = useParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors?category=${decodeURIComponent(category as string)}`);
        const data = await response.json();
        
        // Format the doctors data to match the expected type
        const formattedDoctors = data.map((doc: any) => ({
          id: doc._id || doc.id,
          name: doc.name,
          speciality: doc.category || 'General Physician',
          specialization: doc.specialization || '',
          experience: doc.experience ? `${doc.experience} years` : 'Not specified',
          location: doc.address || 'Location not specified',
          fee: doc.fee || `₹${doc.price || doc.consultationFee || '500'}`,
          consultationFee: doc.consultationFee || doc.price || 500,
          rating: doc.rating || 0,
          reviews: doc.reviews || 0,
          image: doc.image || '/img/doctors/doctor-default.jpg',
          email: doc.email || '',
          phone: doc.phone || ''
        }));
        
        setDoctors(formattedDoctors);
        setFilteredDoctors(formattedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchDoctors();
    }
  }, [category]);

  // Filter doctors based on current category
  useEffect(() => {
    const currentCategory = Array.isArray(category) ? category[0] : category || '';
    
    const filtered = [...doctors].filter(doctor => 
      doctor.speciality.toLowerCase() === currentCategory.toLowerCase()
    );
    
    setFilteredDoctors(filtered);
  }, [doctors, category]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading {category} doctors...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Enhanced Header Section */}
      <Box sx={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        py: 2,
        mb: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}>
            {/* Logo and Category Title */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexGrow: 1,
              minWidth: 200
            }}>
              <Button 
                onClick={() => router.back()}
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: (theme) => `rgba(25, 118, 210, 0.04)`
                  }
                }}
              >
                Back
              </Button>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                borderLeft: '1px solid rgba(0,0,0,0.12)',
                pl: 2,
                ml: 1
              }}>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.2,
                    textTransform: 'capitalize'
                  }}
                >
                  {decodeURIComponent(category as string)} Specialists
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {doctors.length} qualified doctors available
                </Typography>
              </Box>
            </Box>

            {/* Search and Actions */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{ textTransform: 'none' }}
              >
              Back to Categories
              </Button>
            </Box>
          </Box>

          {/* Breadcrumbs */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />}>
              <Link 
                href="/" 
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                }}
                className="hover:underline"
              >
                <Typography color="text.primary">Home</Typography>
              </Link>
              <Typography color="text.secondary">
                {decodeURIComponent(category as string)}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Specializations Filter */}
        <Box sx={{ 
          mb: 4,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 600, 
            whiteSpace: 'nowrap',
            color: 'text.primary',
            fontSize: '1rem'
          }}>
            Specializations :
          </Typography>
          <Box sx={{ 
            flex: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              pb: 1,
              minWidth: 'max-content',
            }}>
              {filteredDoctors.map((doctor) => (
                <Chip 
                  key={doctor.specialization}
                  label={doctor.specialization} 
                  variant="outlined" 
                  onClick={() => {}}
                  sx={{
                    '&:hover': { 
                      backgroundColor: 'primary.light', 
                      color: 'primary.main' 
                    },
                    cursor: 'pointer',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.875rem',
                    borderColor: 'divider',
                    '&.MuiChip-outlined': {
                      borderWidth: '1px',
                    }
                  }}
                />
              ))}
              <Chip 
                label="View all" 
                variant="outlined"
                onClick={() => {}}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.875rem',
                  borderColor: 'divider',
                  '&:hover': { 
                    backgroundColor: 'transparent',
                    borderColor: 'primary.main'
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {filteredDoctors.length === 0 && !loading ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 1,
            p: 4
          }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No {decodeURIComponent(category as string).toLowerCase()} specialists found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We couldn't find any specialists in this category. Please try another category.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => router.push('/')}
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: '20px', px: 3 }}
            >
              Back to Home
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {filteredDoctors.map((doctor: any) => (
              <Grid item xs={12} key={doctor.id} sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Card sx={{ 
                  width: '100%',
                  maxWidth: 1200,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                  },
                  p: 4
                }}>
                  <Box sx={{ display: 'flex', gap: 4, height: '100%', alignItems: 'center' }}>
                    {/* Left Side - Profile Image */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        src={doctor.image} 
                        alt={doctor.name}
                        sx={{ 
                          width: 140, 
                          height: 140, 
                          border: '4px solid',
                          borderColor: 'primary.light',
                          boxShadow: 3,
                          mb: 2
                        }}
                      />
                    </Box>

                    {/* Center - Doctor Details */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        fontWeight={600} 
                        gutterBottom
                        onClick={() => router.push(`/booking?id=${doctor.id}&name=${encodeURIComponent(doctor.email)}`)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'

                          }
                        }}
                      >
                        {doctor.name}
                      </Typography>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        {doctor.speciality}
                      </Typography>
                      {doctor.specialization && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                          {doctor.specialization}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimeIcon color="action" fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.experience} experience
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon color="action" fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.location || 'Location not specified'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{ marginRight: '8px', color: '#666' }}
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.email || 'email@example.com'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating
                          value={doctor.rating}
                          readOnly
                          precision={0.5}
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          size="small"
                          sx={{ color: '#ffb400' }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {doctor.rating} ({doctor.reviews} {doctor.reviews === 1 ? 'review' : 'reviews'})
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right Side - Price, Call, and Booking */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      minWidth: '220px',
                      pl: 3,
                      borderLeft: '1px solid #eee',
                      flexShrink: 0,
                      gap: 3
                    }}>
                      <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography 
                            variant="h5" 
                            color="primary" 
                            fontWeight={700}
                            sx={{ 
                              wordBreak: 'break-word',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              width: '100%',
                              display: 'block'
                            }}
                          >
                            {doctor.fee}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              width: '100%',
                              display: 'block',
                              mb: 2
                            }}
                          >
                            Consultation Fee
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="large"
                            startIcon={<PhoneIcon />}
                            fullWidth
                            sx={{ 
                              borderRadius: '30px',
                              textTransform: 'none',
                              px: 3,
                              py: 1.5,
                              backgroundColor: '#4caf50',
                              fontSize: '1rem',
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: '#388e3c',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                              },
                              mb: 3,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Call Now
                          </Button>
                        </Box>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        size="large"
                        fullWidth
                        onClick={() => router.push(`/booking?id=${doctor.id}&name=${encodeURIComponent(doctor.email)}`)}
                        sx={{ 
                          borderRadius: '30px',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                          },
                          mt: 'auto',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Book Appointment
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}