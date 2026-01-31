const resources = [
  {
    category: 'LEARN',
    items: [
      {
        url: 'https://opnet.org',
        image: '/opnet.svg',
        name: 'OP_NET',
        description: 'Smart contracts op Bitcoin L1',
      },
      {
        url: 'https://dev.opnet.org',
        icon: '👨‍💻',
        name: 'Developer Docs',
        description: 'Documentation for developers',
      },
      {
        url: 'https://moto.fun',
        icon: '📚',
        name: 'Bitcoin DeFi Bible',
        description: 'Education & documentation about OP_NET and Motoswap',
      },
    ],
  },
  {
    category: 'TRADE & EARN',
    items: [
      {
        url: 'https://motoswap.org',
        image: '/motoswap.svg',
        name: 'Motoswap DEX',
        description: 'Token swaps & liquidity pools',
      },
      {
        url: 'https://magiceden.io/ordinals/marketplace/motocats',
        image: '/ME.png',
        name: 'Motocats on Magic Eden',
        description: 'Buy & sell Motocats NFTs',
      },
      {
        url: 'https://farm.motoswap.org',
        image: '/motochef.svg',
        name: 'MotoChef',
        description: 'Yield farming & staking',
      },
      {
        url: 'https://t.me/MotoOTC',
        image: '/moto-otc.svg',
        name: 'Moto OTC',
        description: 'Telegram OTC trading group',
      },
      {
        url: 'https://orangepill.fun',
        icon: '🟠',
        name: 'OrangePill',
        description: 'Bitcoin education & community',
      },
    ],
  },
  {
    category: 'EXPLORE',
    items: [
      {
        url: 'https://opscan.org',
        image: '/opscan.png',
        name: 'OP_SCAN',
        description: 'Block explorer',
      },
      {
        url: 'https://garage.motoswap.org',
        image: '/motocat.png',
        name: 'Motocats Garage',
        description: 'NFT dashboard & boosts',
      },
    ],
  },
  {
    category: 'TOOLS',
    items: [
      {
        url: 'https://faucet.opnet.org',
        icon: '🚰',
        name: 'Faucet',
        description: 'Get testnet tokens',
      },
      {
        url: 'https://opnet.org/portal',
        image: '/odyssey.png',
        name: 'Odyssey Portal',
        description: 'Explore Bitcoin native DeFi & earn points',
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
                {'image' in item ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '36px',
                      height: '36px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                )}
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
