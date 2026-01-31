const resources = [
  {
    category: 'LEARN',
    items: [
      {
        url: 'https://moto.fun',
        icon: '📚',
        name: 'Bitcoin DeFi Bible',
        description: 'Educatie & documentatie over OP_NET en Motoswap',
      },
      {
        url: 'https://opnet.org',
        icon: '🟠',
        name: 'OP_NET',
        description: 'Smart contracts op Bitcoin L1',
      },
    ],
  },
  {
    category: 'TRADE & EARN',
    items: [
      {
        url: 'https://motoswap.org',
        icon: '🔄',
        name: 'Motoswap DEX',
        description: 'Token swaps & liquidity pools',
      },
      {
        url: 'https://farm.motoswap.org',
        icon: '🌾',
        name: 'MotoChef',
        description: 'Yield farming & staking',
      },
    ],
  },
  {
    category: 'EXPLORE',
    items: [
      {
        url: 'https://garage.motoswap.org',
        icon: '🐱',
        name: 'Motocats Garage',
        description: 'NFT dashboard & boosts',
      },
      {
        url: 'https://ordinalnovus.com/cbrc-20/moto',
        icon: '📊',
        name: 'CBRC-20 MOTO',
        description: 'Token info & OTC markt',
      },
    ],
  },
  {
    category: 'TOOLS',
    items: [
      {
        url: 'https://opscan.org',
        icon: '🔍',
        name: 'OP_SCAN',
        description: 'Block explorer',
      },
      {
        url: 'https://cybord.motoswap.org',
        icon: '🤖',
        name: 'Cybord API',
        description: 'Transfer verificatie',
      },
    ],
  },
];

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

const cardHoverStyle: React.CSSProperties = {
  background: 'rgba(247, 147, 26, 0.1)',
  borderColor: 'rgba(247, 147, 26, 0.3)',
  transform: 'translateY(-2px)',
};

export default function Resources() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <style>{`
        .resource-card:hover {
          background: rgba(247, 147, 26, 0.1) !important;
          border-color: rgba(247, 147, 26, 0.3) !important;
          transform: translateY(-2px);
        }
        .resource-card:hover .card-name {
          color: #f7931a !important;
        }
      `}</style>

      {resources.map((section) => (
        <div key={section.category}>
          <h2
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#f7931a',
              letterSpacing: '2px',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}
          >
            {section.category}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '12px',
            }}
          >
            {section.items.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
                style={cardStyle}
              >
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <div
                    className="card-name"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#fff',
                      marginBottom: '4px',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    {item.description}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
