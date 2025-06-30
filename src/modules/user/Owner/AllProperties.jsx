import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Keeping Ant Design messages for consistency

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, FormControl,
  InputLabel, Select, Grid, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Styled components for consistent table styling
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '0.9rem',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const OwnerAllProperties = () => { // Renamed component for clarity
  const [image, setImage] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({
    propertyType: '',
    propertyAdType: '',
    propertyAddress: '',
    ownerContact: '',
    propertyAmt: '', // Changed to string for consistency with TextField empty state
    additionalInfo: '',
    isAvailable: false, // Add isAvailable to state
  });
  const [allProperties, setAllProperties] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDeleteId, setPropertyToDeleteId] = useState(null);

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingPropertyId(null);
    setImage(null); // Clear image state on modal close
  };

  const handleEditModalShow = (propertyId) => {
    const propertyToEdit = allProperties.find(property => property._id === propertyId);
    if (propertyToEdit) {
      setEditingPropertyId(propertyId);
      // Ensure propertyAmt is a number for the form
      setEditingPropertyData({
        ...propertyToEdit,
        propertyAmt: String(propertyToEdit.propertyAmt), // Convert to string for TextField
        // propertyImage will not be pre-filled for security reasons with file inputs
        // If you want to show existing images, you'd fetch them separately or handle URLs
      });
      setShowEditModal(true);
    }
  };

  const handleDeleteConfirmOpen = (propertyId) => {
    setPropertyToDeleteId(propertyId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false);
    setPropertyToDeleteId(null);
  };

  const getAllProperties = async () => { // Renamed for clarity
    try {
      const response = await axios.get('http://localhost:8001/api/owner/getallproperties', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error(response.data.message || 'Something went wrong fetching properties');
      }
    } catch (error) {
      console.error("Error fetching owner properties:", error);
      message.error("Failed to fetch properties. Please try again.");
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Only allow single image update for simplicity
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingPropertyData({ ...editingPropertyData, [name]: value });
  };

  const handleAvailabilityChange = (e) => {
    setEditingPropertyData({ ...editingPropertyData, isAvailable: e.target.checked });
  };


  const saveChanges = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!editingPropertyId) {
      return message.error('No property selected for editing.');
    }

    const formData = new FormData();
    formData.append('propertyType', editingPropertyData.propertyType);
    formData.append('propertyAdType', editingPropertyData.propertyAdType);
    formData.append('propertyAddress', editingPropertyData.propertyAddress);
    formData.append('ownerContact', editingPropertyData.ownerContact);
    formData.append('propertyAmt', editingPropertyData.propertyAmt);
    formData.append('additionalInfo', editingPropertyData.additionalInfo);
    // Only append image if a new one is selected
    if (image) {
      formData.append('propertyImage', image);
    }
    // Assuming 'isAvailable' is managed via a switch or checkbox in the form
    // If not, you might need a separate action or a clear field in the modal.
    // For now, I'll add a simple checkbox to the form for it.
    formData.append('isAvailable', editingPropertyData.isAvailable); // Ensure this is sent

    try {
      const res = await axios.patch(`http://localhost:8001/api/owner/updateproperty/${editingPropertyId}`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        message.success(res.data.message);
        getAllProperties(); // Refresh the list
        handleEditModalClose(); // Close modal on success
      } else {
        message.error(res.data.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error("Error saving property changes:", error);
      message.error('Failed to save changes. Please check console for details.');
    }
  };

  const handleDelete = async () => {
    if (!propertyToDeleteId) return;

    try {
      const response = await axios.delete(`http://localhost:8001/api/owner/deleteproperty/${propertyToDeleteId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data.success) {
        message.success(response.data.message);
        getAllProperties(); // Refresh the list
      } else {
        message.error(response.data.message || 'Failed to delete property');
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      message.error('Failed to delete property. Please try again.');
    } finally {
      handleDeleteConfirmClose();
    }
  };

  const getAvailabilityChipProps = (isAvailable) => {
    return isAvailable
      ? { label: 'Available', color: 'success' }
      : { label: 'Not Available', color: 'error' };
  };

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        Your Listed Properties
      </Typography>
      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="owner properties table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Property ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Type</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Ad Type</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Address</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Contact</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Amount</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Availability</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProperties.length > 0 ? (
              allProperties.map((property) => (
                <StyledTableRow key={property._id}>
                  <TableCell component="th" scope="row" sx={{ fontSize: '0.8rem' }}>
                    {property._id}
                  </TableCell>
                  <TableCell align="center">{property.propertyType}</TableCell>
                  <TableCell align="center">{property.propertyAdType}</TableCell>
                  <TableCell align="center">{property.propertyAddress}</TableCell>
                  <TableCell align="center">{property.ownerContact}</TableCell>
                  <TableCell align="center">₹{property.propertyAmt}</TableCell>
                  <TableCell align="center">
                    <Chip {...getAvailabilityChipProps(property.isAvailable)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditModalShow(property._id)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteConfirmOpen(property._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  <Typography variant="h6">No properties listed yet.</Typography>
                  <Typography variant="body2">Click "Add Property" to list your first property.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Property Modal */}
      <Dialog open={showEditModal} onClose={handleEditModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Property Details</DialogTitle>
        <Box component="form" onSubmit={saveChanges} noValidate>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    name='propertyType'
                    value={editingPropertyData.propertyType}
                    label="Property Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="land/plot">Land/Plot</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Property Ad Type</InputLabel>
                  <Select
                    name='propertyAdType'
                    value={editingPropertyData.propertyAdType}
                    label="Property Ad Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="rent">Rent</MenuItem>
                    <MenuItem value="sale">Sale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name='propertyAddress'
                  label="Property Full Address"
                  type="text"
                  fullWidth
                  value={editingPropertyData.propertyAddress}
                  onChange={handleChange}
                  required
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name='ownerContact'
                  label="Owner Contact No."
                  type="tel"
                  fullWidth
                  value={editingPropertyData.ownerContact}
                  onChange={handleChange}
                  required
                  size="small"
                  variant="outlined"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name='propertyAmt'
                  label="Property Amount (₹)"
                  type="number"
                  fullWidth
                  value={editingPropertyData.propertyAmt}
                  onChange={handleChange}
                  required
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name='additionalInfo'
                  label="Additional details for the Property"
                  multiline
                  rows={3}
                  fullWidth
                  value={editingPropertyData.additionalInfo}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: '40px', borderColor: 'rgba(0, 0, 0, 0.23)', color: 'rgba(0, 0, 0, 0.6)', '&:hover': { borderColor: 'primary.main' } }}
                >
                  Upload New Image (Optional)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="propertyImage"
                    onChange={handleImageChange}
                  />
                </Button>
                {image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    1 file selected: {image.name}
                  </Typography>
                )}
                {/* Optional: Display current image(s) here if propertyData.propertyImage is a URL or array of URLs */}
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" variant="standard" fullWidth>
                  <Typography variant="subtitle1" component="legend">Property Availability</Typography>
                  <Button
                    variant={editingPropertyData.isAvailable ? "contained" : "outlined"}
                    color={editingPropertyData.isAvailable ? "success" : "error"}
                    onClick={() => setEditingPropertyData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                    sx={{ mt: 1 }}
                  >
                    {editingPropertyData.isAvailable ? "Set to Not Available" : "Set to Available"}
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditModalClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerAllProperties;