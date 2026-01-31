import { useState, useEffect } from 'react';
import PortfolioTracker from './components/Portfolio/PortfolioTracker';
import MotoConverter from './components/Portfolio/MotoConverter';
import Motocats from './components/Motocats/Motocats';
import YieldCalculator from './components/Yield/YieldCalculator';
import BuyMoto from './components/BuyMoto/BuyMoto';
import Resources from './components/Resources/Resources';

const sections = [
  { id: 'portfolio', label: 'Portfolio Tracker', image: '/portfolio.svg' },
  { id: 'motocats', label: 'Motocats', image: '/motocat.png' },
  { id: 'yield', label: 'Yield Calculator', image: '/motochef.svg' },
  { id: 'buymoto', label: 'Buy $MOTO', image: '/motoswap.svg' },
  { id: 'resources', label: 'Resources', image: '/resources.svg' },
];

const sectionHeaderStyle: React.CSSProperties = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#f7931a',
  marginBottom: '24px',
  paddingBottom: '12px',
  borderBottom: '2px solid rgba(247, 147, 26, 0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const scrollToSection = (id: string, closeMenu?: () => void) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (closeMenu) closeMenu();
};

export default function App() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Shared Motocats state
  const [motocatsOwned, setMotocatsOwned] = useState('');
  const [motocatsFloorSats, setMotocatsFloorSats] = useState('344000');
  const [motocatsInvested, setMotocatsInvested] = useState('');

  // Shared MOTO holdings state
  const [motoHoldingsOp20, setMotoHoldingsOp20] = useState('');

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
          setMotocatsFloorSats(floorSats.toString());
        }
      } catch (err) {
        console.error('Failed to fetch Motocat floor:', err);
      }
    };
    fetchMotocatFloor();
    const interval = setInterval(fetchMotocatFloor, 60000);
    return () => clearInterval(interval);
  }, []);

  const motocatsState = {
    owned: motocatsOwned,
    setOwned: setMotocatsOwned,
    floorSats: motocatsFloorSats,
    setFloorSats: setMotocatsFloorSats,
    invested: motocatsInvested,
    setInvested: setMotocatsInvested,
    btcPrice: btcPrice || 100000,
  };

  const motoState = {
    holdingsOp20: motoHoldingsOp20,
    setHoldingsOp20: setMotoHoldingsOp20,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: '#e0e0e0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          scroll-behavior: smooth;
          background: #0a0a0f;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .mobile-hide {
            display: none !important;
          }
          .mobile-show {
            display: flex !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .converter-widget {
            display: none !important;
          }
          section {
            scroll-margin-top: 120px !important;
          }
        }

        @media (max-width: 480px) {
          header {
            padding: 12px 16px !important;
          }
          main {
            padding: 20px 12px !important;
          }
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          cursor: pointer;
        }
        .hamburger span {
          width: 22px;
          height: 2px;
          background: #f7931a;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(10, 10, 15, 0.98);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 16px;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-menu.open {
          display: flex;
        }
        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 0.9rem;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-menu-item:hover {
          background: rgba(247, 147, 26, 0.15);
          border-color: rgba(247, 147, 26, 0.3);
          color: #f7931a;
        }

        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }
        }

        .nav-btn:hover {
          background: rgba(247, 147, 26, 0.2) !important;
          color: #f7931a !important;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <img
                src="/logo-round.svg"
                alt="OPtrack Logo"
                style={{ width: '36px', height: '36px' }}
              />
              <h1 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 900,
                background: 'linear-gradient(90deg, #f7931a, #ffab40)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                letterSpacing: '2px'
              }}>
                OPtrack
              </h1>
            </div>

            {/* Bitcoin Price */}
            {btcPrice && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div className="live-dot" />
                <span style={{ color: '#f7931a', fontWeight: 600 }}>BTC</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>
                  ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            gap: '4px',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px',
            borderRadius: '12px'
          }}>
            {sections.map(section => (
              <button
                key={section.id}
                className="nav-btn"
                onClick={() => scrollToSection(section.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  background: 'transparent',
                  color: '#888',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <img src={section.image} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>

          {/* Hamburger Menu Button */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {sections.map(section => (
            <button
              key={section.id}
              className="mobile-menu-item"
              onClick={() => scrollToSection(section.id, () => setMenuOpen(false))}
            >
              <img src={section.image} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              {section.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content - All sections */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Portfolio Tracker Section */}
        <section id="portfolio" style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid rgba(247, 147, 26, 0.3)' }}>
            <h2 style={{ ...sectionHeaderStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
              <img src="/portfolio.svg" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Portfolio Tracker
            </h2>
            <div className="converter-widget"><MotoConverter /></div>
          </div>
          <PortfolioTracker motocatsState={motocatsState} motoState={motoState} />
        </section>

        {/* Motocats Section */}
        <section id="motocats" style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <h2 style={sectionHeaderStyle}>
            <img src="/motocat.png" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Motocats
          </h2>
          <Motocats motocatsState={motocatsState} />
        </section>

        {/* Yield Calculator Section */}
        <section id="yield" style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <h2 style={sectionHeaderStyle}>
            <img src="/motochef.svg" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Yield Calculator
          </h2>
          <YieldCalculator motoHoldings={motoHoldingsOp20} />
        </section>

        {/* Buy $MOTO Section */}
        <section id="buymoto" style={{ marginBottom: '80px', scrollMarginTop: '100px' }}>
          <h2 style={sectionHeaderStyle}>
            <img src="/motoswap.svg" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Buy $MOTO
          </h2>
          <BuyMoto />
        </section>

        {/* Resources Section */}
        <section id="resources" style={{ marginBottom: '40px', scrollMarginTop: '100px' }}>
          <h2 style={sectionHeaderStyle}>
            <img src="/resources.svg" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> Resources
          </h2>
          <Resources />
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#444',
        fontSize: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        OPtrack • MOTO Portfolio Tracker • Not Financial Advice
      </footer>
    </div>
  );
}
