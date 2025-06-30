import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const AllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);

  const getAllProperty = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/admin/getallproperties', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching property data.");
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        All Properties Listed
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 700 }} aria-label="properties table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell><strong>Property ID</strong></TableCell>
              <TableCell align="center"><strong>Owner ID</strong></TableCell>
              <TableCell align="center"><strong>Property Type</strong></TableCell>
              <TableCell align="center"><strong>Ad Type</strong></TableCell>
              <TableCell align="center"><strong>Address</strong></TableCell>
              <TableCell align="center"><strong>Owner Contact</strong></TableCell>
              <TableCell align="center"><strong>Amount (Rs)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProperties.length > 0 ? allProperties.map((property) => (
              <TableRow key={property._id} hover>
                <TableCell>{property._id}</TableCell>
                <TableCell align="center">{property.ownerId}</TableCell>
                <TableCell align="center">{property.propertyType}</TableCell>
                <TableCell align="center">{property.propertyAdType}</TableCell>
                <TableCell align="center">{property.propertyAddress}</TableCell>
                <TableCell align="center">{property.ownerContact}</TableCell>
                <TableCell align="center">₹ {property.propertyAmt}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No property records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllProperty;
