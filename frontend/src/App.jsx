import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function App() {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/sweets`)
      .then((r) => setSweets(r.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Sweet Shop</h1>
      <div style={{ marginBottom: 10 }}>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {sweets.map((s) => (
          <div key={s._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
            <h3>{s.name}</h3>
            <p>Category: {s.category}</p>
            <p>Price: ₹{s.price}</p>
            <p>Quantity: {s.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
