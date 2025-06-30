import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Typography, Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for better visual consistency
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

const AllUsers = () => {
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/admin/getallusers', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data.success) {
        setAllUser(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      message.error("Failed to fetch users. Please try again.");
    }
  };

  const handleStatus = async (userid, status) => {
    try {
      const response = await axios.post('http://localhost:8001/api/admin/handlestatus', {
        userid,
        status
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data.success) {
        getAllUser(); // Refresh the user list
        message.success(`User access ${status} successfully.`);
      } else {
        message.error(response.data.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("An error occurred while updating user status.");
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        All Registered Users
      </Typography>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>User ID</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Name</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Email</StyledTableHeadCell>
              <StyledTableHeadCell align="center">User Type</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Owner Access Status</StyledTableHeadCell>
              <StyledTableHeadCell align="center">Action</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUser.length > 0 ? allUser.map((user) => (
              <StyledTableRow key={user._id}>
                <TableCell component="th" scope="row" sx={{ fontSize: '0.8rem' }}>
                  {user._id}
                </TableCell>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.type}</TableCell>
                <TableCell align="center">
                  {user.type === "Owner" ? (
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        color: user.granted === 'granted' ? 'success.main' : 'error.main',
                      }}
                    >
                      {user.granted ? user.granted.toUpperCase() : 'N/A'}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {user.type === 'Owner' && (
                    user.granted === 'ungranted' ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ minWidth: '120px' }}
                        onClick={() => handleStatus(user._id, 'granted')}
                      >
                        Grant Access
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{ minWidth: '120px' }}
                        onClick={() => handleStatus(user._id, 'ungranted')}
                      >
                        Revoke Access
                      </Button>
                    )
                  )}
                </TableCell>
              </StyledTableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  <Typography variant="h6">No users found.</Typography>
                  <Typography variant="body2">Check your database or try registering a new user.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllUsers;