import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  AppBar, Toolbar, Typography, Button, Box,
  Tabs, Tab, Container
} from '@mui/material'; // Material-UI imports
import PropTypes from 'prop-types';
import { UserContext } from '../../App'; // Ensure this import is correct

// Import the sub-components
import AllUsers from './AllUsers';
import AllProperty from './AllProperty'; // This is the admin's AllProperty, not owner's
import AllBookings from './AllBookings'; // This is the admin's AllBookings

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* Removed Typography wrapper as it can interfere with children's styling */}
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => setValue(newValue);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Redirect to home page after logout
  };

  // If user context is not set, display a login prompt
  if (!user || !user.userData || user.userData.type !== 'Admin') {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You must be logged in as an **Admin** to access this dashboard.
        </Typography>
        <Button component={Link} to="/login" variant="contained" color="primary" sx={{ mr: 2 }}>
          Go to Login
        </Button>
        <Button component={Link} to="/" variant="outlined" color="secondary">
          Go to Home
        </Button>
      </Container>
    );
  }

  // Ensure user.userData and user.userData.name exist before accessing
  const userName = user.userData ? user.userData.name : 'Admin';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Material-UI AppBar instead of React-Bootstrap Navbar */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white', py: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            RentEase Admin
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'medium', color: 'text.secondary' }}>
              Hi, {userName}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogOut}
              sx={{ px: 2, py: 0.8 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Admin Dashboard Tabs"
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All Users" {...a11yProps(0)} />
            <Tab label="All Properties" {...a11yProps(1)} />
            <Tab label="All Bookings" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <AllUsers />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AllProperty />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AllBookings />
        </CustomTabPanel>
      </Container>
    </Box>
  );
};

export default AdminHome;