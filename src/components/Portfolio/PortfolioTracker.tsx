import { useState, useEffect } from 'react';
import { MOTO_CONSTANTS, formatUSD, formatNumber, formatPercent, cbrcToOp20, op20ToCbrc, calculatePrice } from '../../utils';

export default function PortfolioTracker() {
  // Converter state
  const [cbrc, setCbrc] = useState('');
  const [op20, setOp20] = useState('');
  const [lastEdited, setLastEdited] = useState<'cbrc' | 'op20' | null>(null);

  // Holdings state
  const [holdingsCbrc, setHoldingsCbrc] = useState('');
  const [holdingsOp20, setHoldingsOp20] = useState('');
  const [holdingsMotocats, setHoldingsMotocats] = useState('');
  const [holdingsPills, setHoldingsPills] = useState('');
  const [motocatFloorSats, setMotocatFloorSats] = useState('344000'); // Floor in sats (0.00344 BTC)

  // Portfolio state
  const [invested, setInvested] = useState('');
  const [priceSats, setPriceSats] = useState('1000'); // Price in sats for CBRC-20
  const [selectedSupply, setSelectedSupply] = useState<'LOW' | 'MID' | 'HIGH'>('HIGH');
  const [btcPrice, setBtcPrice] = useState<number>(100000); // BTC price in USD

  // Fetch BTC price
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await res.json();
        setBtcPrice(data.bitcoin.usd);
      } catch (err) {
        console.error('Failed to fetch BTC price:', err);
      }
    };
    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Motocat floor price from Magic Eden
  useEffect(() => {
    const fetchMotocatFloor = async () => {
      try {
        const res = await fetch('https://api-mainnet.magiceden.dev/v2/ord/btc/stat?collectionSymbol=motocats');
        const data = await res.json();
        if (data.floorPrice) {
          // Magic Eden returns floor in BTC, convert to sats
          const floorSats = Math.round(data.floorPrice * 100_000_000);
          setMotocatFloorSats(floorSats.toString());
        }
      } catch (err) {
        console.error('Failed to fetch Motocat floor:', err);
      }
    };
    fetchMotocatFloor();
    const interval = setInterval(fetchMotocatFloor, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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

  const getInvested = () => parseFloat(invested) || 0;
  const getSats = () => parseFloat(priceSats) || 0;
  const getHoldingsCbrc = () => parseFloat(holdingsCbrc) || 0;
  const getHoldingsOp20 = () => parseFloat(holdingsOp20) || 0;
  const getHoldingsMotocats = () => parseFloat(holdingsMotocats) || 0;
  const getMotocatFloorSats = () => parseFloat(motocatFloorSats) || 0;

  // Convert sats to USD prices
  const satToUsd = (sats: number) => (sats / 100_000_000) * btcPrice;
  const cbrcPriceUsd = satToUsd(getSats());
  const op20PriceUsd = cbrcPriceUsd / MOTO_CONSTANTS.CBRC_TO_OP20_RATIO;
  const motocatFloorUsd = satToUsd(getMotocatFloorSats());

  // Calculate total holdings value
  const cbrcValueUsd = getHoldingsCbrc() * cbrcPriceUsd;
  const op20ValueUsd = getHoldingsOp20() * op20PriceUsd;
  const motocatsValueUsd = getHoldingsMotocats() * motocatFloorUsd;
  const totalMotoValueUsd = cbrcValueUsd + op20ValueUsd;
  const totalPortfolioValueUsd = totalMotoValueUsd + motocatsValueUsd;

  // Total OP20 equivalent for scenarios
  const totalOp20Equivalent = getHoldingsOp20() + cbrcToOp20(getHoldingsCbrc());

  const pnlDollar = totalPortfolioValueUsd - getInvested();
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

      {/* My Holdings */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(74, 222, 128, 0.2)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          color: '#4ade80',
          marginBottom: '20px',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          MY HOLDINGS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {/* CBRC-20 Holdings */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#f7931a', fontWeight: 600 }}>
              CBRC-20 MOTO
            </label>
            <input
              type="number"
              value={holdingsCbrc}
              onChange={(e) => {
                setHoldingsCbrc(e.target.value);
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setHoldingsOp20(cbrcToOp20(val).toFixed(2));
                } else {
                  setHoldingsOp20('');
                }
              }}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.3rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(247, 147, 26, 0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
              Value: <span style={{ color: '#f7931a' }}>{formatUSD(cbrcValueUsd)}</span>
            </p>
          </div>

          {/* OP20 Holdings */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
              OP20 MOTO
            </label>
            <input
              type="number"
              value={holdingsOp20}
              onChange={(e) => setHoldingsOp20(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.3rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(74, 222, 128, 0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
              Value: <span style={{ color: '#4ade80' }}>{formatUSD(op20ValueUsd)}</span>
            </p>
          </div>

          {/* Motocats Holdings */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
              MOTOCATS
            </label>
            <input
              type="number"
              value={holdingsMotocats}
              onChange={(e) => setHoldingsMotocats(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.3rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(167, 139, 250, 0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
              Value: <span style={{ color: '#a78bfa' }}>{formatUSD(motocatsValueUsd)}</span>
            </p>
          </div>

          {/* Motocat Floor Price */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
              MOTOCAT FLOOR (SATS)
            </label>
            <input
              type="number"
              value={motocatFloorSats}
              onChange={(e) => setMotocatFloorSats(e.target.value)}
              placeholder="344000"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.3rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(167, 139, 250, 0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
              = <span style={{ color: '#a78bfa' }}>{(getMotocatFloorSats() / 100_000_000).toFixed(4)} BTC</span>
              {' '}/ <span style={{ color: '#a78bfa' }}>{formatUSD(motocatFloorUsd)}</span>
            </p>
          </div>

          {/* Pills Holdings */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#f472b6', fontWeight: 600 }}>
              PILLS 💊
            </label>
            <input
              type="number"
              value={holdingsPills}
              onChange={(e) => setHoldingsPills(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.3rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(244, 114, 182, 0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
              Value: <span style={{ color: '#f472b6', fontStyle: 'italic' }}>soon™</span>
            </p>
          </div>
        </div>

        {/* Total Holdings Value */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>MOTO Total: </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{formatUSD(totalMotoValueUsd)}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Motocats Total: </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa' }}>{formatUSD(motocatsValueUsd)}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>PORTFOLIO TOTAAL: </span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>{formatUSD(totalPortfolioValueUsd)}</span>
          </div>
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

        {/* Current Price Input (Sats) */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(247, 147, 26, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <label style={{ fontSize: '0.75rem', color: '#f7931a', fontWeight: 600 }}>
            CBRC-20 PRICE (SATS)
          </label>
          <input
            type="number"
            value={priceSats}
            onChange={(e) => setPriceSats(e.target.value)}
            placeholder="1000"
            style={{
              width: '100%',
              padding: '12px 0',
              fontSize: '1.5rem',
              fontFamily: 'inherit',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid rgba(247, 147, 26, 0.3)',
              color: '#fff',
              outline: 'none'
            }}
          />
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#888' }}>
            <div>CBRC-20: <span style={{ color: '#f7931a' }}>${cbrcPriceUsd.toFixed(2)}</span></div>
            <div>OP20: <span style={{ color: '#4ade80' }}>${op20PriceUsd.toFixed(4)}</span></div>
          </div>
        </div>

        {/* Current Value */}
        <div style={{
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <label style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
            PORTFOLIO VALUE
          </label>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginTop: '8px' }}>
            {formatUSD(totalPortfolioValueUsd)}
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
            {key === 'HIGH' && <span style={{ marginLeft: '4px', opacity: 0.7 }}>(max)</span>}
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

          {/* Current Value Row */}
          {(() => {
            const currentMcap = op20PriceUsd * circulatingSupply;
            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr',
                  padding: '14px 20px',
                  alignItems: 'center',
                  background: 'rgba(74, 222, 128, 0.15)',
                  borderBottom: '2px solid rgba(74, 222, 128, 0.3)'
                }}
              >
                <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '1rem' }}>
                  {formatUSD(currentMcap)}
                </div>
                <div style={{ color: '#4ade80', fontSize: '0.85rem' }}>
                  Current
                </div>
                <div style={{ color: '#4ade80', fontWeight: 500 }}>
                  ${op20PriceUsd.toFixed(op20PriceUsd < 1 ? 4 : 2)}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: '#4ade80' }}>
                  {totalPortfolioValueUsd > 0 ? formatUSD(totalPortfolioValueUsd) : '—'}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 600, color: pnlPercent >= 0 ? '#4ade80' : '#ef4444' }}>
                  {getInvested() > 0 && totalPortfolioValueUsd > 0 ? formatPercent(pnlPercent) : '—'}
                </div>
              </div>
            );
          })()}

          {/* Scenario Rows */}
          {MOTO_CONSTANTS.SCENARIOS.map((scenario, idx) => {
            const price = calculatePrice(scenario.mcap, circulatingSupply);
            const motoValue = totalOp20Equivalent * price;
            const totalValue = motoValue + motocatsValueUsd; // Include Motocats at current value
            const scenarioPnl = getInvested() > 0 ? ((totalValue - getInvested()) / getInvested()) * 100 : 0;
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
                  color: totalValue > 0 ? '#fff' : '#444'
                }}>
                  {totalValue > 0 ? formatUSD(totalValue) : '—'}
                </div>
                <div style={{
                  textAlign: 'right',
                  fontWeight: 600,
                  color: scenarioPnl > 0 ? '#4ade80' : '#666'
                }}>
                  {getInvested() > 0 && totalValue > 0 ? formatPercent(scenarioPnl) : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
