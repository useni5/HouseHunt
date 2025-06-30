import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { message } from 'antd'; // Keeping Ant Design messages for consistency in notifications

function AddProperty() {
  const [image, setImage] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: 'residential',
    propertyAdType: 'rent',
    propertyAddress: '',
    ownerContact: '',
    propertyAmt: '', // Changed to string for empty state in TextField
    additionalInfo: ''
  });

  const handleImageChange = (e) => {
    setImage(e.target.files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // No need for this useEffect, as image is directly appended in handleSubmit
  // useEffect(() => {
  //   setPropertyDetails((prevDetails) => ({
  //     ...prevDetails,
  //     propertyImages: image,
  //   }));
  // }, [image]);

  const resetForm = () => {
    setPropertyDetails({
      propertyType: 'residential',
      propertyAdType: 'rent',
      propertyAddress: '',
      ownerContact: '',
      propertyAmt: '',
      additionalInfo: ''
    });
    setImage(null);
    // You might need to clear the file input value,
    // which can be tricky with controlled components.
    // A simple way is to use a ref or re-render the input.
    // For now, it just resets the state.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!propertyDetails.propertyAddress || !propertyDetails.ownerContact || !propertyDetails.propertyAmt) {
      return message.error('Please fill in all required fields: Address, Contact, and Amount.');
    }
    if (!image || image.length === 0) {
      return message.error('Please upload at least one property image.');
    }

    const formData = new FormData();
    formData.append('propertyType', propertyDetails.propertyType);
    formData.append('propertyAdType', propertyDetails.propertyAdType);
    formData.append('propertyAddress', propertyDetails.propertyAddress);
    formData.append('ownerContact', propertyDetails.ownerContact);
    formData.append('propertyAmt', propertyDetails.propertyAmt);
    formData.append('additionalInfo', propertyDetails.additionalInfo);

    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append('propertyImages', image[i]);
      }
    }

    try {
      const res = await axios.post('http://localhost:8001/api/owner/postproperty', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        resetForm(); // Clear the form after successful submission
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      // More descriptive error for the user
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Failed to add property: ${error.response.data.message}`);
      } else {
        message.error('Something went wrong while adding the property. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
        List Your Property
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Property Type */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="propertyType-label">Property Type</InputLabel>
              <Select
                labelId="propertyType-label"
                id="propertyType-select"
                name="propertyType"
                value={propertyDetails.propertyType}
                label="Property Type"
                onChange={handleChange}
              >
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="land/plot">Land/Plot</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Property Ad Type */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="propertyAdType-label">Ad Type</InputLabel>
              <Select
                labelId="propertyAdType-label"
                id="propertyAdType-select"
                name="propertyAdType"
                value={propertyDetails.propertyAdType}
                label="Ad Type"
                onChange={handleChange}
              >
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Property Full Address */}
          <Grid item xs={12} sm={4}>
            <TextField
              name="propertyAddress"
              label="Property Full Address"
              type="text"
              fullWidth
              value={propertyDetails.propertyAddress}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
            />
          </Grid>

          {/* Property Images */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: '40px', borderColor: 'rgba(0, 0, 0, 0.23)', color: 'rgba(0, 0, 0, 0.6)', '&:hover': { borderColor: 'primary.main' } }}
            >
              Upload Images (Max 5)
              <input
                type="file"
                hidden
                accept="image/*"
                name="propertyImages"
                multiple
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {image.length} file(s) selected
              </Typography>
            )}
          </Grid>

          {/* Owner Contact No. */}
          <Grid item xs={12} sm={3}>
            <TextField
              name="ownerContact"
              label="Owner Contact No."
              type="tel" // Use tel for phone numbers
              fullWidth
              value={propertyDetails.ownerContact}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
              inputProps={{ maxLength: 10 }} // Example: for 10-digit phone numbers
            />
          </Grid>

          {/* Property Amount */}
          <Grid item xs={12} sm={3}>
            <TextField
              name="propertyAmt"
              label="Property Amount (₹)"
              type="number"
              fullWidth
              value={propertyDetails.propertyAmt}
              onChange={handleChange}
              required
              size="small"
              variant="outlined"
            />
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12}>
            <TextField
              name="additionalInfo"
              label="Additional details for the Property"
              multiline
              rows={4}
              fullWidth
              value={propertyDetails.additionalInfo}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 4, py: 1.2, fontWeight: 'bold' }}
          >
            List Property
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddProperty;