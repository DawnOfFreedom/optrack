import { useState } from 'react';
import { formatUSD, formatNumber, formatPercent } from '../../utils';

export default function YieldCalculator() {
  // Yield inputs
  const [dailyVolume, setDailyVolume] = useState('100000000'); // $100M default
  const [feePercent, setFeePercent] = useState('0.2');
  const [totalStaked, setTotalStaked] = useState('8500000');
  const [yourStaked, setYourStaked] = useState('');
  const [motoPrice, setMotoPrice] = useState('0.33');

  // Compound settings
  const [compoundFreq, setCompoundFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [timePeriod, setTimePeriod] = useState('12'); // months

  const getDailyVolume = () => parseFloat(dailyVolume) || 0;
  const getFeePercent = () => parseFloat(feePercent) || 0;
  const getTotalStaked = () => parseFloat(totalStaked) || 1;
  const getYourStaked = () => parseFloat(yourStaked) || 0;
  const getMotoPrice = () => parseFloat(motoPrice) || 0;
  const getTimePeriod = () => parseFloat(timePeriod) || 12;

  // Calculations
  const dailyFees = getDailyVolume() * (getFeePercent() / 100);
  const feePerMoto = dailyFees / getTotalStaked();
  const yourDailyMoto = getYourStaked() * feePerMoto / getMotoPrice(); // in MOTO
  const yourDailyUSD = getYourStaked() * feePerMoto;

  const weeklyUSD = yourDailyUSD * 7;
  const monthlyUSD = yourDailyUSD * 30;
  const yearlyUSD = yourDailyUSD * 365;
  const simpleAPY = getYourStaked() > 0 ? (yearlyUSD / (getYourStaked() * getMotoPrice())) * 100 : 0;

  // Compound interest calculation
  const principal = getYourStaked() * getMotoPrice();
  const rate = simpleAPY / 100;
  const compoundsPerYear = compoundFreq === 'daily' ? 365 : compoundFreq === 'weekly' ? 52 : 12;
  const years = getTimePeriod() / 12;
  const compoundValue = principal * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear * years);
  const compoundGain = compoundValue - principal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Yield Inputs */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(74, 222, 128, 0.2)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          color: '#4ade80',
          marginBottom: '24px',
          fontWeight: 600,
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚙️ MOTOSWAP STAKING PARAMETERS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {/* Daily Volume */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              DAILY MOTOSWAP VOLUME ($)
            </label>
            <input
              type="number"
              value={dailyVolume}
              onChange={(e) => setDailyVolume(e.target.value)}
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

          {/* Fee Percent */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              SWAP FEE REWARD (%)
            </label>
            <input
              type="number"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
              placeholder="0.2"
              step="0.1"
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

          {/* Total Staked */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              TOTAL STAKED MOTO
            </label>
            <input
              type="number"
              value={totalStaked}
              onChange={(e) => setTotalStaked(e.target.value)}
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

          {/* Your Staked */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 600 }}>
              YOUR STAKED MOTO
            </label>
            <input
              type="number"
              value={yourStaked}
              onChange={(e) => setYourStaked(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #4ade80',
                color: '#4ade80',
                outline: 'none'
              }}
            />
          </div>

          {/* Fee per MOTO */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              FEE PER MOTO (24H)
            </label>
            <div style={{
              padding: '12px 0',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#f7931a'
            }}>
              ${feePerMoto.toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      {/* Yield Projections */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          color: '#fff',
          marginBottom: '24px',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          📈 YIELD PROJECTIONS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'DAILY', value: yourDailyUSD, moto: yourDailyMoto },
            { label: 'WEEKLY', value: weeklyUSD, moto: yourDailyMoto * 7 },
            { label: 'MONTHLY', value: monthlyUSD, moto: yourDailyMoto * 30 },
            { label: 'YEARLY', value: yearlyUSD, moto: yourDailyMoto * 365 },
          ].map(item => (
            <div
              key={item.label}
              style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '8px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>
                {formatUSD(item.value)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                ~{formatNumber(Math.round(item.moto))} MOTO
              </div>
            </div>
          ))}
        </div>

        {/* APY Display */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.05))',
          borderRadius: '12px',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: '8px' }}>
            ESTIMATED APY (SIMPLE)
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ade80' }}>
            {simpleAPY.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Compound Calculator */}
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
          justifyContent: 'space-between'
        }}>
          <span>🔄 COMPOUND CALCULATOR</span>
          <a
            href="https://www.thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.7rem',
              color: '#888',
              textDecoration: 'none'
            }}
          >
            Advanced Calculator ↗
          </a>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Compound Frequency */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
              COMPOUND FREQUENCY
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                <button
                  key={freq}
                  onClick={() => setCompoundFreq(freq)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '0.75rem',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    background: compoundFreq === freq ? '#f7931a' : 'rgba(255,255,255,0.05)',
                    color: compoundFreq === freq ? '#000' : '#888',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Time Period */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              TIME PERIOD (MONTHS)
            </label>
            <input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="12"
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

          {/* Principal */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              PRINCIPAL (USD)
            </label>
            <div style={{
              padding: '12px 0',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#fff'
            }}>
              {formatUSD(principal)}
            </div>
          </div>
        </div>

        {/* Compound Results */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '8px' }}>
              STARTING VALUE
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>
              {formatUSD(principal)}
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'rgba(74, 222, 128, 0.1)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#4ade80', marginBottom: '8px' }}>
              COMPOUND GAIN
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>
              +{formatUSD(compoundGain)}
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.15), rgba(247, 147, 26, 0.05))',
            borderRadius: '10px',
            border: '1px solid rgba(247, 147, 26, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#f7931a', marginBottom: '8px' }}>
              FINAL VALUE ({getTimePeriod()}M)
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f7931a' }}>
              {formatUSD(compoundValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p style={{
        textAlign: 'center',
        fontSize: '0.7rem',
        color: '#444',
        padding: '0 20px'
      }}>
        ⚠️ Yield calculations are estimates based on current parameters. Actual yields depend on volume, 
        staking pool size, and MOTO price fluctuations. DYOR.
      </p>
    </div>
  );
}
