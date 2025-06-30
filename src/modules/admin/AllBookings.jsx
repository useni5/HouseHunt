import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box, Chip
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

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);

  const getAllBooking = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/admin/getallbookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data.success) {
        setAllBookings(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
      message.error("Failed to fetch booking data. Please try again.");
    }
  };

  useEffect(() => {
    getAllBooking();
  }, []);

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'warning' };
      case 'approved':
        return { label: 'Approved', color: 'success' };
      case 'rejected':
        return { label: 'Rejected', color: 'error' };
      default:
        return { label: 'Unknown', color: 'info' };
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        All Property Bookings
      </Typography>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="booking table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Booking ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Owner ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Property ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Tenant ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Tenant Name</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Contact</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Status</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.length > 0 ? (
              allBookings.map((booking) => (
                <StyledTableRow key={booking._id}>
                  <TableCell component="th" scope="row" sx={{ fontSize: '0.8rem' }}>
                    {booking._id}
                  </TableCell>
                  <TableCell align="center">{booking.ownerID}</TableCell>
                  <TableCell align="center">{booking.propertyId}</TableCell>
                  <TableCell align="center">{booking.userID}</TableCell>
                  <TableCell align="center">{booking.userName}</TableCell>
                  <TableCell align="center">{booking.phone}</TableCell>
                  <TableCell align="center">
                    <Chip {...getStatusChipProps(booking.bookingStatus)} size="small" />
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  <Typography variant="h6">No bookings available.</Typography>
                  <Typography variant="body2">Check your database for booking records.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllBookings;