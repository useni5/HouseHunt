import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { message } from 'antd';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
  });

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, type } = data;

    if (!name || !email || !password || !type) {
      return message.error('Please fill in all fields');
    }

    try {
      const res = await axios.post('http://localhost:8001/api/user/register', data);
      if (res.data.success) {
        message.success(res.data.message);
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar expand="lg" bg="white" className="shadow-sm py-3">
        <Container fluid className="px-4">
          <Navbar.Brand className="fw-bold fs-4 text-primary-blue">RentEase</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="fw-medium">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="fw-medium">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="fw-medium">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container component="main" maxWidth="xs" className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
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
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              margin="normal"
              value={data.name}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              value={data.email}
              onChange={handleChange}
              type="email"
              required
              variant="outlined"
              size="small"
            />
            <TextField
              name="password"
              label="Password"
              fullWidth
              margin="normal"
              value={data.password}
              onChange={handleChange}
              type="password"
              required
              variant="outlined"
              size="small"
            />
            <FormControl fullWidth margin="normal" required variant="outlined" size="small">
              <InputLabel>User Type</InputLabel>
              <Select
                name="type"
                value={data.type}
                onChange={handleChange}
                label="User Type"
              >
                <MenuItem value=""><em>Select</em></MenuItem>
                {/* Changed "Renter" to "User" to match backend enum */}
                <MenuItem value="User">Renter (User)</MenuItem>
                <MenuItem value="Owner">Owner</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end" sx={{ mt: 2, fontSize: '0.875rem' }}>
              <Grid item>
                Already have an account?{" "}
                <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Sign In</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;