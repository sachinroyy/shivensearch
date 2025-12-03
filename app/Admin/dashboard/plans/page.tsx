'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/GridLegacy';

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<Omit<Plan, '_id'>>({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    features: [],
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Optionally show error to user
      }
    };

    fetchPlans();
  }, []);

  const handleOpen = (plan: Plan | null = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        features: [...plan.features],
        isActive: plan.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 1,
        features: [],
        isActive: true,
      });
      setEditingPlan(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPlan(null);
    setNewFeature('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPlan ? `/api/plans/${editingPlan._id}` : '/api/plans';
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(editingPlan ? 'Failed to update plan' : 'Failed to create plan');
      }
      
      const updatedPlan = await response.json();
      
      if (editingPlan) {
        setPlans(plans.map(plan => 
          plan._id === editingPlan._id ? updatedPlan : plan
        ));
      } else {
        setPlans([updatedPlan, ...plans]);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error saving plan:', error);
      // Optionally show error to user
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const response = await fetch(`/api/plans/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete plan');
        }
        
        // Update the local state to reflect the deletion
        setPlans(plans.filter(plan => plan._id !== id));
      } catch (error) {
        console.error('Error deleting plan:', error);
        // Optionally show error to user
      }
    }
  };

  const togglePlanStatus = async (id: string) => {
    try {
      const planToUpdate = plans.find(plan => plan._id === id);
      if (!planToUpdate) return;
      
      const updatedPlan = { ...planToUpdate, isActive: !planToUpdate.isActive };
      
      const response = await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: updatedPlan.isActive }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update plan status');
      }
      
      setPlans(plans.map(plan => 
        plan._id === id ? updatedPlan : plan
      ));
    } catch (error) {
      console.error('Error toggling plan status:', error);
      // Optionally show error to user
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4">Subscription Plans</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Plan
        </Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan._id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              opacity: plan.isActive ? 1 : 0.7
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    {plan.name}
                  </Typography>
                  <Chip 
                    label={plan.isActive ? 'Active' : 'Inactive'} 
                    color={plan.isActive ? 'success' : 'default'} 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="h5" color="primary" gutterBottom>
                  ₹{plan.price.toLocaleString()}
                  <Typography component="span" color="text.secondary" ml={1}>
                    /{plan.duration} {plan.duration > 1 ? 'months' : 'month'}
                  </Typography>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {plan.features.map((feature, index) => (
                      <Chip 
                        key={index} 
                        label={feature} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid #eee' }}>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleOpen(plan)}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color={plan.isActive ? 'warning' : 'success'}
                  onClick={() => togglePlanStatus(plan._id)}
                >
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(plan._id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                name="name"
                label="Plan Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
                margin="normal"
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="price"
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ min: 0, step: 1 }}
                />
                
                <TextField
                  name="duration"
                  label="Duration (months)"
                  type="number"
                  fullWidth
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Features
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label="Add feature"
                    fullWidth
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    size="small"
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddFeature}
                    disabled={!newFeature.trim()}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Add
                  </Button>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemoveFeature(feature)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingPlan ? 'Update' : 'Create'} Plan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}