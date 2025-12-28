'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/GridLegacy';


import { 
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  NavigateNext as RightIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress,
  Container, 
  Divider, 
  
  IconButton, 
  InputAdornment, 
  Menu,
  MenuItem, 
  Paper, 
  Select, 
  SelectChangeEvent, 
  TextField, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Rating,
  Chip,
  Avatar,
  CardHeader,
  CardActions,
  CardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

type Doctor = {
  id: number;
  name: string;
  qualification: string;
  speciality: string;
  experience: string;
  clinic: string;
  location: string;
  fee: string;
  rating: number;
  reviews: number;
  image: string;
  availability: {
    days: string[];
    timings: string[];
  };
};







const generateAvailability = () => ({
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  timings: [
    '09:00 AM - 01:00 PM',
    '05:00 PM - 09:00 PM'
  ]
});



const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ffb400',
  },
});

export default function DoctorListing() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/pages/login');
  };

  const handleRegisterClick = () => {
    router.push('/pages/register');
  };

  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedArea, setSelectedArea] = useState('Ahmedabad');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDoctors, setShowDoctors] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>, category: string) => {
  // Navigate to the category page
    router.push(`/category/${encodeURIComponent(category.toLowerCase())}`);
    // Close the menu if it's open
    if (anchorEl) {
      handleClose();
    }
  };


  const fetchDoctorsByCategory = async (category: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/doctors`);
      const data = await response.json();
      
      // Normalize the category name for comparison
      const normalizedCategory = category.toLowerCase().trim();
      
      // Filter doctors by category (case-insensitive and partial match)
      const filtered = data.filter((doctor: any) => {
        const doctorCategory = (doctor.category || doctor.specialization || '').toLowerCase();
        
        // Filter for Neurologist
        if (normalizedCategory === 'neurologist') {
          return doctorCategory.includes('neurologist');
        }
        
        // Special handling for Dermatologist
        if (normalizedCategory === 'dermatologist') {
          return doctorCategory.includes('dermat') || // matches 'dermatologist', 'dermatology'
                 doctorCategory === 'skin' ||        // matches 'skin'
                 doctorCategory === 'skin doctor';   // matches 'skin doctor'
        }
        
        // Default filtering for other categories
        return doctorCategory.includes(normalizedCategory) || 
               normalizedCategory.includes(doctorCategory);
      });
      
      console.log(`Filtered ${category} doctors:`, filtered); // Debug log
      
      const formattedDoctors = filtered.map((doc: any) => ({
        id: doc._id || doc.id,
        name: doc.name,
        qualification: doc.qualification || 'MBBS, MD',
        speciality: doc.category || doc.specialization || 'General Physician',
        experience: doc.experience ? `${doc.experience} years` : '5 years',
        clinic: doc.clinic || doc.address?.split(',')[0] || 'Clinic',
        location: doc.location || doc.address || 'Location not specified',
        fee: doc.fee || `₹${doc.price || '500'}`,
        rating: doc.rating || 4.0,
        reviews: doc.reviews || 0,
        image: doc.image || '/img/doctors/doctor-default.jpg',
        availability: doc.availability || generateAvailability()
      }));
      
      setFilteredDoctors(formattedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (selectedSpeciality) {
      await fetchDoctorsByCategory(selectedSpeciality);
    }
    setShowDoctors(true);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    // Handle doctor selection (e.g., navigate to doctor's profile)
    console.log('Selected doctor:', doctor);
    handleClose();
  };

  const categories = [
    { name: 'Cardiologist', icon: '❤️' },
    { name: 'Dermatologist', icon: '🔍' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Pediatrician', icon: '👶' },
    { name: 'Orthopedic', icon: '🦴' },
    { name: 'General Physician', icon: '👨\u200d⚕️' },
     { name: 'Cardiologist', icon: '❤️' },
    { name: 'Dermatologist', icon: '🔍' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Pediatrician', icon: '👶' },
        { name: 'General Physician', icon: '👨\u200d⚕️' },

    
   
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundImage: 'url(img/home.jpg)',
      backgroundAttachment: 'fixed',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 2 }}>
      {/* Header Section - Moved to top */}
      <Box sx={{ 
        py: 4,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 ,pt:3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              color: 'text.primary'
            }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                Shiven Clinic
              </Link>
              <ChevronRightIcon sx={{ mx: 0.5, fontSize: '1rem' }} />
              <span>Ahmedabad</span>
              <ChevronRightIcon sx={{ mx: 0.5, fontSize: '1rem' }} />
              <Typography component="span" sx={{ fontWeight: 'medium' }}>
                {selectedSpeciality || 'Speciality'}
              </Typography>
            </Box>
            
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 2
            }}>
              Search Your Doctor here
            </Typography>
            
            <Typography variant="h6" sx={{ 
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 600
            }}>
              Book appointments with minimum wait-time & verified doctor details
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Register Button */}
      <Box 
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          gap: 2
        }}
      >
        {/* <Button 
          component={Link}
          href="/pages/contactus"
          variant="outlined"
          color="primary"
          sx={{ 
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'white',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
        >
          Contact Us
        </Button> */}
        <Button 
          variant="outlined" 
          color="primary"
          onClick={handleLoginClick}
          sx={{
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 1,
            fontWeight: 500
          }}
        >
          Login
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleRegisterClick}
          sx={{
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
            py: 1,
            fontWeight: 500,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          Register
        </Button>
      </Box>
      
      {/* Search and Categories */}
      <Container maxWidth="lg" sx={{ py: 1, mt: 2 }}>
        <Paper 
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 2,
            mb: 4,
            backgroundColor: 'transparent',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              size="small"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              placeholder="Ahmedabad"
              sx={{
                flex: 1,
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search Doctor by Name/Speciality"
              sx={{
                flex: 2,
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push('/category/dermatologist')}
              sx={{
                px: 4,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
              }}
            >
              Search
            </Button>
          </Box>
          
          {/* Categories */}
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            {categories.map((category) => (
              <Box key={category.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={(e) => handleCategoryClick(e, category.name)}
                  sx={{
                    textTransform: 'none',
                    color: 'text.primary',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                    backgroundColor: selectedSpeciality === category.name ? 'primary.light' : '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    p: 0,
                    minWidth: 'auto',
                    '& .MuiButton-startIcon': {
                      margin: 0,
                      fontSize: '2rem',
                      lineHeight: 1
                    }
                  }}
                  startIcon={<span>{category.icon}</span>}
                />
                <Typography variant="caption" textAlign="center" sx={{ color: 'text.secondary', mt: 1 }}>
                  {category.name}
                </Typography>

                <Menu
                  anchorEl={anchorEl}
                  open={open && selectedCategory === category.name}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 400,
                      width: '40ch',
                    },
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <MenuItem 
                        key={doctor.id} 
                        onClick={() => handleDoctorSelect(doctor)}
                        sx={{ py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Avatar 
                            src={doctor.image} 
                            alt={doctor.name}
                            sx={{ width: 50, height: 50, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {doctor.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.speciality}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <StyledRating
                                value={doctor.rating}
                                precision={0.5}
                                readOnly
                                size="small"
                                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                ({doctor.reviews})
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled sx={{ py: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No doctors found in this category
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
      
      {/* Doctor Listings - Only show after search or category click */}
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography>Loading doctors...</Typography>
        </Box>
      ) : showDoctors && filteredDoctors.length > 0 && (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4, position: 'relative', zIndex: 2 }}>
          <Grid container spacing={3}>
            {filteredDoctors.map((doctor) => (
              <Grid item key={doctor.id} xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Avatar 
                        src={doctor.image} 
                        alt={doctor.name}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" component="div">
                          {doctor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doctor.qualification}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {doctor.speciality}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <StyledRating
                            value={doctor.rating}
                            precision={0.5}
                            readOnly
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({doctor.reviews} reviews)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {doctor.experience} exp
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {doctor.location}
                      </Typography>
                    </Box>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      </Box>
    </Box>
  );
}