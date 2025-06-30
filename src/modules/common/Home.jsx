import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, Container, Grid, Paper
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';

// IMPORTANT: Ensure these image files (p1.jpg, p2.jpg, p3.jpg, p4.jpg)
// are in your src/images/ folder and have the correct .jpg extension.
import p1 from '../../images/p5.jpg';
import p2 from '../../images/p6.jpg';
import p3 from '../../images/p9.jpg';
import p4 from '../../images/p0.jpg';

import AllPropertiesCards from '../user/AllPropertiesCards';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      switch (user.type) {
        case "Admin":
          navigate("/adminhome");
          break;
        case "Owner":
          if (user.granted === "ungranted") {
            alert("Admin approval pending for your owner account.");
            return;
          }
          navigate("/ownerhome");
          break;
        case "Renter":
          navigate("/renterhome");
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  const carouselImages = [p1, p2, p3, p4];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* HEADER: Brand Name Changed to HomeSearch */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white', py: 1 }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', fontWeight: 'bold', color: 'primary.main' }}>
              HomeSearch {/* BRAND NAME CHANGED HERE! */}
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button component={Link} to="/" sx={{ color: 'text.secondary', fontWeight: 'medium', mx: 1 }}>Home</Button>
              <Button component={Link} to="/login" sx={{ color: 'text.secondary', fontWeight: 'medium', mx: 1 }}>Login</Button>
              <Button component={Link} to="/register" sx={{ color: 'text.secondary', fontWeight: 'medium', mx: 1 }}>Register</Button>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Top Carousel Section (Visual only) */}
      <Box sx={{
        width: '100%',
        height: { xs: '40vh', sm: '50vh', md: '60vh' },
        overflow: 'hidden',
        mb: 4,
      }}>
        <Carousel
          autoPlay={true}
          animation="slide"
          indicators={false}
          navButtonsAlwaysVisible={true}
          interval={4000}
          sx={{ width: '100%', height: '100%' }}
        >
          {carouselImages.map((img, idx) => (
            <Box key={idx} sx={{ width: '100%', height: '100%' }}>
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Hero Text Section (Below Carousel) */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Dream Home Awaits
        </Typography>
        <Typography variant="h6" component="h2" color="text.secondary" sx={{ mb: 4 }}>
          Browse a curated selection of properties for every lifestyle.
        </Typography>
        <Button
          component={Link}
          to="/properties"
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            px: 6,
            py: 1.5,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '30px',
          }}
        >
          Discover Rentals
        </Button>
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Why Choose HomeSearch?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              We connect renters with their ideal homes and empower owners to list properties effortlessly. Enjoy seamless bookings, trusted listings, and unparalleled support. Your perfect stay is just a click away!
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Vast Selection</Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore thousands of properties, from cozy apartments to spacious homes.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Easy Listings</Typography>
                <Typography variant="body2" color="text.secondary">
                  Owners can list properties in minutes with our intuitive platform.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Seamless Experience</Typography>
                <Typography variant="body2" color="text.secondary">
                  From Browse to booking, enjoy a smooth, hassle-free journey.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Register as Owner Call to Action */}
      <Box sx={{ bgcolor: 'info.main', color: 'white', py: 6, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to list your property and connect with renters?
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'success.main',
              color: 'white',
              '&:hover': { bgcolor: 'success.dark' },
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '25px',
            }}
          >
            List Your Property - Join as Owner
          </Button>
        </Container>
      </Box>

      {/* Featured Properties Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Handpicked Properties Just For You
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Explore our top listings and find your perfect match.
          </Typography>
        </Box>
        <AllPropertiesCards />
      </Container>

      {/* Basic Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 3, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} HomeSearch. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', marginRight: '10px' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;