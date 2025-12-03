'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  isActive: boolean;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        console.log('API Response:', data); // Add this line to debug
        
        // Handle both array response and object with doctors property
        const doctorsData = Array.isArray(data) ? data : data.doctors || [];
        setDoctors(doctorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6" gutterBottom>
          Error: {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Doctors
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2, overflowX: 'auto' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Experience (Years)</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>{doctor.name || 'N/A'}</TableCell>
                    <TableCell>{doctor.email || 'N/A'}</TableCell>
                    <TableCell>{doctor.phone || 'N/A'}</TableCell>
                    <TableCell>{doctor.specialization || 'N/A'}</TableCell>
                    <TableCell>{doctor.experience || '0'}</TableCell>
                    <TableCell>₹{doctor.consultationFee || '0'}</TableCell>
                    <TableCell>
                      {doctor.isActive ? 'Active' : 'Inactive'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No doctors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}