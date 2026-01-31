export default function BuyMoto() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(247, 147, 26, 0.3)',
      borderRadius: '16px',
      padding: '30px'
    }}>
      <style>{`
        @media (max-width: 600px) {
          .buymoto-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      {/* Info Text */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{
          fontSize: '0.9rem',
          color: '#888',
          lineHeight: 1.7
        }}>
          To get exposure to this project, there are currently <span style={{ color: '#fff', fontWeight: 600 }}>2 ways</span>:
        </p>
        <ul style={{
          fontSize: '0.9rem',
          color: '#888',
          lineHeight: 2,
          marginTop: '12px',
          paddingLeft: '20px'
        }}>
          <li>
            <span style={{ color: '#f7931a', fontWeight: 600 }}>$MOTO via OTC</span> — Buy directly through the Telegram OTC group (very limited availability)
          </li>
          <li>
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>Motocats NFT</span> — Purchase Motocats on Magic Eden (includes future $MOTO airdrop)
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="buymoto-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {/* OTC Telegram Button */}
        <a
          href="https://t.me/mikiDev1337"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.2), rgba(247, 147, 26, 0.05))',
            border: '2px solid rgba(247, 147, 26, 0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(247, 147, 26, 0.3), rgba(247, 147, 26, 0.1))';
            e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(247, 147, 26, 0.2), rgba(247, 147, 26, 0.05))';
            e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.4)';
          }}
        >
          <img src="/motoswap.svg" alt="MOTO" style={{ width: '32px', height: '32px' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>BUY $MOTO</div>
            <div style={{ fontSize: '1rem', color: '#f7931a', fontWeight: 700 }}>OTC Telegram</div>
          </div>
        </a>

        {/* Magic Eden Button */}
        <a
          href="https://magiceden.io/ordinals/marketplace/motocats"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(167, 139, 250, 0.05))',
            border: '2px solid rgba(167, 139, 250, 0.4)',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(167, 139, 250, 0.1))';
            e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(167, 139, 250, 0.05))';
            e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)';
          }}
        >
          <img src="/motocat.png" alt="Motocats" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>BUY MOTOCATS</div>
            <div style={{ fontSize: '1rem', color: '#a78bfa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Magic Eden <img src="/ME.png" alt="ME" style={{ width: '18px', height: '18px' }} />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
