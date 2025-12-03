// app/Admin/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/GridLegacy';

import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  TextField,
  Avatar,
  
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

// Types
type Clinic = {
  _id: string;
  name: string;
  address: string;
  contact: string;
  timings: string[];
};

type Experience = {
  _id: string;
  clinicName: string;
  from: string;
  to: string | null;
  current: boolean;
};

type Education = {
  _id: string;
  degree: string;
  university: string;
  year: string;
};

type ProfileData = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  about: string;
  clinics: Clinic[];
  education: Education[];
  experienceList: Experience[];
  services: string[];
  photos: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Client-side only component
export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    _id: '',
    name: 'Loading...',
    email: '',
    phone: '',
    specialization: '',
    experience: 0,
    consultationFee: 0,
    about: '',
    clinics: [],
    education: [],
    experienceList: [],
    services: [],
    photos: [],
    isVerified: false,
    isActive: true,
    createdAt: '',
    updatedAt: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editableProfile, setEditableProfile] = useState<ProfileData>({...profile});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set mounted state and fetch profile data
  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (typeof window === 'undefined') return; // Skip on server side
    
    try {
      setLoading(true);
      const response = await fetch('/api/doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle array response and use the first doctor
      const doctorData = Array.isArray(data) ? data[0] : data;
      console.log('Using doctor data:', doctorData);
      
      setProfile(doctorData);
      setEditableProfile(doctorData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditableProfile({...profile});
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

const handleSave = async () => {
  if (!editableProfile?._id) {
    console.error('No doctor ID available for update');
    return;
  }

  console.log('Updating doctor with ID:', editableProfile._id);
  console.log('Update data:', editableProfile);

  try {
    const response = await fetch(`/api/doctors/${editableProfile._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editableProfile),
    });

    const responseData = await response.json();
    console.log('Update response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update profile');
    }

    setProfile(responseData.data);
    setEditMode(false);
  } catch (error) {
    console.error('Error updating profile:', error);
    setError(error instanceof Error ? error.message : 'Failed to update profile');
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Don't render anything until the component is mounted on the client
  if (!mounted) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Error loading profile</Typography>
        <Typography color="textSecondary" sx={{ mt: 2 }}>{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchProfile}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">My Profile</Typography>
        {!editMode && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleEdit}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Profile Picture */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar 
                src={profile.photos?.[0] || '/default-avatar.png'}
                alt={profile.name}
                sx={{ width: 200, height: 200, mb: 2, fontSize: '4rem' }}
              >
                {profile.name?.charAt(0) || 'U'}
              </Avatar>
              {editMode && (
                <Button 
                  variant="outlined" 
                  component="label"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Change Photo
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditableProfile(prev => ({
                            ...prev,
                            photos: [reader.result as string, ...(prev.photos || []).slice(1)]
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
              )}
            </Box>
          </Grid>

          {/* Right Column - Profile Details */}
          <Grid item xs={12} md={8}>
            {editMode ? (
              <Box component="form" noValidate autoComplete="off">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={editableProfile.name || ''}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={editableProfile.email || ''}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={editableProfile.phone || ''}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Specialization"
                      name="specialization"
                      value={editableProfile.specialization || ''}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience (years)"
                      name="experience"
                      type="number"
                      value={editableProfile.experience || 0}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="About"
                      name="about"
                      value={editableProfile.about || ''}
                      onChange={handleChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ mr: 2 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" gutterBottom>{profile.name || 'No Name'}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {profile.specialization || 'No Specialization'}
                </Typography>
                {profile.about && (
                  <Typography variant="body1" paragraph>{profile.about}</Typography>
                )}
                
                <Divider sx={{ my: 3 }} />
                
                <Grid container spacing={2}>
                  <DetailItem label="Email" value={profile.email || 'N/A'} />
                  <DetailItem label="Phone" value={profile.phone || 'N/A'} />
                  <DetailItem 
                    label="Experience" 
                    value={profile.experience ? `${profile.experience} years` : 'N/A'} 
                  />
                  <DetailItem 
                    label="Consultation Fee" 
                    value={profile.consultationFee ? `$${profile.consultationFee}` : 'N/A'} 
                  />
                  <DetailItem 
                    label="Status" 
                    value={profile.isActive ? 'Active' : 'Inactive'} 
                  />
                  <DetailItem 
                    label="Verified" 
                    value={profile.isVerified ? 'Yes' : 'No'} 
                  />
                </Grid>

                {profile.clinics?.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Clinics</Typography>
                    <Grid container spacing={3}>
                      {profile.clinics.map((clinic) => (
                        <Grid item xs={12} sm={6} key={clinic._id}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{clinic.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {clinic.address}
                            </Typography>
                            {clinic.contact && (
                              <Typography variant="body2">
                                Contact: {clinic.contact}
                              </Typography>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {profile.experienceList?.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Experience</Typography>
                    <Grid container spacing={2}>
                      {profile.experienceList.map((exp) => (
                        <Grid item xs={12} key={exp._id}>
                          <Box>
                            <Typography variant="subtitle1">{exp.clinicName}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(exp.from).toLocaleDateString()} -{' '}
                              {exp.current || !exp.to 
                                ? 'Present' 
                                : new Date(exp.to).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {profile.education?.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Education</Typography>
                    <Grid container spacing={2}>
                      {profile.education.map((edu) => (
                        <Grid item xs={12} key={edu._id}>
                          <Box>
                            <Typography variant="subtitle1">{edu.degree}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {edu.university} • {edu.year}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {profile.services?.length > 0 && (
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Services</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {profile.services.map((service, index) => (
                        <Chip 
                          key={index} 
                          label={service} 
                          variant="outlined" 
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

// Move DetailItem outside the main component to prevent re-creation on each render
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={12} sm={3}>
        <Typography variant="subtitle2" color="textSecondary">
          {label}:
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Typography variant="body1">{value}</Typography>
      </Grid>
    </Grid>
  );
}