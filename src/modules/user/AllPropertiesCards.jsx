import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Button, Card, Modal, Carousel, Col, Form, Row, Container
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { message } from 'antd';

const AllPropertiesCards = ({ loggedIn }) => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [filterPropertyType, setPropertyType] = useState('');
  const [filterPropertyAdType, setPropertyAdType] = useState('');
  const [filterPropertyAddress, setPropertyAddress] = useState('');
  const [propertyOpen, setPropertyOpen] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: '', phone: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8001/api/user/getAllProperties');
        setAllProperties(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleShow = (id) => {
    setPropertyOpen(id);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setUserDetails({ fullName: '', phone: '' });
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      const res = await axios.post(
        `http://localhost:8001/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        handleClose();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProperties = allProperties
    .filter(p => !filterPropertyAddress || p.propertyAddress.toLowerCase().includes(filterPropertyAddress.toLowerCase()))
    .filter(p => !filterPropertyAdType || p.propertyAdType.toLowerCase().includes(filterPropertyAdType.toLowerCase()))
    .filter(p => !filterPropertyType || p.propertyType.toLowerCase().includes(filterPropertyType.toLowerCase()));

  return (
    <Container className="py-5">
      <div className="filter-container d-flex flex-wrap justify-content-center align-items-center mb-5 gap-3">
        <h5 className="mb-0 fw-bold">Filter By:</h5>
        <Form.Control
          type="text"
          placeholder="Address"
          value={filterPropertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          className="w-auto custom-filter-input"
        />
        <Form.Select
          value={filterPropertyAdType}
          onChange={(e) => setPropertyAdType(e.target.value)}
          className="w-auto custom-filter-select"
        >
          <option value="">All Ad Types</option>
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </Form.Select>
        <Form.Select
          value={filterPropertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-auto custom-filter-select"
        >
          <option value="">All Types</option>
          <option value="commercial">Commercial</option>
          <option value="land/plot">Land/Plot</option>
          <option value="residential">Residential</option>
        </Form.Select>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Col key={property._id}>
              <Card className="h-100 shadow-sm border-0 rounded-lg overflow-hidden property-card">
                <Card.Img
                  variant="top"
                  src={`http://localhost:8001${property.propertyImage[0].path}`}
                  alt="property"
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body className="p-3 d-flex flex-column">
                  <Card.Title className="fw-bold fs-5 text-primary-blue mb-2">
                    {property.propertyAddress}
                  </Card.Title>
                  <Card.Text className="text-gray-dark fs-6 mb-2">
                    <strong className="text-gray-medium">Type:</strong> {property.propertyType}<br />
                    <strong className="text-gray-medium">Ad:</strong> {property.propertyAdType}
                  </Card.Text>
                  {loggedIn && (
                    <Card.Text className="text-gray-dark fs-6 mb-2">
                      <strong className="text-gray-medium">Contact:</strong> {property.ownerContact}<br />
                      <strong className="text-gray-medium">Available:</strong> {property.isAvailable}<br />
                      <strong className="text-gray-medium">Amount:</strong> ₹{property.propertyAmt}
                    </Card.Text>
                  )}
                  <div className="mt-auto pt-2">
                    {!loggedIn ? (
                      <Link to="/login" className="d-block mt-3">
                        <Button variant="outline-primary-blue" size="sm" className="w-100 fw-medium">Get Info</Button>
                      </Link>
                    ) : property.isAvailable === "Available" ? (
                      <Button variant="primary-blue" size="sm" onClick={() => handleShow(property._id)} className="w-100 fw-medium mt-3">
                        Get Info
                      </Button>
                    ) : (
                      <p className="text-danger small mt-3 fw-medium">Not Available</p>
                    )}
                  </div>
                </Card.Body>
              </Card>

              <Modal show={show && propertyOpen === property._id} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold text-primary-blue">Property Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Carousel activeIndex={index} onSelect={setIndex} className="mb-4">
                    {property.propertyImage.map((image, idx) => (
                      <Carousel.Item key={idx}>
                        <img
                          src={`http://localhost:8001${image.path}`}
                          className="d-block w-100 rounded"
                          alt={`Property Image ${idx + 1}`}
                          style={{ maxHeight: '380px', objectFit: 'cover' }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Row className="mb-4">
                    <Col md={6}>
                      <p className="mb-2"><b className="text-gray-medium">Owner Contact:</b> <span className="text-gray-dark">{property.ownerContact}</span></p>
                      <p className="mb-2"><b className="text-gray-medium">Available:</b> <span className="text-gray-dark">{property.isAvailable}</span></p>
                      <p className="mb-2"><b className="text-gray-medium">Amount:</b> <span className="text-gray-dark">₹{property.propertyAmt}</span></p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2"><b className="text-gray-medium">Location:</b> <span className="text-gray-dark">{property.propertyAddress}</span></p>
                      <p className="mb-2"><b className="text-gray-medium">Type:</b> <span className="text-gray-dark">{property.propertyType}</span></p>
                      <p className="mb-2"><b className="text-gray-medium">Ad Type:</b> <span className="text-gray-dark">{property.propertyAdType}</span></p>
                    </Col>
                  </Row>
                  <p className="mb-4"><b className="text-gray-medium">More Info:</b> <span className="text-gray-dark">{property.additionalInfo}</span></p>
                  <hr className="my-4" />
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    handleBooking('pending', property._id, property.ownerId);
                  }}>
                    <h5 className="mb-3 fw-bold">Interested? Enter Your Details to Book</h5>
                    <Row className="g-3 mb-4">
                      <Col md={6}>
                        <Form.Control
                          placeholder="Full Name"
                          name="fullName"
                          value={userDetails.fullName}
                          onChange={handleChange}
                          required
                          className="py-2"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="tel"
                          placeholder="Phone Number"
                          name="phone"
                          value={userDetails.phone}
                          onChange={handleChange}
                          required
                          className="py-2"
                        />
                      </Col>
                    </Row>
                    <Button variant="dark" type="submit" className="w-100 py-2 fw-bold">Book Property</Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <p className="text-center mt-4 fs-5 text-gray-medium">No Properties available at the moment.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AllPropertiesCards;