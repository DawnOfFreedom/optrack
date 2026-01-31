import { useState } from 'react';
import { formatUSD, formatNumber, formatInputNumber, parseInputNumber } from '../../utils';

interface Props {
  motoHoldings: string;
}

// Volume scenarios based on real DEX data
const DEX_SCENARIOS = {
  uniswap: {
    name: 'Uniswap',
    description: 'Largest DEX',
    volumes: {
      bear: 300_000_000,      // $300M daily in bear
      neutral: 1_000_000_000, // $1B daily neutral
      bull: 3_000_000_000,    // $3B daily in bull
    }
  },
  pancakeswap: {
    name: 'PancakeSwap',
    description: '2nd largest DEX',
    volumes: {
      bear: 200_000_000,      // $200M daily in bear
      neutral: 800_000_000,   // $800M daily neutral
      bull: 2_200_000_000,    // $2.2B daily in bull
    }
  },
  sushiswap: {
    name: 'SushiSwap',
    description: 'Mid-size DEX',
    volumes: {
      bear: 10_000_000,       // $10M daily in bear
      neutral: 30_000_000,    // $30M daily neutral
      bull: 100_000_000,      // $100M daily in bull
    }
  }
};

const MARKET_CONDITIONS = {
  bear: { label: 'Bear', color: '#ef4444' },
  neutral: { label: 'Neutral', color: '#888' },
  bull: { label: 'Bull', color: '#4ade80' },
};

// Staking scenarios based on real network data (% of 1B supply)
const STAKING_SCENARIOS = {
  veryLow: {
    label: 'Very Low',
    description: 'Early stage',
    percentage: 10,
    amount: 100_000_000,  // 100M
    color: '#ef4444'
  },
  low: {
    label: 'Low',
    description: 'Like Ethereum (~28%)',
    percentage: 25,
    amount: 250_000_000,  // 250M
    color: '#f97316'
  },
  medium: {
    label: 'Medium',
    description: 'Like Polkadot (~50%)',
    percentage: 50,
    amount: 500_000_000,  // 500M
    color: '#888'
  },
  high: {
    label: 'High',
    description: 'Like Solana (~65%)',
    percentage: 65,
    amount: 650_000_000,  // 650M
    color: '#22c55e'
  },
  veryHigh: {
    label: 'Very High',
    description: 'Like Aptos (~80%)',
    percentage: 80,
    amount: 800_000_000,  // 800M
    color: '#4ade80'
  }
};

type DexType = keyof typeof DEX_SCENARIOS;
type MarketType = keyof typeof MARKET_CONDITIONS;
type StakingType = keyof typeof STAKING_SCENARIOS;

export default function YieldCalculator({ motoHoldings }: Props) {
  // Scenario selectors
  const [selectedDex, setSelectedDex] = useState<DexType>('sushiswap');
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('neutral');
  const [selectedStaking, setSelectedStaking] = useState<StakingType>('medium');

  // Yield inputs
  const [dailyVolume, setDailyVolume] = useState('30000000'); // Default to SushiSwap neutral
  const [feePercent, setFeePercent] = useState('0.2');
  const [totalStaked, setTotalStaked] = useState('500000000'); // Default to medium (50%)
  const [yourStaked, setYourStaked] = useState('');
  const [motoPrice, setMotoPrice] = useState('0.33');

  // Compound settings
  const [compoundFreq, setCompoundFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [timePeriod, setTimePeriod] = useState('12'); // months

  // Update volume when scenario changes
  const handleVolumeScenarioChange = (dex: DexType, market: MarketType) => {
    setSelectedDex(dex);
    setSelectedMarket(market);
    const volume = DEX_SCENARIOS[dex].volumes[market];
    setDailyVolume(volume.toString());
  };

  // Update staking when scenario changes
  const handleStakingScenarioChange = (staking: StakingType) => {
    setSelectedStaking(staking);
    const amount = STAKING_SCENARIOS[staking].amount;
    setTotalStaked(amount.toString());
  };

  const getDailyVolume = () => parseFloat(dailyVolume) || 0;
  const getFeePercent = () => parseFloat(feePercent) || 0;
  const getTotalStaked = () => parseFloat(totalStaked) || 1;
  const getYourStaked = () => parseFloat(yourStaked) || 0;
  const getMotoPrice = () => parseFloat(motoPrice) || 0;
  const getTimePeriod = () => parseFloat(timePeriod) || 12;
  const getMotoHoldings = () => parseFloat(motoHoldings) || 0;

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
          <img src="/motoswap.svg" alt="MOTO" style={{ width: '20px', height: '20px' }} /> MOTOSWAP STAKING PARAMETERS
        </h2>

        {/* Your Holdings Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Your Holdings (from Portfolio) */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#f7931a', fontWeight: 600 }}>
              YOUR MOTO HOLDINGS (OP20)
            </label>
            <div style={{
              padding: '12px 0',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#f7931a'
            }}>
              {getMotoHoldings() > 0 ? formatNumber(getMotoHoldings()) : '—'}
            </div>
            <p style={{ fontSize: '0.6rem', color: '#666', margin: 0 }}>
              From Portfolio Tracker
            </p>
          </div>

          {/* Your Staked */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 600 }}>
              YOUR STAKED MOTO
            </label>
            <input
              type="text"
              value={formatInputNumber(yourStaked)}
              onChange={(e) => setYourStaked(parseInputNumber(e.target.value))}
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
        </div>

        {/* Scenario Selectors - Side by Side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Volume Scenario */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, marginBottom: '10px', display: 'block' }}>
              VOLUME SCENARIO
            </label>

            {/* DEX Selection */}
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '0.6rem', color: '#666' }}>DEX:</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {(Object.keys(DEX_SCENARIOS) as DexType[]).map(dex => (
                  <button
                    key={dex}
                    onClick={() => handleVolumeScenarioChange(dex, selectedMarket)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.65rem',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      background: selectedDex === dex ? '#f7931a' : 'rgba(255,255,255,0.05)',
                      color: selectedDex === dex ? '#000' : '#888',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {DEX_SCENARIOS[dex].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Market Condition */}
            <div>
              <span style={{ fontSize: '0.6rem', color: '#666' }}>Market:</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {(Object.keys(MARKET_CONDITIONS) as MarketType[]).map(market => (
                  <button
                    key={market}
                    onClick={() => handleVolumeScenarioChange(selectedDex, market)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.65rem',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      background: selectedMarket === market
                        ? MARKET_CONDITIONS[market].color
                        : 'rgba(255,255,255,0.05)',
                      color: selectedMarket === market ? '#000' : '#888',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    {MARKET_CONDITIONS[market].label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.55rem', color: '#555', margin: '8px 0 0' }}>
              {DEX_SCENARIOS[selectedDex].description}
            </p>
          </div>

          {/* Staking Ratio Scenario */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, marginBottom: '10px', display: 'block' }}>
              STAKING RATIO (% of 1B)
            </label>

            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(Object.keys(STAKING_SCENARIOS) as StakingType[]).map(staking => (
                <button
                  key={staking}
                  onClick={() => handleStakingScenarioChange(staking)}
                  style={{
                    padding: '6px 8px',
                    fontSize: '0.6rem',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    background: selectedStaking === staking
                      ? STAKING_SCENARIOS[staking].color
                      : 'rgba(255,255,255,0.05)',
                    color: selectedStaking === staking ? '#000' : '#888',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '55px'
                  }}
                >
                  <span>{STAKING_SCENARIOS[staking].percentage}%</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.55rem', color: '#555', margin: '8px 0 0' }}>
              {STAKING_SCENARIOS[selectedStaking].label}: {STAKING_SCENARIOS[selectedStaking].description}
            </p>
          </div>
        </div>

        {/* Parameters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px'
        }}>
          {/* Daily Volume */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              DAILY VOLUME ($)
            </label>
            <input
              type="text"
              value={formatInputNumber(dailyVolume)}
              onChange={(e) => setDailyVolume(parseInputNumber(e.target.value))}
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
            <p style={{ fontSize: '0.6rem', color: '#555', margin: '4px 0 0' }}>
              Editable - scenario is starting point
            </p>
          </div>

          {/* Fee Percent */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>
              SWAP FEE REWARD (%)
            </label>
            <input
              type="text"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
              placeholder="0.2"
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
              type="text"
              value={formatInputNumber(totalStaked)}
              onChange={(e) => setTotalStaked(parseInputNumber(e.target.value))}
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

          {/* MOTO Price OP20 */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 600 }}>
              MOTO PRICE (OP20)
            </label>
            <input
              type="text"
              value={motoPrice}
              onChange={(e) => setMotoPrice(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px 0',
                fontSize: '1.2rem',
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
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

        {/* Yield Projections - Inside main box */}
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{
            fontSize: '0.8rem',
            color: '#fff',
            marginBottom: '16px',
            fontWeight: 600,
            letterSpacing: '1px'
          }}>
            📈 YIELD PROJECTIONS
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '16px'
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
                  padding: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: '6px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80' }}>
                  {formatUSD(item.value)}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px' }}>
                  ~{formatNumber(Math.round(item.moto))} MOTO
                </div>
              </div>
            ))}
          </div>

          {/* APY Display */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.05))',
            borderRadius: '10px',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#4ade80', marginBottom: '6px' }}>
              ESTIMATED APY (SIMPLE)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4ade80' }}>
              {simpleAPY.toFixed(2)}%
            </div>
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
              type="text"
              value={formatInputNumber(timePeriod)}
              onChange={(e) => setTimePeriod(parseInputNumber(e.target.value))}
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
