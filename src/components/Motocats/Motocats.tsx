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
  const AIRDROP_PER_CAT = 5000; // Fixed: 5000 OP20 MOTO per cat
  const MOTO_SUPPLY = 1_000_000_000; // 1B OP20
  const AIRDROP_PERCENTAGE = 1.9; // 1.9% distributed to race participants
  const RACE_AIRDROP_POOL = MOTO_SUPPLY * (AIRDROP_PERCENTAGE / 100); // 19,000,000 MOTO

  const [yourMiles, setYourMiles] = useState('');
  const [totalMiles, setTotalMiles] = useState('');
  const [motoPrice, setMotoPrice] = useState('0.02');

  // Getters
  const getCatsOwned = () => parseFloat(catsOwned) || 0;
  const getFloorSats = () => parseFloat(floorPriceSats) || 0;
  const getInvested = () => parseFloat(invested) || 0;
  const getYourMiles = () => parseFloat(yourMiles) || 0;
  const getTotalMiles = () => parseFloat(totalMiles) || 0;
  const getMotoPrice = () => parseFloat(motoPrice) || 0;

  // Calculations
  const floorBtc = getFloorSats() / 100_000_000;
  const floorUsd = floorBtc * btcPrice;
  const totalValue = getCatsOwned() * floorUsd;
  const pnl = totalValue - getInvested();
  const pnlPercent = getInvested() > 0 ? (pnl / getInvested()) * 100 : 0;

  // Airdrop calculations
  const fixedAirdrop = getCatsOwned() * AIRDROP_PER_CAT; // 5000 per cat
  const yourSharePercent = getTotalMiles() > 0 ? (getYourMiles() / getTotalMiles()) * 100 : 0;
  const raceAirdrop = getTotalMiles() > 0 ? (getYourMiles() / getTotalMiles()) * RACE_AIRDROP_POOL : 0;
  const totalAirdrop = fixedAirdrop + raceAirdrop;
  const totalAirdropValue = totalAirdrop * getMotoPrice();

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
      <style>{`
        @media (max-width: 768px) {
          .motocats-grid {
            grid-template-columns: 1fr !important;
          }
          .airdrop-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .airdrop-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

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

        <div className="motocats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
          <img src="/airdrop.svg" alt="Airdrop" style={{ width: '32px', height: '32px' }} />
          <div>
            <h3 style={{ margin: 0, color: '#f7931a', fontSize: '1rem', fontWeight: 700 }}>AIRDROP CALCULATOR</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>5.000 $MOTO (OP20) per cat + 1.9% race distribution</p>
          </div>
        </div>

        {/* Fixed Airdrop per Cat */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(74, 222, 128, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>FIXED AIRDROP</span>
            <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '8px' }}>
              ({getCatsOwned()} cats × 5.000)
            </span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80' }}>
            {formatNumber(fixedAirdrop)} $MOTO <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#888' }}>(OP20)</span>
          </span>
        </div>

        {/* Race Airdrop */}
        <p style={{ fontSize: '0.75rem', color: '#f7931a', marginBottom: '8px', fontWeight: 600 }}>
          + RACE AIRDROP (1.9% of supply)
        </p>
        <p style={{ fontSize: '0.65rem', color: '#888', marginBottom: '12px' }}>
          Connect wallet on{' '}
          <a href="https://garage.motoswap.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#f7931a', textDecoration: 'none' }}>
            garage.motoswap.org
          </a>
          {' '}to see your miles and total miles
        </p>

        <div className="motocats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#f7931a' }}>YOUR MILES</label>
            <input
              type="text"
              value={formatInputNumber(yourMiles)}
              onChange={(e) => setYourMiles(parseInputNumber(e.target.value))}
              placeholder="0"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>TOTAL MILES (ALL RACERS)</label>
            <input
              type="text"
              value={formatInputNumber(totalMiles)}
              onChange={(e) => setTotalMiles(parseInputNumber(e.target.value))}
              placeholder="0"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888' }}>$MOTO PRICE (OP20)</label>
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
        <div className="airdrop-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: '4px' }}>RACE POOL (1.9%)</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {formatNumber(RACE_AIRDROP_POOL)} $MOTO
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: '4px' }}>YOUR SHARE</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {yourSharePercent.toFixed(4)}%
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(247, 147, 26, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(247, 147, 26, 0.2)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#f7931a', marginBottom: '4px' }}>RACE AIRDROP</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f7931a' }}>
              {formatNumber(Math.round(raceAirdrop))} $MOTO <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#888' }}>(OP20)</span>
            </div>
          </div>

          <div style={{
            padding: '12px',
            background: 'rgba(74, 222, 128, 0.15)',
            borderRadius: '8px',
            border: '1px solid rgba(74, 222, 128, 0.3)'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#4ade80', marginBottom: '4px' }}>TOTAL AIRDROP VALUE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80' }}>
              {formatUSD(totalAirdropValue)}
            </div>
            <div style={{ fontSize: '0.6rem', color: '#888', marginTop: '2px' }}>
              {formatNumber(Math.round(totalAirdrop))} $MOTO (OP20)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
