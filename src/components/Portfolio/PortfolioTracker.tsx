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

  // Price state
  const [priceSats, setPriceSats] = useState('1000');
  const [motocatFloorSats, setMotocatFloorSats] = useState('344000');

  // Invested per token
  const [investedMoto, setInvestedMoto] = useState('');
  const [investedMotocats, setInvestedMotocats] = useState('');
  const [investedPills, setInvestedPills] = useState('');

  const [selectedSupply, setSelectedSupply] = useState<'LOW' | 'MID' | 'HIGH'>('HIGH');
  const [btcPrice, setBtcPrice] = useState<number>(100000);

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
          const floorSats = Math.round(data.floorPrice * 100_000_000);
          setMotocatFloorSats(floorSats.toString());
        }
      } catch (err) {
        console.error('Failed to fetch Motocat floor:', err);
      }
    };
    fetchMotocatFloor();
    const interval = setInterval(fetchMotocatFloor, 60000);
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

  // Getters
  const getSats = () => parseFloat(priceSats) || 0;
  const getHoldingsCbrc = () => parseFloat(holdingsCbrc) || 0;
  const getHoldingsOp20 = () => parseFloat(holdingsOp20) || 0;
  const getHoldingsMotocats = () => parseFloat(holdingsMotocats) || 0;
  const getMotocatFloorSats = () => parseFloat(motocatFloorSats) || 0;
  const getInvestedMoto = () => parseFloat(investedMoto) || 0;
  const getInvestedMotocats = () => parseFloat(investedMotocats) || 0;
  const getInvestedPills = () => parseFloat(investedPills) || 0;
  const getTotalInvested = () => getInvestedMoto() + getInvestedMotocats() + getInvestedPills();

  // Convert sats to USD prices
  const satToUsd = (sats: number) => (sats / 100_000_000) * btcPrice;
  const cbrcPriceUsd = satToUsd(getSats());
  const op20PriceUsd = cbrcPriceUsd / MOTO_CONSTANTS.CBRC_TO_OP20_RATIO;
  const motocatFloorUsd = satToUsd(getMotocatFloorSats());

  // Calculate values
  const cbrcValueUsd = getHoldingsCbrc() * cbrcPriceUsd;
  const op20ValueUsd = getHoldingsOp20() * op20PriceUsd;
  const totalMotoValueUsd = cbrcValueUsd + op20ValueUsd;
  const motocatsValueUsd = getHoldingsMotocats() * motocatFloorUsd;
  const totalPortfolioValueUsd = totalMotoValueUsd + motocatsValueUsd;

  // PNL calculations
  const motoPnl = totalMotoValueUsd - getInvestedMoto();
  const motoPnlPercent = getInvestedMoto() > 0 ? (motoPnl / getInvestedMoto()) * 100 : 0;
  const motocatsPnl = motocatsValueUsd - getInvestedMotocats();
  const motocatsPnlPercent = getInvestedMotocats() > 0 ? (motocatsPnl / getInvestedMotocats()) * 100 : 0;
  const totalPnl = totalPortfolioValueUsd - getTotalInvested();
  const totalPnlPercent = getTotalInvested() > 0 ? (totalPnl / getTotalInvested()) * 100 : 0;

  // Total OP20 equivalent for scenarios
  const totalOp20Equivalent = getHoldingsOp20() + cbrcToOp20(getHoldingsCbrc());
  const circulatingSupply = MOTO_CONSTANTS.CIRCULATING_SUPPLY[selectedSupply];

  const inputStyle = {
    width: '100%',
    padding: '8px 0',
    fontSize: '1.1rem',
    fontFamily: 'inherit',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none'
  };

  const smallInputStyle = {
    ...inputStyle,
    fontSize: '0.9rem',
    width: '100px',
    textAlign: 'right' as const
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* My Holdings - Cards for each token */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* MOTO Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(247, 147, 26, 0.3)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="/motoswap.svg" alt="MOTO" style={{ width: '48px', height: '48px' }} />
              <div>
                <h3 style={{ margin: 0, color: '#f7931a', fontSize: '1.2rem', fontWeight: 700 }}>$MOTO</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>CBRC20 & OP20</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: '#666' }}>Supply:</span>
              {(['LOW', 'MID', 'HIGH'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedSupply(key)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.65rem',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    background: selectedSupply === key ? '#f7931a' : 'rgba(255,255,255,0.05)',
                    color: selectedSupply === key ? '#000' : '#888',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {formatNumber(MOTO_CONSTANTS.CIRCULATING_SUPPLY[key])}
                  {key === 'HIGH' && <span style={{ marginLeft: '2px', opacity: 0.7 }}>(max)</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#f7931a' }}>CBRC20</label>
                <input
                  type="number"
                  value={holdingsCbrc}
                  onChange={(e) => {
                    setHoldingsCbrc(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setHoldingsOp20(cbrcToOp20(val).toFixed(2));
                    else setHoldingsOp20('');
                  }}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#4ade80' }}>OP20</label>
                <input
                  type="number"
                  value={holdingsOp20}
                  onChange={(e) => setHoldingsOp20(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#f7931a' }}>CBRC20 PRICE (SATS)</label>
                <input
                  type="number"
                  value={priceSats}
                  onChange={(e) => setPriceSats(e.target.value)}
                  placeholder="1000"
                  style={inputStyle}
                />
                <p style={{ fontSize: '1rem', color: '#f7931a', margin: '4px 0 0', fontWeight: 600 }}>
                  {formatUSD(cbrcPriceUsd)}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#4ade80' }}>OP20 PRICE</label>
                <p style={{ fontSize: '1rem', color: '#4ade80', margin: '8px 0 0', fontWeight: 600 }}>
                  {formatUSD(op20PriceUsd)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: '#888' }}>$ INVESTED</label>
                <input
                  type="number"
                  value={investedMoto}
                  onChange={(e) => setInvestedMoto(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>
              Value: <span style={{ color: '#f7931a', fontWeight: 600 }}>{formatUSD(totalMotoValueUsd)}</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: motoPnl >= 0 ? '#4ade80' : '#ef4444' }}>
              PNL: {formatUSD(motoPnl)} ({formatPercent(motoPnlPercent)})
            </span>
          </div>
        </div>

        {/* Motocats Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="/motocat.png" alt="Motocats" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, color: '#a78bfa', fontSize: '1.2rem', fontWeight: 700 }}>MOTOCATS</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>NFT Collection</p>
              </div>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#666' }}>Supply: 10,000</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#a78bfa' }}>AMOUNT</label>
              <input
                type="number"
                value={holdingsMotocats}
                onChange={(e) => setHoldingsMotocats(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#888' }}>FLOOR (SATS)</label>
              <input
                type="number"
                value={motocatFloorSats}
                onChange={(e) => setMotocatFloorSats(e.target.value)}
                placeholder="344000"
                style={inputStyle}
              />
              <p style={{ fontSize: '0.65rem', color: '#555', margin: '4px 0 0' }}>
                = {(getMotocatFloorSats() / 100_000_000).toFixed(4)} BTC / {formatUSD(motocatFloorUsd)}
              </p>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#888' }}>$ INVESTED</label>
              <input
                type="number"
                value={investedMotocats}
                onChange={(e) => setInvestedMotocats(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>
              Value: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{formatUSD(motocatsValueUsd)}</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: motocatsPnl >= 0 ? '#4ade80' : '#ef4444' }}>
              PNL: {formatUSD(motocatsPnl)} ({formatPercent(motocatsPnlPercent)})
            </span>
          </div>
        </div>

        {/* Pills Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(244, 114, 182, 0.3)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="/Orangepill.png" alt="Pills" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, color: '#f472b6', fontSize: '1.2rem', fontWeight: 700 }}>$PILL</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>OrangePill Token</p>
              </div>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#666' }}>Supply: 1,000,000,000,000</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#f472b6' }}>AMOUNT</label>
              <input
                type="number"
                value={holdingsPills}
                onChange={(e) => setHoldingsPills(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#888' }}>PRICE</label>
              <p style={{ fontSize: '1.1rem', color: '#f472b6', fontStyle: 'italic', margin: '8px 0' }}>soon™</p>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#888' }}>$ INVESTED</label>
              <input
                type="number"
                value={investedPills}
                onChange={(e) => setInvestedPills(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>
              Value: <span style={{ color: '#f472b6', fontStyle: 'italic' }}>soon™</span>
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Total */}
      <div style={{
        background: 'rgba(74, 222, 128, 0.1)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>TOTAL INVESTED</p>
          <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{formatUSD(getTotalInvested())}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>PORTFOLIO VALUE</p>
          <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>{formatUSD(totalPortfolioValueUsd)}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>TOTAL PNL</p>
          <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: totalPnl >= 0 ? '#4ade80' : '#ef4444' }}>
            {formatUSD(totalPnl)} ({formatPercent(totalPnlPercent)})
          </p>
        </div>
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr',
                padding: '14px 20px',
                alignItems: 'center',
                background: 'rgba(74, 222, 128, 0.15)',
                borderBottom: '2px solid rgba(74, 222, 128, 0.3)'
              }}>
                <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '1rem' }}>{formatUSD(currentMcap)}</div>
                <div style={{ color: '#4ade80', fontSize: '0.85rem' }}>Current</div>
                <div style={{ color: '#4ade80', fontWeight: 500 }}>${op20PriceUsd.toFixed(op20PriceUsd < 1 ? 4 : 2)}</div>
                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: '#4ade80' }}>
                  {totalPortfolioValueUsd > 0 ? formatUSD(totalPortfolioValueUsd) : '—'}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 600, color: totalPnlPercent >= 0 ? '#4ade80' : '#ef4444' }}>
                  {getTotalInvested() > 0 && totalPortfolioValueUsd > 0 ? formatPercent(totalPnlPercent) : '—'}
                </div>
              </div>
            );
          })()}

          {/* Scenario Rows */}
          {MOTO_CONSTANTS.SCENARIOS.map((scenario, idx) => {
            const price = calculatePrice(scenario.mcap, circulatingSupply);
            const motoValue = totalOp20Equivalent * price;
            const totalValue = motoValue + motocatsValueUsd;
            const scenarioPnl = getTotalInvested() > 0 ? ((totalValue - getTotalInvested()) / getTotalInvested()) * 100 : 0;
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
                  borderBottom: idx < MOTO_CONSTANTS.SCENARIOS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}
              >
                <div style={{ fontWeight: 700, color: isHighlight ? '#f7931a' : '#fff', fontSize: '1rem' }}>{scenario.label}</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>{scenario.type}</div>
                <div style={{ color: '#4ade80', fontWeight: 500 }}>${price.toFixed(price < 1 ? 3 : 2)}</div>
                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: totalValue > 0 ? '#fff' : '#444' }}>
                  {totalValue > 0 ? formatUSD(totalValue) : '—'}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 600, color: scenarioPnl > 0 ? '#4ade80' : '#666' }}>
                  {getTotalInvested() > 0 && totalValue > 0 ? formatPercent(scenarioPnl) : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOTO Converter - Compact, right aligned */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '16px 20px',
          maxWidth: '400px'
        }}>
          <p style={{ fontSize: '0.7rem', color: '#666', margin: '0 0 12px', fontWeight: 600 }}>MOTO CONVERTER</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.65rem', color: '#f7931a' }}>CBRC20</label>
              <input
                type="number"
                value={cbrc}
                onChange={(e) => handleCbrcChange(e.target.value)}
                placeholder="0"
                style={{ ...inputStyle, fontSize: '0.95rem', padding: '6px 0' }}
              />
            </div>
            <span style={{ color: '#666', fontSize: '1rem' }}>⇄</span>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.65rem', color: '#4ade80' }}>OP20</label>
              <input
                type="number"
                value={op20}
                onChange={(e) => handleOp20Change(e.target.value)}
                placeholder="0"
                style={{ ...inputStyle, fontSize: '0.95rem', padding: '6px 0' }}
              />
            </div>
          </div>
          <p style={{ fontSize: '0.65rem', color: '#555', margin: '8px 0 0', textAlign: 'center' }}>
            1 CBRC20 = 47.619 OP20
          </p>
        </div>
      </div>
    </div>
  );
}
