import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [signs, setSigns] = useState([]);
  const [codes, setCodes] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [caOnly, setCaOnly] = useState(false);

  useEffect(() => {
    axios.get('/api/signs').then(res => setSigns(res.data));
    axios.get('/api/codes').then(res => setCodes(res.data));
  }, []);

  const filtered = signs.filter(sign =>
    (!filter || sign.code[0] === filter) &&
    sign.filename.toLowerCase().includes(search.toLowerCase()) &&
    (!caOnly || sign.filename.includes('(CA)'))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f4f6fa', padding: 0 }}>
      <div style={{ padding: '32px 0 8px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#222', marginBottom: 8 }}>
          MUTCD Sign Code Grid
        </div>
        <div style={{ fontSize: 16, color: '#555', marginBottom: 0 }}>
          Search by sign code or filter by code type using the dropdown below.
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: 10,
        margin: '0 auto 24px auto',
        padding: 20,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        maxWidth: 600,
        width: '90%',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <input
          type="text"
          placeholder="Search sign code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: 16,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            outline: 'none',
            background: '#f9fafb',
            transition: 'border 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            fontSize: 16,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            background: '#f9fafb',
            outline: 'none',
            minWidth: 120,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <option value="">All Codes</option>
          {codes.map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: '#333', marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={caOnly}
            onChange={e => setCaOnly(e.target.checked)}
            style={{ accentColor: '#1976d2', width: 18, height: 18 }}
          />
          (CA) Only
        </label>
      </div>
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 16,
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        padding: 24,
        background: '#fff',
        margin: '0 24px 24px 24px'
      }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 18 }}>
            No signs found.
          </div>
        ) : filtered.map(sign => (
          <div key={sign.filename} style={{ textAlign: 'center' }}>
            <img
              src={`/images/mutcd/${sign.filename}`}
              alt={sign.filename}
              loading="lazy"
              style={{ width: 100, height: 100, objectFit: 'contain', background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
            />
            <div style={{ marginTop: 8, fontSize: 14, color: '#333', fontWeight: 500 }}>{sign.filename}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
