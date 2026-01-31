import { useState, useEffect } from 'react';
import { MOTO_CONSTANTS, formatUSD, formatNumber, formatPercent, cbrcToOp20, op20ToCbrc, calculatePrice } from '../../utils';

export default function PortfolioTracker() {
  // Converter state
  const [cbrc, setCbrc] = useState('');
  const [op20, setOp20] = useState('');
  const [lastEdited, setLastEdited] = useState<'cbrc' | 'op20' | null>(null);

  // Portfolio state
  const [invested, setInvested] = useState('');
  const [currentPrice, setCurrentPrice] = useState('0.33'); // Current OTC estimate
  const [selectedSupply, setSelectedSupply] = useState<'LOW' | 'MID' | 'HIGH'>('MID');

  const handleCbrcChange = (value: string) => {
    setCbrc(value);
    setLastEdited('cbrc');
    if (value === '' || isNaN(parseFloat(value))) {
      setOp20('');
    } else {
      setOp20(cbrcToOp20(parseFloat(value)).toFixed(2));
    }
  };

  const handleOp20Change = (value: string) => {
    setOp20(value);
    setLastEdited('op20');
    if (value === '' || isNaN(parseFloat(value))) {
      setCbrc('');
    } else {
      setCbrc(op20ToCbrc(parseFloat(value)).toFixed(4));
    }
  };

  const getOp20Amount = () => parseFloat(op20) || 0;
  const getInvested = () => parseFloat(invested) || 0;
  const getCurrentPrice = () => parseFloat(currentPrice) || 0;

  const currentValue = getOp20Amount() * getCurrentPrice();
  const pnlDollar = currentValue - getInvested();
  const pnlPercent = getInvested() > 0 ? (pnlDollar / getInvested()) * 100 : 0;

  const circulatingSupply = MOTO_CONSTANTS.CIRCULATING_SUPPLY[selectedSupply];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* MOTO Converter */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(247, 147, 26, 0.2)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{ 
          fontSize: '0.9rem', 
          color: '#888', 
          marginBottom: '20px',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          MOTO CONVERTER
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* CBRC-20 Input */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              color: '#f7931a',
              marginBottom: '8px',
              fontWeight: 600
            }}>
              CBRC-20 MOTO
            </label>
            <input
              type="number"
              value={cbrc}
              onChange={(e) => handleCbrcChange(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'rgba(0,0,0,0.4)',
                border: lastEdited === 'cbrc' ? '2px solid #f7931a' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '6px' }}>
              Supply: 21,000,000
            </p>
          </div>

          <div style={{ fontSize: '1.5rem', color: '#f7931a' }}>⇄</div>

          {/* OP20 Input */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              color: '#4ade80',
              marginBottom: '8px',
              fontWeight: 600
            }}>
              OP20 MOTO
            </label>
            <input
              type="number"
              value={op20}
              onChange={(e) => handleOp20Change(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'rgba(0,0,0,0.4)',
                border: lastEdited === 'op20' ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '6px' }}>
              Supply: 1,000,000,000
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          padding: '10px',
          background: 'rgba(247, 147, 26, 0.1)',
          borderRadius: '8px',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: '#888' }}>Ratio: </span>
          <span style={{ color: '#f7931a', fontWeight: 600 }}>1 CBRC-20 = 47.619 OP20</span>
        </div>
      </div>

      {/* Current Value & Investment */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {/* Investment Input */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>
            $ INVESTED
          </label>
          <input
            type="number"
            value={invested}
            onChange={(e) => setInvested(e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '12px 0',
              fontSize: '1.5rem',
              fontFamily: 'inherit',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid rgba(255,255,255,0.1)',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>

        {/* Current Price Input */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>
            CURRENT PRICE ($/MOTO)
          </label>
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '12px 0',
              fontSize: '1.5rem',
              fontFamily: 'inherit',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid rgba(255,255,255,0.1)',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>

        {/* Current Value */}
        <div style={{
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <label style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
            CURRENT VALUE
          </label>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginTop: '8px' }}>
            {formatUSD(currentValue)}
          </div>
        </div>

        {/* PNL */}
        <div style={{
          background: pnlDollar >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${pnlDollar >= 0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          borderRadius: '16px',
          padding: '24px'
        }}>
          <label style={{ 
            fontSize: '0.75rem', 
            color: pnlDollar >= 0 ? '#4ade80' : '#ef4444', 
            fontWeight: 600 
          }}>
            PNL
          </label>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: pnlDollar >= 0 ? '#4ade80' : '#ef4444',
            marginTop: '8px'
          }}>
            {formatUSD(pnlDollar)} ({formatPercent(pnlPercent)})
          </div>
        </div>
      </div>

      {/* Supply Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>Circulating Supply:</span>
        {(['LOW', 'MID', 'HIGH'] as const).map(key => (
          <button
            key={key}
            onClick={() => setSelectedSupply(key)}
            style={{
              padding: '8px 16px',
              fontSize: '0.75rem',
              fontFamily: 'inherit',
              fontWeight: 600,
              background: selectedSupply === key ? '#f7931a' : 'rgba(255,255,255,0.05)',
              color: selectedSupply === key ? '#000' : '#888',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {formatNumber(MOTO_CONSTANTS.CIRCULATING_SUPPLY[key])}
          </button>
        ))}
      </div>

      {/* Scenarios Table */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', margin: 0 }}>
            💎 INVESTMENT POTENTIAL (DIAMOND HANDS)
          </h2>
        </div>

        <div style={{ padding: '10px' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr',
            padding: '12px 20px',
            fontSize: '0.7rem',
            color: '#666',
            fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div>MCAP</div>
            <div>TYPE</div>
            <div>PRICE</div>
            <div style={{ textAlign: 'right' }}>VALUE</div>
            <div style={{ textAlign: 'right' }}>PNL</div>
          </div>

          {/* Rows */}
          {MOTO_CONSTANTS.SCENARIOS.map((scenario, idx) => {
            const price = calculatePrice(scenario.mcap, circulatingSupply);
            const value = getOp20Amount() * price;
            const scenarioPnl = getInvested() > 0 ? ((value - getInvested()) / getInvested()) * 100 : 0;
            const isHighlight = scenario.mcap === 1_000_000_000;

            return (
              <div
                key={scenario.mcap}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr',
                  padding: '14px 20px',
                  alignItems: 'center',
                  background: isHighlight ? 'rgba(247, 147, 26, 0.1)' : 'transparent',
                  borderBottom: idx < MOTO_CONSTANTS.SCENARIOS.length - 1 
                    ? '1px solid rgba(255,255,255,0.05)' 
                    : 'none'
                }}
              >
                <div style={{
                  fontWeight: 700,
                  color: isHighlight ? '#f7931a' : '#fff',
                  fontSize: '1rem'
                }}>
                  {scenario.label}
                </div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                  {scenario.type}
                </div>
                <div style={{ color: '#4ade80', fontWeight: 500 }}>
                  ${price.toFixed(price < 1 ? 3 : 2)}
                </div>
                <div style={{
                  textAlign: 'right',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: value > 0 ? '#fff' : '#444'
                }}>
                  {value > 0 ? formatUSD(value) : '—'}
                </div>
                <div style={{
                  textAlign: 'right',
                  fontWeight: 600,
                  color: scenarioPnl > 0 ? '#4ade80' : '#666'
                }}>
                  {getInvested() > 0 && value > 0 ? formatPercent(scenarioPnl) : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
