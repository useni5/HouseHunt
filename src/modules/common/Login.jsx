import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Removed React-Bootstrap Navbar, Container, Nav imports
import {
  Avatar, Button, TextField, Grid, Box, Typography,
  AppBar, Toolbar, Container // Added AppBar, Toolbar, Container from Material-UI
} from '@mui/material'; // Combined Material-UI imports
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { message } from 'antd'; // Keeping Ant Design message for toasts

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      return message.error("Please fill in all fields");
    }

    axios.post('http://localhost:8001/api/user/login', data)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // THIS IS THE CRUCIAL LINE: Update the user context
          setUser(res.data.user);

          const { type, granted } = res.data.user;

          if (type === "Admin") navigate("/adminhome");
          else if (type === "Renter") navigate("/renterhome");
          else if (type === "Owner") {
            if (granted === "ungranted") {
              return message.error("Your account is not yet confirmed by the admin");
            }
            navigate("/ownerhome");
          } else {
            navigate("/");
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          message.error("User doesn't exist or incorrect credentials");
        } else {
          message.error("Login failed. Please try again.");
        }
        console.error("Login error:", err);
      });
  };

  return (
    <>
      {/* Material-UI AppBar instead of React-Bootstrap Navbar */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white', py: 1 }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', fontWeight: 'bold', color: 'primary.main' }}>
              RentEase
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}> {/* Hide on small screens, show on medium and up */}
              <Button component={Link} to="/" sx={{ color: 'text.secondary', fontWeight: 'medium', mx: 1 }}>Home</Button>
              <Button component={Link} to="/login" sx={{ color: 'text.secondary', fontWeight: 'medium', mx: 1 }}>Login</Button>
              <Button component={Link} to="/register" sx={{ color: 'text.secondary', fontWeight: 'medium', mx: 1 }}>Register</Button>
            </Box>
            {/* You might want to add a MenuIcon for mobile navigation here */}
          </Container>
        </Toolbar>
      </AppBar>

      {/* Main content container, now using Material-UI Container */}
      <Container component="main" maxWidth="xs" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)', // Adjust height based on AppBar height
        py: 4 // Add some padding
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            borderRadius: 2,
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 3, fontWeight: 'bold', color: '#333' }}>
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              variant="outlined"
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={data.password}
              onChange={handleChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
              size="small"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              Sign In
            </Button>
            <Grid container sx={{ mt: 2, fontSize: '0.875rem' }}>
              <Grid item xs>
                <Link to="/forgotpassword" style={{ color: '#1976d2', textDecoration: 'none' }}> {/* Adjusted link color to MUI primary */}
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}> {/* Adjusted link color to MUI primary */}
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;