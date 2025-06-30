import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box, Button, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

const OwnerAllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);

  const getAllBookingsForOwner = async () => { // Renamed for clarity
    try {
      const response = await axios.get('http://localhost:8001/api/owner/getallbookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.data.success) {
        setAllBookings(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      message.error("Failed to fetch bookings. Please try again.");
    }
  };

  useEffect(() => {
    getAllBookingsForOwner();
  }, []);

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'warning' };
      case 'approved':
        return { label: 'Approved', color: 'success' };
      case 'rejected':
        return { label: 'Rejected', color: 'error' };
      case 'booked': // Assuming 'booked' is equivalent to 'approved' for display
        return { label: 'Booked', color: 'success' };
      default:
        return { label: 'Unknown', color: 'info' };
    }
  };

  const handleStatus = async (bookingId, propertyId, currentStatus) => {
    let newStatus;
    if (currentStatus === 'pending') {
      newStatus = 'approved'; // Change from pending to approved
    } else if (currentStatus === 'approved' || currentStatus === 'booked') {
      newStatus = 'pending'; // Change from approved/booked back to pending (for toggling)
    } else {
      newStatus = 'pending'; // Default or if status is rejected, can change to pending
    }

    try {
      const res = await axios.post('http://localhost:8001/api/owner/handlebookingstatus',
        { bookingId, propertyId, status: newStatus },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAllBookingsForOwner(); // Refresh data
      } else {
        message.error(res.data.message || 'Something went wrong while updating status');
      }
    } catch (error) {
      console.error("Error handling booking status:", error);
      message.error('Failed to update booking status. Please try again.');
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        Property Bookings for You
      </Typography>
      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="owner bookings table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Booking ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Property ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Tenant Name</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Tenant Phone</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Booking Status</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.length > 0 ? (
              allBookings.map((booking) => (
                <StyledTableRow key={booking._id}>
                  <TableCell component="th" scope="row" sx={{ fontSize: '0.8rem' }}>
                    {booking._id}
                  </TableCell>
                  <TableCell align="center">{booking.propertyId}</TableCell>
                  <TableCell align="center">{booking.userName}</TableCell>
                  <TableCell align="center">{booking.phone}</TableCell>
                  <TableCell align="center">
                    <Chip {...getStatusChipProps(booking.bookingStatus)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    {/* Simplified action button logic */}
                    {booking.bookingStatus === "pending" ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatus(booking._id, booking.propertyId, booking.bookingStatus)}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleStatus(booking._id, booking.propertyId, booking.bookingStatus)}
                      >
                        Reset to Pending
                      </Button>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  <Typography variant="h6">No bookings received yet.</Typography>
                  <Typography variant="body2">Properties you own are not yet booked.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OwnerAllBookings;