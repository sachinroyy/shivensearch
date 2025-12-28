// app/Admin/dashboard/contactdeveloper/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Refresh } from '@mui/icons-material';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export default function ContactDeveloperPage() {
  const [userData, setUserData] = useState<{name?: string; email?: string}>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const theme = useTheme();

  // Fetch user data and messages on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchUserData();
      await fetchContactMessages();
    };
    
    fetchInitialData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserData({
            name: data.user.name || '',
            email: data.user.email || ''
          });
          // Pre-fill the form with user data
          setFormData(prev => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await fetch('/api/contactdev');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setError('Failed to load contact messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'in_progress' | 'resolved') => {
    try {
      const response = await fetch(`/api/contactdev/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg._id === id ? { ...msg, status: newStatus } : msg
          )
        );
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/contactdev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess('Your message has been sent successfully!');
      // Clear only the message field, keep name and email
      setFormData(prev => ({
        ...prev,
        phone: '',
        message: ''
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.9),
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
            borderBottom: `2px solid ${theme.palette.primary.light}`,
            pb: 1
          }}
        >
          Contact Developer
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'action.disabledBackground',
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'action.disabledBackground',
                }
              }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <TextField
            fullWidth
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={6}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 1,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Message'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Contact Messages Table */}
      {/* <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Contact Submissions
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchContactMessages}
            startIcon={<Refresh />}
            disabled={loadingMessages}
          >
            Refresh
          </Button>
        </Box>
        
        {loadingMessages ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Alert severity="info">No contact messages found</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message._id} hover>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.phone || '-'}</TableCell>
                    <TableCell sx={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {message.message}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={message.status}
                        onChange={(e: SelectChangeEvent) => 
                          handleStatusChange(message._id, e.target.value as 'new' | 'in_progress' | 'resolved')
                        }
                        size="small"
                        sx={{ minWidth: '120px' }}
                      >
                        <MenuItem value="new">
                          <Chip 
                            label="New" 
                            size="small" 
                            color="default"
                            sx={{ width: '80px' }}
                          />
                        </MenuItem>
                        <MenuItem value="in_progress">
                          <Chip 
                            label="In Progress" 
                            size="small" 
                            color="primary"
                            sx={{ width: '80px' }}
                          />
                        </MenuItem>
                        <MenuItem value="resolved">
                          <Chip 
                            label="Resolved" 
                            size="small" 
                            color="success"
                            sx={{ width: '80px' }}
                          />
                        </MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper> */}
    </Container>
  );
}

