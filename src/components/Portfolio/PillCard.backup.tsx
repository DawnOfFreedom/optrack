// BACKUP: $PILL Card component - to be restored later
// Removed from PortfolioTracker.tsx on 2026-02-01

// State variables needed in PortfolioTracker:
// const [holdingsPills, setHoldingsPills] = useState('');
// const [investedPills, setInvestedPills] = useState('');
// const getInvestedPills = () => parseFloat(investedPills) || 0;
// Include in getTotalInvested: + getInvestedPills()

export const PillCardJSX = `
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
    <span style={{ fontSize: '0.7rem', color: '#666' }}>Supply: 1.000.000.000.000</span>
  </div>

  <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
    <div>
      <label style={{ fontSize: '0.7rem', color: '#f472b6' }}>AMOUNT</label>
      <input
        type="text"
        value={formatInputNumber(holdingsPills)}
        onChange={(e) => setHoldingsPills(parseInputNumber(e.target.value))}
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
        type="text"
        value={formatInputNumber(investedPills)}
        onChange={(e) => setInvestedPills(parseInputNumber(e.target.value))}
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
`;
