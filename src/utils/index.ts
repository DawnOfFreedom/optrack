// ============================================
// CONSTANTS
// ============================================

export const MOTO_CONSTANTS = {
  CBRC_SUPPLY: 21_000_000,
  OP20_SUPPLY: 1_000_000_000,
  CBRC_TO_OP20_RATIO: 47.619047619,
  
  CIRCULATING_SUPPLY: {
    LOW: 550_000_000,
    MID: 650_000_000,
    HIGH: 1_000_000_000,
  } as const,
  
  SCENARIOS: [
    { mcap: 100_000_000, label: '$100M', type: 'Conservative' },
    { mcap: 250_000_000, label: '$250M', type: 'Moderate' },
    { mcap: 500_000_000, label: '$500M', type: 'Solid' },
    { mcap: 1_000_000_000, label: '$1B', type: 'Success' },
    { mcap: 2_500_000_000, label: '$2.5B', type: 'Major' },
    { mcap: 5_000_000_000, label: '$5B', type: 'Moonshot' },
  ],
};

// ============================================
// CONVERSION FUNCTIONS
// ============================================

export const cbrcToOp20 = (cbrc: number): number => {
  return cbrc * MOTO_CONSTANTS.CBRC_TO_OP20_RATIO;
};

export const op20ToCbrc = (op20: number): number => {
  return op20 / MOTO_CONSTANTS.CBRC_TO_OP20_RATIO;
};

// ============================================
// CALCULATION FUNCTIONS
// ============================================

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
  yourStaked: number,
  motoPrice: number
) => {
  const dailyFees = dailyVolume * (feePercent / 100);
  const feePerMoto = totalStaked > 0 ? dailyFees / totalStaked : 0;
  const yourDailyUSD = yourStaked * feePerMoto;
  const yourDailyMoto = yourDailyUSD / motoPrice;
  const stakedValueUSD = yourStaked * motoPrice;
  
  return {
    dailyFees,
    feePerMoto,
    yourDailyUSD,
    yourDailyMoto,
    yourWeeklyUSD: yourDailyUSD * 7,
    yourMonthlyUSD: yourDailyUSD * 30,
    yourYearlyUSD: yourDailyUSD * 365,
    apy: stakedValueUSD > 0 ? (yourDailyUSD * 365 / stakedValueUSD) * 100 : 0,
  };
};

export const compoundInterest = (
  principal: number,
  annualRate: number,
  compoundsPerYear: number,
  years: number
): number => {
  return principal * Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear * years);
};

// ============================================
// FORMATTING FUNCTIONS
// ============================================

export const formatUSD = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return '$0.00';
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const formatNumber = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return '0.00%';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export const formatPrice = (price: number): string => {
  if (isNaN(price) || !isFinite(price)) return '$0.00';
  if (price < 0.01) return `$${price.toFixed(4)}`;
  if (price < 1) return `$${price.toFixed(3)}`;
  return `$${price.toFixed(2)}`;
};

// Format number with thousand separators (dots for NL)
export const formatInputNumber = (value: string): string => {
  if (!value) return '';
  // Remove all non-numeric characters except decimal point
  const clean = value.replace(/[^\d.]/g, '');
  const parts = clean.split('.');
  // Format integer part with dots as thousand separator
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.length > 1 ? `${parts[0]},${parts[1]}` : parts[0];
};

// Parse formatted number back to raw number string
export const parseInputNumber = (value: string): string => {
  if (!value) return '';
  // Remove thousand separators (dots), keep decimal comma and convert to dot
  return value.replace(/\./g, '').replace(',', '.');
};

// ============================================
// LOCAL STORAGE HOOK
// ============================================

import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(`optrack_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`optrack_${key}`, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// ============================================
// TYPES
// ============================================

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
  motoPrice: number;
}

export interface YieldState {
  dailyVolume: number;
  feePercent: number;
  totalStaked: number;
  yourStaked: number;
  motoPrice: number;
}

export type CirculatingSupplyKey = 'LOW' | 'MID' | 'HIGH';
