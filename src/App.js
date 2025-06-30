import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';

import Home from './modules/common/Home';
import Register from './modules/common/Register';
import Login from './modules/common/Login';
import ForgotPassword from './modules/common/ForgotPassword';

import AdminHome from './modules/admin/AdminHome';

import OwnerHome from './modules/user/Owner/OwnerHome';
import AddProperty from './modules/user/Owner/AddProperty';
import OwnerAllBookings from './modules/user/Owner/AllBookings';
import OwnerProperty from './modules/user/Owner/AllProperties';

import RenterHome from './modules/user/renter/RenterHome';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/adminhome" element={<AdminHome />} />

          <Route path="/ownerhome" element={<OwnerHome />} />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/ownerproperties" element={<OwnerProperty />} />
          <Route path="/ownerbookings" element= {<OwnerAllBookings />} />

          <Route path="/renterhome" element={<RenterHome />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;