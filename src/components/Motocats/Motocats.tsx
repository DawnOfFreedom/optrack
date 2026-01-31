import { useState } from 'react';
import { formatUSD, formatNumber, formatInputNumber, parseInputNumber, formatPercent } from '../../utils';

interface MotocatsState {
  owned: string;
  setOwned: (value: string) => void;
  floorSats: string;
  setFloorSats: (value: string) => void;
  invested: string;
  setInvested: (value: string) => void;
  btcPrice: number;
}

interface Props {
  motocatsState: MotocatsState;
}

export default function Motocats({ motocatsState }: Props) {
  // Use shared state from props
  const catsOwned = motocatsState.owned;
  const setCatsOwned = motocatsState.setOwned;
  const floorPriceSats = motocatsState.floorSats;
  const setFloorPriceSats = motocatsState.setFloorSats;
  const invested = motocatsState.invested;
  const setInvested = motocatsState.setInvested;
  const btcPrice = motocatsState.btcPrice;

  // Airdrop settings
  const [drivenMiles, setDrivenMiles] = useState('');
  const [airdropPool, setAirdropPool] = useState('50000000');
  const [totalMotocats, setTotalMotocats] = useState('550');
  const [motoPrice, setMotoPrice] = useState('0.02');

  // Getters
  const getCatsOwned = () => parseFloat(catsOwned) || 0;
  const getFloorSats = () => parseFloat(floorPriceSats) || 0;
  const getInvested = () => parseFloat(invested) || 0;
  const getDrivenMiles = () => parseFloat(drivenMiles) || 0;
  const getAirdropPool = () => parseFloat(airdropPool) || 0;
  const getTotalCats = () => parseFloat(totalMotocats) || 1;
  const getMotoPrice = () => parseFloat(motoPrice) || 0;

  // Calculations
  const floorBtc = getFloorSats() / 100_000_000;
  const floorUsd = floorBtc * btcPrice;
  const totalValue = getCatsOwned() * floorUsd;
  const pnl = totalValue - getInvested();
  const pnlPercent = getInvested() > 0 ? (pnl / getInvested()) * 100 : 0;

  // Airdrop calculations
  const airdropPerCat = getAirdropPool() / getTotalCats();
  const yourAirdrop = getCatsOwned() * airdropPerCat;
  const airdropValue = yourAirdrop * getMotoPrice();

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Motocats Holdings Card - Same style as Portfolio Tracker */}
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
          <span style={{ fontSize: '0.7rem', color: '#666' }}>Supply: 10.000</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#a78bfa' }}>AMOUNT</label>
            <input
              type="text"
              value={formatInputNumber(catsOwned)}
              onChange={(e) => setCatsOwned(parseInputNumber(e.target.value))}
              placeholder="0"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>FLOOR (SATS) by Magic Eden</label>
            <input
              type="text"
              value={formatInputNumber(floorPriceSats)}
              onChange={(e) => setFloorPriceSats(parseInputNumber(e.target.value))}
              placeholder="344.000"
              style={inputStyle}
            />
            <p style={{ fontSize: '0.65rem', color: '#555', margin: '4px 0 0' }}>
              = {floorBtc.toFixed(4)} BTC / {formatUSD(floorUsd)}
            </p>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>$ INVESTED</label>
            <input
              type="text"
              value={formatInputNumber(invested)}
              onChange={(e) => setInvested(parseInputNumber(e.target.value))}
              placeholder="0"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>
            Value: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{formatUSD(totalValue)}</span>
          </span>
          <span style={{ fontSize: '0.8rem', color: pnl >= 0 ? '#4ade80' : '#ef4444' }}>
            PNL: {formatUSD(pnl)} ({formatPercent(pnlPercent)})
          </span>
        </div>
      </div>

      {/* Airdrop Calculator */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(247, 147, 26, 0.3)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '1.5rem' }}>🎁</span>
          <div>
            <h3 style={{ margin: 0, color: '#f7931a', fontSize: '1rem', fontWeight: 700 }}>AIRDROP CALCULATOR</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>Speculative - not confirmed</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#f7931a' }}>DRIVEN MILES</label>
            <input
              type="text"
              value={formatInputNumber(drivenMiles)}
              onChange={(e) => setDrivenMiles(parseInputNumber(e.target.value))}
              placeholder="0"
              style={inputStyle}
            />
            <p style={{ fontSize: '0.6rem', color: '#555', margin: '4px 0 0' }}>
              <a href="https://garage.motoswap.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#f7931a', textDecoration: 'none' }}>
                Check garage.motoswap.org
              </a>
            </p>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>AIRDROP POOL (OP20)</label>
            <input
              type="text"
              value={formatInputNumber(airdropPool)}
              onChange={(e) => setAirdropPool(parseInputNumber(e.target.value))}
              placeholder="50.000.000"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>ELIGIBLE CATS</label>
            <input
              type="text"
              value={formatInputNumber(totalMotocats)}
              onChange={(e) => setTotalMotocats(parseInputNumber(e.target.value))}
              placeholder="550"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>$MOTO PRICE</label>
            <input
              type="text"
              value={motoPrice}
              onChange={(e) => setMotoPrice(e.target.value)}
              placeholder="0.02"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Airdrop Results */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: '4px' }}>AIRDROP PER CAT</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {formatNumber(Math.round(airdropPerCat))} $MOTO
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(247, 147, 26, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(247, 147, 26, 0.2)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#f7931a', marginBottom: '4px' }}>
              YOUR AIRDROP {getCatsOwned() > 0 && <span style={{ color: '#888' }}>({getCatsOwned()} cats)</span>}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f7931a' }}>
              {formatNumber(Math.round(yourAirdrop))} $MOTO
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(74, 222, 128, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(74, 222, 128, 0.2)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#4ade80', marginBottom: '4px' }}>AIRDROP VALUE</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#4ade80' }}>
              {formatUSD(airdropValue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
