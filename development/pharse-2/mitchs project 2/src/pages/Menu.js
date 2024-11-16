import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Card, CardBody, CardText, CardTitle, Button, Form, Row, Col, Navbar, Nav } from 'react-bootstrap';
import BreakfastImg from '../utils/img/breakfast.jpg';
import LunchImg from '../utils/img/lunch.jpg';
import DinnerImg from '../utils/img/dinner.jpg';
import DessertImg from '../utils/img/dessert.jpg';

// URL for fetching and posting data (replace with your actual API endpoints)
const API_BASE_URL = 'http://localhost:5000';

function Menu() {
  const [menu, setMenu] = useState({ breakfast: [], lunch: [], dinner: [], dessert: [] });
  const [order, setOrder] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    dessert: [],
  });
  const [showMpesaInput, setShowMpesaInput] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [orderCount, setOrderCount] = useState(0); // Track the number of items added to the order

  // Fetch menu data on component mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const breakfastResponse = await fetch(`${API_BASE_URL}/breakfast`);
        const lunchResponse = await fetch(`${API_BASE_URL}/lunch`);
        const dinnerResponse = await fetch(`${API_BASE_URL}/dinner`);
        const dessertResponse = await fetch(`${API_BASE_URL}/dessert`);

        const breakfastData = await breakfastResponse.json();
        const lunchData = await lunchResponse.json();
        const dinnerData = await dinnerResponse.json();
        const dessertData = await dessertResponse.json();

        setMenu({
          breakfast: breakfastData,
          lunch: lunchData,
          dinner: dinnerData,
          dessert: dessertData,
        });
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToOrder = (category, item) => {
    setOrder(prevOrder => {
      const categoryItems = prevOrder[category];
      const existingItem = categoryItems.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return {
          ...prevOrder,
          [category]: categoryItems.map(orderItem =>
            orderItem.id === item.id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          ),
        };
      } else {
        return {
          ...prevOrder,
          [category]: [...categoryItems, { ...item, quantity: 1 }],
        };
      }
    });

    // Update the order count
    setOrderCount(prevCount => prevCount + 1);

    alert(`${item.name} has been added to your order!`);
    setShowMpesaInput(true); // Show MPESA input after the alert
  };

  const handleMpesaChange = (e) => {
    setMpesaNumber(e.target.value);
  };

  const handleOrderSubmit = async () => {
    if (!mpesaNumber) {
      alert('Please enter your MPESA number.');
      return;
    }

    const orderData = {
      orderItems: [
        ...order.breakfast,
        ...order.lunch,
        ...order.dinner,
        ...order.dessert,
      ],
      mpesaNumber,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        setOrder({ breakfast: [], lunch: [], dinner: [], dessert: [] });
        setShowMpesaInput(false);
        setMpesaNumber('');
        setOrderCount(0); // Reset order count after order is placed
      } else {
        alert('There was an error placing your order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again later.');
    }
  };

  return (
    <div className="menu-page">
      {/* Navbar with Order Count */}
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Menu</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/contact">Contact</Nav.Link>

          {/* Order count displayed next to Contact */}
          <span className="order-count">
            {orderCount} / 10 Orders Placed
          </span>
        </Nav>
      </Navbar>

      <header className="mt-5">
        <div className="container h-100 d-flex align-items-center justify-content-center">
          <h1 className="text-light">Menu</h1>
        </div>
      </header>

      {/* Breakfast Section */}
      <div className="breakfast my-5 bg-dark text-light">
        <div className="container">
          <h2 className="text-center fs-1 mb-4 mb-lg-5 text-uppercase fw-bold text-success">Breakfast</h2>
          <div className="row flex-column-reverse flex-lg-row">
            <div className="col-lg-6 d-flex justify-content-center">
              <img src={BreakfastImg} className="img-fluid w-75 mt-4 mt-lg-0" alt="" />
            </div>
            <div className="col-lg-6 d-flex flex-column justify-content-around">
              {menu.breakfast.map(item => (
                <div key={item.id}>
                  <Card className="border-0 bg-dark text-light">
                    <CardBody>
                      <CardTitle className="text-center fs-3">{item.name}</CardTitle>
                      <CardText className="text-center fs-5">{item.description}</CardText>
                      <CardText className="text-center fs-3 fw-bold text-success">{item.price}</CardText>
                      <Button variant="primary" onClick={() => handleAddToOrder('breakfast', item)}>
                        Add to Order
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lunch Section */}
      <div className="lunch my-5 bg-dark text-light">
        <div className="container">
          <h2 className="text-center fs-1 mb-4 mb-lg-5 text-uppercase fw-bold text-success">Lunch</h2>
          <div className="row flex-column-reverse flex-lg-row">
            <div className="col-lg-6 d-flex justify-content-center">
              <img src={LunchImg} className="img-fluid w-75 mt-4 mt-lg-0" alt="" />
            </div>
            <div className="col-lg-6 d-flex flex-column justify-content-around">
              {menu.lunch.map(item => (
                <div key={item.id}>
                  <Card className="border-0 bg-dark text-light">
                    <CardBody>
                      <CardTitle className="text-center fs-3">{item.name}</CardTitle>
                      <CardText className="text-center fs-5">{item.description}</CardText>
                      <CardText className="text-center fs-3 fw-bold text-success">{item.price}</CardText>
                      <Button variant="primary" onClick={() => handleAddToOrder('lunch', item)}>
                        Add to Order
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dinner Section */}
      <div className="dinner my-5 bg-dark text-light">
        <div className="container">
          <h2 className="text-center fs-1 mb-4 mb-lg-5 text-uppercase fw-bold text-success">Dinner</h2>
          <div className="row flex-column-reverse flex-lg-row">
            <div className="col-lg-6 d-flex justify-content-center">
              <img src={DinnerImg} className="img-fluid w-75 mt-4 mt-lg-0" alt="" />
            </div>
            <div className="col-lg-6 d-flex flex-column justify-content-around">
              {menu.dinner.map(item => (
                <div key={item.id}>
                  <Card className="border-0 bg-dark text-light">
                    <CardBody>
                      <CardTitle className="text-center fs-3">{item.name}</CardTitle>
                      <CardText className="text-center fs-5">{item.description}</CardText>
                      <CardText className="text-center fs-3 fw-bold text-success">{item.price}</CardText>
                      <Button variant="primary" onClick={() => handleAddToOrder('dinner', item)}>
                        Add to Order
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dessert Section */}
      <div className="dessert my-5 bg-dark text-light">
        <div className="container">
          <h2 className="text-center fs-1 mb-4 mb-lg-5 text-uppercase fw-bold text-success">Dessert</h2>
          <div className="row flex-column-reverse flex-lg-row">
            <div className="col-lg-6 d-flex justify-content-center">
              <img src={DessertImg} className="img-fluid w-75 mt-4 mt-lg-0" alt="" />
            </div>
            <div className="col-lg-6 d-flex flex-column justify-content-around">
              {menu.dessert.map(item => (
                <div key={item.id}>
                  <Card className="border-0 bg-dark text-light">
                    <CardBody>
                      <CardTitle className="text-center fs-3">{item.name}</CardTitle>
                      <CardText className="text-center fs-5">{item.description}</CardText>
                      <CardText className="text-center fs-3 fw-bold text-success">{item.price}</CardText>
                      <Button variant="primary" onClick={() => handleAddToOrder('dessert', item)}>
                        Add to Order
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MPESA Number Input Section (Appears after the alert) */}
      {showMpesaInput && (
        <div className="mpesa-input my-4">
          <div className="container">
            <h3 className="text-center text-light">Please enter your MPESA number to complete the order:</h3>
            <Form>
              <Row>
                <Col lg={6} className="mx-auto">
                  <Form.Control
                    type="text"
                    placeholder="Enter your MPESA number"
                    value={mpesaNumber}
                    onChange={handleMpesaChange}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="order-summary py-5 bg-dark text-light">
        <div className="container">
          <h2 className="text-center fs-2 mb-4">Order Summary</h2>
          {['breakfast', 'lunch', 'dinner', 'dessert'].map(category => (
            <div key={category}>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <ul>
                {order[category].map(item => (
                  <li key={item.id}>
                    {item.name} x{item.quantity} - {item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Button variant="success" onClick={handleOrderSubmit}>Place Order</Button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
