import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import OrderTabs from './components/OrderTabs';
import Navbar from './common/Navbar';

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem('auth') === 'true';
  return isAuth ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <OrderTabs />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
