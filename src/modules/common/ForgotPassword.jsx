import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { message } from 'antd';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password || !data.confirmPassword) {
      return message.error("Please fill in all fields");
    }

    if (data.password !== data.confirmPassword) {
      return message.error("Passwords do not match");
    }

    try {
      const res = await axios.post("http://localhost:8001/api/user/forgotpassword", data);
      if (res.data.success) {
        message.success("Password updated successfully!");
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        message.error("User doesn't exist");
        navigate("/register");
      } else {
        message.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/" className="text-decoration-none text-dark">
              <h2>RentEase</h2>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto" />
            <Nav>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Forgot Password?
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              value={data.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ width: 200 }}
              >
                Change Password
              </Button>
            </Box>

            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'red' }}>
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
