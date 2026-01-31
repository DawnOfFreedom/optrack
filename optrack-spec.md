# OPtrack - MOTO Portfolio Tracker

## Overview
Web application for tracking MOTO (OP_NET) portfolio value, Motocats NFTs, and staking yields.

## Tech Stack (suggested)
- React + TypeScript
- Tailwind CSS
- Local storage for persisting user data
- No backend required (client-side only)

---

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  🟠 OPtrack                                                      │
├──────────────────┬──────────────────┬──────────────────┬────────┤
│ Portfolio Tracker│    Motocats      │  Yield Calculator│        │
└──────────────────┴──────────────────┴──────────────────┴────────┘
```

3 main tabs:
1. **Portfolio Tracker** - Main dashboard with holdings & scenarios
2. **Motocats** - NFT tracking & airdrop calculator  
3. **Yield Calculator** - Motoswap staking/LP yield projections

---

## Tab 1: Portfolio Tracker

### Section A: MOTO Converter (top)
Two-way conversion between CBRC-20 and OP20

| Field | Description |
|-------|-------------|
| CBRC-20 Input | User enters CBRC-20 MOTO amount |
| OP20 Input | User enters OP20 MOTO amount |
| Auto-sync | Editing one field updates the other |

**Constants:**
```javascript
const CBRC_SUPPLY = 21_000_000;
const OP20_SUPPLY = 1_000_000_000;
const RATIO = OP20_SUPPLY / CBRC_SUPPLY; // 47.619047619
```

### Section B: Current Portfolio Value

| Field | Type | Description |
|-------|------|-------------|
| Quantity MOTO (CBRC) | input | User's CBRC-20 holdings |
| Quantity MOTO (OP20) | calculated | Auto-converted from CBRC |
| $ Invested CBRC | input | Total USD invested |
| Average Entry | calculated | $ Invested / Quantity |
| Current MOTO Price | input/fetch | Current OTC or market price |
| Current Value | calculated | Quantity × Current Price |
| PNL $ | calculated | Current Value - Invested |
| PNL % | calculated | (PNL / Invested) × 100 |

### Section C: Investment Potential (Diamond Hands Scenarios)

Table showing portfolio value at different market caps.

**Scenarios:**
| Market Cap | Type | 
|------------|------|
| $100M | Conservative |
| $250M | Moderate |
| $500M | Solid |
| $1B | Success |
| $2.5B | Major |
| $5B | Moonshot |

**Columns per scenario:**
- Market Cap
- Price per MOTO (mcap / circulating_supply)
- Your OP20 Amount
- Portfolio Value (amount × price)
- PNL % vs investment

**Circulating Supply Options:**
```javascript
const SUPPLY_OPTIONS = {
  '550M': 550_000_000,  // Lower estimate
  '650M': 650_000_000,  // Mid estimate (default)
  '1B': 1_000_000_000,  // Fully diluted
};
```
User can toggle between supply estimates.

---

## Tab 2: Motocats

### Section A: Motocats Holdings

| Field | Type | Description |
|-------|------|-------------|
| Motocats Owned | input | Number of Motocats NFTs |
| Motocats Minted | display | Total minted (from API or manual) |
| Floor Price (BTC) | input | Current floor price |
| Floor Price (USD) | calculated | BTC × BTC/USD rate |
| Total Value | calculated | Owned × Floor Price |

### Section B: Airdrop Calculator

Motocats holders receive MOTO airdrops.

| Field | Type | Description |
|-------|------|-------------|
| Total Airdrop Pool | input | Total MOTO allocated to Motocat holders |
| Total Motocats | input | Total supply of Motocats |
| Airdrop per Cat | calculated | Pool / Total Motocats |
| Your Airdrop | calculated | Owned × Airdrop per Cat |
| Airdrop Value | calculated | Your Airdrop × MOTO Price |

**Default assumptions (editable):**
```javascript
const MOTOCAT_AIRDROP_POOL = 50_000_000; // 50M OP20 MOTO (speculation)
const TOTAL_MOTOCATS = 550; // Approximate total supply
```

### Section C: Combined Value
- Motocats NFT Value
- Expected Airdrop Value
- Total Motocats Position Value

---

## Tab 3: Yield Calculator

Motoswap staking/LP yield projections.

### Section A: Inputs

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Motoswap Volume (Daily) | input | - | Daily trading volume in USD |
| Swap Fee Reward % | input | 0.2% | Fee percentage for stakers |
| Total Staked MOTO | input | - | Total MOTO in staking pool |
| Fee per MOTO | calculated | (Volume × Fee%) / Staked |
| Your Staked MOTO | input | - | User's staked amount |
| Your Daily Reward | calculated | Your Staked × Fee per MOTO |

### Section B: Yield Projections

| Timeframe | Calculation |
|-----------|-------------|
| Daily Yield | Your Daily Reward |
| Weekly Yield | Daily × 7 |
| Monthly Yield | Daily × 30 |
| Yearly Yield | Daily × 365 |
| APY (simple) | (Yearly / Your Staked) × 100 |

### Section C: Compound Interest Calculator

Link/integration with: https://www.thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php

Or build custom:

| Field | Description |
|-------|-------------|
| Principal | Starting staked amount (in MOTO or USD) |
| APY % | From yield calculation |
| Compound Frequency | Daily / Weekly / Monthly |
| Time Period | Months or Years |
| Final Value | Compound interest result |

**Formula:**
```javascript
// Compound Interest
const compoundInterest = (principal, rate, n, t) => {
  // principal = initial amount
  // rate = annual interest rate (decimal)
  // n = compounds per year
  // t = time in years
  return principal * Math.pow(1 + rate / n, n * t);
};
```

---

## Global Constants & State

```typescript
// constants.ts
export const MOTO_CONSTANTS = {
  CBRC_SUPPLY: 21_000_000,
  OP20_SUPPLY: 1_000_000_000,
  CBRC_TO_OP20_RATIO: 47.619047619,
  
  CIRCULATING_SUPPLY: {
    LOW: 550_000_000,
    MID: 650_000_000,
    HIGH: 1_000_000_000,
  },
  
  SCENARIOS: [
    { mcap: 100_000_000, label: '$100M', type: 'Conservative' },
    { mcap: 250_000_000, label: '$250M', type: 'Moderate' },
    { mcap: 500_000_000, label: '$500M', type: 'Solid' },
    { mcap: 1_000_000_000, label: '$1B', type: 'Success' },
    { mcap: 2_500_000_000, label: '$2.5B', type: 'Major' },
    { mcap: 5_000_000_000, label: '$5B', type: 'Moonshot' },
  ],
};

// types.ts
export interface PortfolioState {
  cbrcAmount: number;
  op20Amount: number;
  invested: number;
  currentPrice: number;
  selectedSupply: 'LOW' | 'MID' | 'HIGH';
}

export interface MotocatsState {
  owned: number;
  floorPriceBTC: number;
  btcPrice: number;
  airdropPool: number;
  totalMotocats: number;
}

export interface YieldState {
  dailyVolume: number;
  feePercent: number;
  totalStaked: number;
  yourStaked: number;
}
```

---

## Component Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── TabNavigation.tsx
│   │   └── Footer.tsx
│   ├── Portfolio/
│   │   ├── MotoConverter.tsx
│   │   ├── CurrentValue.tsx
│   │   └── ScenarioTable.tsx
│   ├── Motocats/
│   │   ├── Holdings.tsx
│   │   ├── AirdropCalculator.tsx
│   │   └── CombinedValue.tsx
│   ├── Yield/
│   │   ├── YieldInputs.tsx
│   │   ├── YieldProjections.tsx
│   │   └── CompoundCalculator.tsx
│   └── shared/
│       ├── NumberInput.tsx
│       ├── Card.tsx
│       └── StatDisplay.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   └── usePortfolio.ts
├── utils/
│   ├── calculations.ts
│   └── formatters.ts
├── constants/
│   └── index.ts
└── App.tsx
```

---

## Utility Functions

```typescript
// utils/calculations.ts

export const cbrcToOp20 = (cbrc: number): number => {
  return cbrc * 47.619047619;
};

export const op20ToCbrc = (op20: number): number => {
  return op20 / 47.619047619;
};

export const calculatePrice = (mcap: number, supply: number): number => {
  return mcap / supply;
};

export const calculatePNL = (current: number, invested: number) => {
  const pnlDollar = current - invested;
  const pnlPercent = invested > 0 ? (pnlDollar / invested) * 100 : 0;
  return { pnlDollar, pnlPercent };
};

export const calculateYield = (
  dailyVolume: number,
  feePercent: number,
  totalStaked: number,
  yourStaked: number
) => {
  const dailyFees = dailyVolume * (feePercent / 100);
  const feePerMoto = totalStaked > 0 ? dailyFees / totalStaked : 0;
  const yourDaily = yourStaked * feePerMoto;
  
  return {
    dailyFees,
    feePerMoto,
    yourDaily,
    yourWeekly: yourDaily * 7,
    yourMonthly: yourDaily * 30,
    yourYearly: yourDaily * 365,
    apy: yourStaked > 0 ? (yourDaily * 365 / yourStaked) * 100 : 0,
  };
};

// utils/formatters.ts

export const formatUSD = (num: number): string => {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};
```

---

## Local Storage Persistence

```typescript
// hooks/useLocalStorage.ts

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

---

## Design Guidelines

### Color Palette
```css
--bg-primary: #0a0a0f;
--bg-secondary: #1a1a2e;
--bg-card: rgba(255, 255, 255, 0.03);
--border: rgba(255, 255, 255, 0.1);

--accent-orange: #f7931a;  /* MOTO/Bitcoin orange */
--accent-green: #4ade80;   /* Positive/profit */
--accent-red: #ef4444;     /* Negative/loss */

--text-primary: #ffffff;
--text-secondary: #888888;
--text-muted: #555555;
```

### Typography
- Headers: Orbitron (bold, crypto feel)
- Body/Numbers: JetBrains Mono (monospace, readable numbers)

### UI Patterns
- Dark theme (crypto native)
- Cards with subtle borders
- Highlighted rows for key scenarios ($1B)
- Green for profit, red for loss
- Orange accents for MOTO branding

---

## Future Enhancements (Optional)

- [ ] Fetch live BTC price from API
- [ ] Fetch MOTO OTC price from motoswap
- [ ] Connect wallet for auto-balance detection
- [ ] Export portfolio as CSV/PDF
- [ ] Price alerts
- [ ] Historical tracking with charts
