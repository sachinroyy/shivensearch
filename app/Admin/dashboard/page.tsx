'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import { format, subDays } from 'date-fns';

interface Appointment {
  _id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorEmail: string;
  appointmentDate: string;
  status: string;
  appointmentType: string;
}

export default function DashboardPage() {
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [doctorEmail, setDoctorEmail] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        // Set end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        params.append('endDate', endOfDay.toISOString());
      }
      if (doctorEmail) {
        params.append('doctorEmail', doctorEmail);
      }
      params.append('page', (page + 1).toString());
      params.append('limit', rowsPerPage.toString());

      const response = await fetch(`/api/appointments?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          if (userData.user?.email) {
            setDoctorEmail(userData.user.email);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (doctorEmail) {
      fetchAppointments();
    }
  }, [page, rowsPerPage, doctorEmail]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page when applying new filters
    fetchAppointments();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Appointments Dashboard
        </Typography>
        
        <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Appointments
          </Typography>
          
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Start Date"
    value={startDate}
    onChange={(newValue) => setStartDate(newValue)}
    slotProps={{ textField: { fullWidth: true } }}
    sx={{ minWidth: 200 }}
  />
  <DatePicker
    label="End Date"
    value={endDate}
    onChange={(newValue) => setEndDate(newValue)}
    slotProps={{ textField: { fullWidth: true } }}
    sx={{ minWidth: 200 }}
  />
</LocalizationProvider>
            <Button type="submit" variant="contained" color="primary">
              Apply Filters
            </Button>
          </Box>
          {doctorEmail && (
            <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
              Showing appointments for: {doctorEmail}
            </Typography>
          )}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Patient Email</TableCell>
                  {/* <TableCell>Doctor Email</TableCell> */}
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No appointments found
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.patientEmail}</TableCell>
                      {/* <TableCell>{appointment.doctorName}</TableCell> */}
                      <TableCell>
                        {format(new Date(appointment.appointmentDate), 'PPpp')}
                      </TableCell>
                      <TableCell>{appointment.appointmentType}</TableCell>
                      <TableCell>
                        <Box 
                          component="span" 
                          sx={{
                            p: '4px 8px',
                            borderRadius: 1,
                            bgcolor: appointment.status === 'confirmed' 
                              ? 'success.light' 
                              : appointment.status === 'pending'
                                ? 'warning.light'
                                : 'error.light',
                            color: 'common.white',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        >
                          {appointment.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}