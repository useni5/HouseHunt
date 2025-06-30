import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Tabs, Tab, Container
} from '@mui/material';
import { UserContext } from '../../../App'; // Adjust path if necessary
import PropTypes from 'prop-types';

// Import the renamed components
import AddProperty from './AddProperty';
import OwnerAllProperties from './AllProperties'; // Renamed to OwnerAllProperties
import OwnerAllBookings from './AllBookings';   // Renamed to OwnerAllBookings

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`owner-tabpanel-${index}`}
      aria-labelledby={`owner-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* Removed Typography wrapper to avoid issues with complex children */}
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
    id: `owner-tab-${index}`,
    'aria-controls': `owner-tabpanel-${index}`,
  };
}

const OwnerHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate(); // Use useNavigate hook
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Redirect to home page after logout
  };

  // Improved user check and loading state/redirection
  if (!user || !user.userData) {
    // Optionally, show a loading spinner or redirect to login
    return (
      <Container className="text-center mt-5">
        <Typography variant="h5" color="textSecondary">
          Please log in as an Owner to access this dashboard.
        </Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 3 }}>Go to Login</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white', py: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            RentEase Owner
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'medium', color: 'text.secondary' }}>
              Hi, {user.userData.name}
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
            aria-label="Owner Dashboard Tabs"
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Add Property" {...a11yProps(0)} />
            <Tab label="My Properties" {...a11yProps(1)} /> {/* Changed label for clarity */}
            <Tab label="Bookings Received" {...a11yProps(2)} /> {/* Changed label for clarity */}
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <AddProperty />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <OwnerAllProperties /> {/* Using the renamed component */}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <OwnerAllBookings /> {/* Using the renamed component */}
        </CustomTabPanel>
      </Container>
    </Box>
  );
};

export default OwnerHome;