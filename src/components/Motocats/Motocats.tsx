import { useState } from 'react';
import { formatUSD, formatNumber } from '../../utils';

export default function Motocats() {
  // Holdings
  const [catsOwned, setCatsOwned] = useState('');
  const [floorPriceBTC, setFloorPriceBTC] = useState('0.015');
  const [btcPrice, setBtcPrice] = useState('100000');

  // Airdrop settings
  const [airdropPool, setAirdropPool] = useState('50000000'); // 50M OP20 MOTO
  const [totalMotocats, setTotalMotocats] = useState('550');
  const [motoPrice, setMotoPrice] = useState('0.33');

  const getCatsOwned = () => parseFloat(catsOwned) || 0;
  const getFloorBTC = () => parseFloat(floorPriceBTC) || 0;
  const getBtcPrice = () => parseFloat(btcPrice) || 0;
  const getAirdropPool = () => parseFloat(airdropPool) || 0;
  const getTotalCats = () => parseFloat(totalMotocats) || 1;
  const getMotoPrice = () => parseFloat(motoPrice) || 0;

  // Calculations
  const floorUSD = getFloorBTC() * getBtcPrice();
  const nftValue = getCatsOwned() * floorUSD;
  const airdropPerCat = getAirdropPool() / getTotalCats();
  const yourAirdrop = getCatsOwned() * airdropPerCat;
  const airdropValue = yourAirdrop * getMotoPrice();
  const totalValue = nftValue + airdropValue;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Motocats Holdings */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          color: '#a855f7',
          marginBottom: '24px',
          fontWeight: 600,
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🐱 MOTOCATS HOLDINGS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px'
        }}>
          {/* Cats Owned */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              MOTOCATS OWNED
            </label>
            <input
              type="number"
              value={catsOwned}
              onChange={(e) => setCatsOwned(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.4rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(168, 85, 247, 0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* Floor Price BTC */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              FLOOR PRICE (BTC)
            </label>
            <input
              type="number"
              value={floorPriceBTC}
              onChange={(e) => setFloorPriceBTC(e.target.value)}
              placeholder="0"
              step="0.001"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.4rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* BTC Price */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              BTC/USD PRICE
            </label>
            <input
              type="number"
              value={btcPrice}
              onChange={(e) => setBtcPrice(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.4rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* Floor USD */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              FLOOR PRICE (USD)
            </label>
            <div style={{
              padding: '12px 0',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#4ade80'
            }}>
              {formatUSD(floorUSD)}
            </div>
          </div>
        </div>

        {/* NFT Total Value */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#a855f7', fontWeight: 600 }}>NFT VALUE</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {formatUSD(nftValue)}
          </span>
        </div>
      </div>

      {/* Airdrop Calculator */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(247, 147, 26, 0.2)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          color: '#f7931a',
          marginBottom: '24px',
          fontWeight: 600,
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🎁 AIRDROP CALCULATOR
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {/* Airdrop Pool */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              TOTAL AIRDROP POOL (OP20)
            </label>
            <input
              type="number"
              value={airdropPool}
              onChange={(e) => setAirdropPool(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '4px' }}>
              Speculative - not confirmed
            </p>
          </div>

          {/* Total Motocats */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              TOTAL MOTOCATS SUPPLY
            </label>
            <input
              type="number"
              value={totalMotocats}
              onChange={(e) => setTotalMotocats(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* MOTO Price */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              MOTO PRICE ($)
            </label>
            <input
              type="number"
              value={motoPrice}
              onChange={(e) => setMotoPrice(e.target.value)}
              placeholder="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Airdrop Results */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px' }}>
              AIRDROP PER CAT
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
              {formatNumber(Math.round(airdropPerCat))} MOTO
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px' }}>
              YOUR AIRDROP
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f7931a' }}>
              {formatNumber(Math.round(yourAirdrop))} MOTO
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: 'rgba(74, 222, 128, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(74, 222, 128, 0.2)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#4ade80', marginBottom: '4px' }}>
              AIRDROP VALUE
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80' }}>
              {formatUSD(airdropValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Combined Total */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.15), rgba(168, 85, 247, 0.15))',
        border: '1px solid rgba(247, 147, 26, 0.3)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          color: '#fff',
          marginBottom: '20px',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          📊 TOTAL MOTOCATS POSITION
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#a855f7', marginBottom: '8px' }}>
              NFT VALUE
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              {formatUSD(nftValue)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#f7931a', marginBottom: '8px' }}>
              AIRDROP VALUE
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              {formatUSD(airdropValue)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#4ade80', marginBottom: '8px' }}>
              TOTAL VALUE
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ade80' }}>
              {formatUSD(totalValue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
