import { useState } from 'react';
import { cbrcToOp20, op20ToCbrc, formatInputNumber, parseInputNumber } from '../../utils';

export default function MotoConverter() {
  const [cbrc, setCbrc] = useState('');
  const [op20, setOp20] = useState('');

  const handleCbrcChange = (value: string) => {
    const raw = parseInputNumber(value);
    setCbrc(raw);
    if (raw === '' || isNaN(parseFloat(raw))) {
      setOp20('');
    } else {
      setOp20(cbrcToOp20(parseFloat(raw)).toFixed(2));
    }
  };

  const handleOp20Change = (value: string) => {
    const raw = parseInputNumber(value);
    setOp20(raw);
    if (raw === '' || isNaN(parseFloat(raw))) {
      setCbrc('');
    } else {
      setCbrc(op20ToCbrc(parseFloat(raw)).toFixed(4));
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '4px 0',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    outline: 'none'
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>CONVERTER</span>
        <span style={{ fontSize: '0.55rem', color: '#555' }}>1 CBRC20 = 37.489 OP20</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '80px' }}>
          <label style={{ fontSize: '0.55rem', color: '#f7931a' }}>CBRC20</label>
          <input
            type="text"
            value={formatInputNumber(cbrc)}
            onChange={(e) => handleCbrcChange(e.target.value)}
            placeholder="0"
            style={inputStyle}
          />
        </div>
        <span style={{ color: '#666', fontSize: '0.8rem' }}>⇄</span>
        <div style={{ width: '80px' }}>
          <label style={{ fontSize: '0.55rem', color: '#4ade80' }}>OP20</label>
          <input
            type="text"
            value={formatInputNumber(op20)}
            onChange={(e) => handleOp20Change(e.target.value)}
            placeholder="0"
            style={inputStyle}
          />
        </div>
      </div>
      <div style={{ fontSize: '0.55rem', color: '#555', textAlign: 'right' }}>
        <div>CBRC20: 21M</div>
        <div>OP20: 1B (max)</div>
      </div>
    </div>
  );
}
