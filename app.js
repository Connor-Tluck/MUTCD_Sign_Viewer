import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [signs, setSigns] = useState([]);
  const [codes, setCodes] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/signs').then(res => setSigns(res.data));
    axios.get('http://localhost:3001/api/codes').then(res => setCodes(res.data));
  }, []);

  const filtered = signs.filter(sign =>
    (!filter || sign.code === filter) &&
    sign.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search sign code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 8, fontSize: 16 }}>
          <option value="">All Codes</option>
          {codes.map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 16,