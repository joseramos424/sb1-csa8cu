import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerForm from './pages/CustomerForm';
import ProductSelection from './pages/ProductSelection';
import OrderSummary from './pages/OrderSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/products" element={<ProductSelection />} />
        <Route path="/summary" element={<OrderSummary />} />
      </Routes>
    </Router>
  );
}

export default App;