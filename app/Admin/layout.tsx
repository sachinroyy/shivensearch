'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Avatar, 
  Divider,
  Container,
  CssBaseline,
  useMediaQuery,
  Theme,
  SxProps,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Subscriptions as SubscriptionsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  HowToReg as HowToRegIcon,
  People as PeopleIcon,
  DeveloperMode as DeveloperModeIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  ContactMail as ContactMailIcon
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Clear auth token
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const userData = await response.json();
        setUser(userData.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></Box>
      </Box>
    );
  }

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/Admin/dashboard' },
    { text: 'profile', icon: <HowToRegIcon />, path: '/Admin/dashboard/adddoctors' },
    
    { text: 'Subscriptions Plans', icon: <SubscriptionsIcon />, path: '/Admin/dashboard/plans' },
    { text: 'Subscriber Details', icon: <PeopleIcon />, path: '/Admin/dashboard/subscribers' },
    { text: 'Contact Us', icon: <ContactMailIcon />, path: '/Admin/dashboard/contactus' },
    { text: 'Contact Developer', icon: <DeveloperModeIcon />, path: '/Admin/dashboard/contactdeveloper' },
    { text: 'CRM', icon: <DashboardCustomizeIcon />, path: '/Admin/dashboard/crm' },
  ];

  // Drawer content
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Link href={item.path} passHref style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
              <ListItemButton
                selected={typeof window !== 'undefined' && window.location.pathname === item.path}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: 'text.primary'
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.name || user.email || 'Admin'}
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {(user.name || 'A').charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              background: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f7fa',
          minHeight: '100vh',
          marginTop: '64px'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
