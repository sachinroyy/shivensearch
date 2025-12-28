'use client';

import { useState, useEffect, ChangeEvent, ReactNode } from 'react';
import Grid from '@mui/material/GridLegacy';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  MenuItem,
  FormControl,
  
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const categories = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'General Physician'
];

const specializations: Record<string, string[]> = {
  'Cardiologist': [
    'Interventional Cardiology',
    'Electrophysiology',
    'Heart Failure',
    'Cardiac Imaging'
  ],
  'Dermatologist': [
    'Cosmetic Dermatology',
    'Pediatric Dermatology',
    'Dermatopathology',
    'Mohs Surgery'
  ],
  'Neurologist': [
    'Epilepsy',
    'Stroke',
    'Movement Disorders',
    'Headache Medicine'
  ],
  'Pediatrician': [
    'Neonatology',
    'Pediatric Cardiology',
    'Pediatric Neurology',
    'Adolescent Medicine'
  ],
  'Orthopedic': [
    'Sports Medicine',
    'Spine Surgery',
    'Joint Replacement',
    'Hand Surgery'
  ],
  'General Physician': [
    'Family Medicine',
    'Internal Medicine',
    'Geriatrics',
    'Preventive Medicine'
  ]
};

interface AvailableDate {
  date: string;
  timeSlots: string[];
}

interface Doctor {
  registrationNumber: ReactNode;
  registrationAgency: ReactNode;
  
  clinicName: ReactNode;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  degree: string;

  category: string;
  price: number;
  image: string;
  isVerified: boolean;
  isActive: boolean;
  availableDates: AvailableDate[];
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  category: string;
  specialization: string;
  price: string;
  image: string;
  clinicName: string;
  degree: string;
  registrationAgency: string;
  registrationNumber: string;
  availableDates: Array<{
    date: string;
    timeSlots: string[];
  }>;
  newDate: string;
  newTimeSlot: string;
}

export default function AddDoctorPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    category: '',
    specialization: '',
    price: '',
    image: '',
    clinicName: '',
    degree: '',
    registrationAgency: '',
    registrationNumber: '',
    availableDates: [],
    newDate: '',
    newTimeSlot: ''
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const category = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      category,
      specialization: '' // Reset specialization when category changes
    }));
  };

  const handleSpecializationChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, specialization: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      setSnackbarOpen(true);
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      setSnackbarOpen(true);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddAvailableDate = () => {
    if (!formData.newDate) return;
    
    const dateExists = formData.availableDates.some(
      d => d.date === formData.newDate
    );
    
    if (!dateExists) {
      setFormData(prev => ({
        ...prev,
        availableDates: [
          ...prev.availableDates,
          { date: prev.newDate, timeSlots: [] }
        ],
        newDate: ''
      }));
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter(d => d.date !== dateToRemove)
    }));
  };

  const handleAddTimeSlot = (date: string) => {
    if (!formData.newTimeSlot) return;
    
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.map(d => 
        d.date === date 
          ? { 
              ...d, 
              timeSlots: [...new Set([...d.timeSlots, formData.newTimeSlot])] 
            } 
          : d
      ),
      newTimeSlot: ''
    }));
  };

  const handleRemoveTimeSlot = (date: string, timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.map(d => 
        d.date === date 
          ? { 
              ...d, 
              timeSlots: d.timeSlots.filter(t => t !== timeSlot) 
            } 
          : d
      )
    }));
  };

  // Fetch doctors on component mount
  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            const userEmail = data.user.email;
            setUserEmail(userEmail);
            setFormData(prev => ({
              ...prev,
              email: userEmail
            }));
            // Fetch doctors after getting user email
            fetchDoctors(userEmail);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    const fetchDoctors = async (email: string) => {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        // Filter doctors by the logged-in user's email
        const filteredDoctors = data.filter((doctor: Doctor) => doctor.email === email);
        setDoctors(filteredDoctors);
      } catch (err) {
        setError('Error fetching doctors');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: userEmail || '',
      phone: '',
      address: '',
      experience: '',
      category: '',
      specialization: '',
      price: '',
      image: '',
      clinicName: '',
      degree: '',
      registrationAgency: '',
      registrationNumber: '',
      availableDates: [],
      newDate: '',
      newTimeSlot: ''
    });
    setImagePreview('');
    setEditing(false);
  };

  const handleEdit = (doctor: Doctor) => {
    setFormData({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      address: doctor.address,
      experience: doctor.experience.toString(),
      category: doctor.category,
      specialization: (doctor as any).specialization || '',
      price: doctor.price.toString(),
      image: doctor.image,
      clinicName: (doctor as any).clinicName || '',
      degree: (doctor as any).degree || '',
      registrationAgency: (doctor as any).registrationAgency || '',
      registrationNumber: (doctor as any).registrationNumber || '',
      availableDates: doctor.availableDates || [],
      newDate: '',
      newTimeSlot: ''
    });
    setImagePreview(doctor.image);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    console.log('Attempting to delete doctor with ID:', id); // Add this line
    setDoctorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    
    try {
      console.log('Sending DELETE request for ID:', doctorToDelete);
      const response = await fetch(`/api/doctors/${encodeURIComponent(doctorToDelete)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete doctor');
      }

      console.log('Delete successful, updating UI...');
      // Update the doctors list by filtering out the deleted doctor
      setDoctors(prevDoctors => 
        prevDoctors.filter(doctor => doctor._id !== doctorToDelete && 
                                   doctor._id?.toString() !== doctorToDelete)
      );
      setSuccess('Doctor deleted successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Error deleting doctor');
      setSnackbarOpen(true);
    } finally {
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone number is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      
      // Prepare the data for submission
      const doctorData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        experience: Number(formData.experience) || 0,
        category: formData.category,
        specialization: formData.specialization,
        price: Number(formData.price) || 0,
        image: formData.image,
        clinicName: formData.clinicName.trim(),
        degree: formData.degree.trim(),
        registrationAgency: formData.registrationAgency.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        availableDates: formData.availableDates,
        isVerified: false,
        isActive: true,
        updatedAt: new Date()
      };

      let url = '/api/doctors';
      let method = 'POST';
      
      if (editing && formData._id) {
        url = `/api/doctors/${formData._id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save doctor');
      }
      
      if (editing && formData._id) {
        setDoctors(doctors.map(doc => doc._id === formData._id ? result.data : doc));
        setSuccess('Doctor updated successfully!');
      } else {
        setDoctors([...doctors, result.data || result]);
        setSuccess('Doctor added successfully!');
      }
      
      setSnackbarOpen(true);
      resetForm();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the doctor');
      setSnackbarOpen(true);
      console.error('Error saving doctor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {editing ? 'Edit Doctor' : 'Add New Doctor'}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                disabled={!!userEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Experience */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label="Category *"
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Clinic Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name of Clinic"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Degree */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                placeholder="e.g., MBBS, MD, MS"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Registration Agency */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Registration Agency"
                name="registrationAgency"
                value={formData.registrationAgency}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                placeholder="e.g., MCI, State Medical Council"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Registration Number */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                placeholder="e.g., MCI12345"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consultation Fee"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Specialization */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Specialization</InputLabel>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleSpecializationChange}
                  label="Specialization"
                  disabled={!formData.category}
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Select a specialization</em>
                  </MenuItem>
                  {formData.category && specializations[formData.category]?.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Available Dates */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Available Dates & Time Slots
              </Typography>
              <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    type="date"
                    value={formData.newDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, newDate: e.target.value }))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddAvailableDate}
                    disabled={!formData.newDate}
                  >
                    Add Date
                  </Button>
                </Box>

                {formData.availableDates.map((dateInfo) => (
                  <Box key={dateInfo.date} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1">
                        {new Date(dateInfo.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleRemoveDate(dateInfo.date)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      {dateInfo.timeSlots.map((timeSlot) => (
                        <Chip
                          key={timeSlot}
                          label={timeSlot}
                          onDelete={() => handleRemoveTimeSlot(dateInfo.date, timeSlot)}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <TextField
                        type="time"
                        value={formData.newTimeSlot}
                        onChange={(e) => setFormData(prev => ({ ...prev, newTimeSlot: e.target.value }))}
                        size="small"
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleAddTimeSlot(dateInfo.date)}
                        disabled={!formData.newTimeSlot}
                      >
                        Add Time
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="doctor-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="doctor-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    Upload Image
                  </Button>
                </label>
                {imagePreview && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={imagePreview}
                      alt="Preview"
                      sx={{ width: 100, height: 100, mr: 2 }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting 
                    ? 'Saving...' 
                    : editing 
                      ? 'Update Doctor' 
                      : 'Add Doctor'}
                </Button>
                {editing && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Doctors List */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Doctors List
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : doctors.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">No doctors found. Add a new doctor to get started.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>clinicName</TableCell>
                <TableCell>degree</TableCell>
                <TableCell>registrationAgency</TableCell>
                <TableCell>registrationNumber</TableCell>
                <TableCell>availableDates</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell>
                    <Avatar 
                      src={doctor.image} 
                      alt={doctor.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={doctor.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{(doctor as any).specialization || 'N/A'}</TableCell>
                  <TableCell>{doctor.experience} years</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(doctor)}
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => doctor._id && handleDeleteClick(doctor._id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                   <TableCell>{doctor.clinicName}</TableCell>
                  <TableCell>{doctor.degree}</TableCell>
                  <TableCell>{doctor.registrationAgency}</TableCell>
                  <TableCell>{doctor.registrationNumber}</TableCell>
                  <TableCell>
                    {doctor.availableDates.map((date, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold' }}>
                          {new Date(date.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            weekday: 'short'
                          })}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {date.timeSlots.length > 0 ? (
                            date.timeSlots.join(', ')
                          ) : (
                            <span style={{ color: '#999' }}>No time slots</span>
                          )}
                        </div>
                        {index < doctor.availableDates.length - 1 && <hr style={{ margin: '4px 0' }} />}
                      </div>
                    ))}
                  </TableCell>

                </TableRow>
                
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this doctor? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
}