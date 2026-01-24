import { BuilderElement, ElementStyles } from '../types';

// Convert styles object to inline style object string
const stylesToInline = (styles: ElementStyles): string => {
  const entries = Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== '');

  if (entries.length === 0) return '';

  return entries
    .map(([key, value]) => `${key}: '${value}'`)
    .join(', ');
};

// Generate React component for an element
const elementToReact = (element: BuilderElement, indent: number = 6): string => {
  const spaces = ' '.repeat(indent);
  const styleStr = stylesToInline(element.styles);
  const styleAttr = styleStr ? ` style={{ ${styleStr} }}` : '';

  switch (element.type) {
    case 'heading':
      return `${spaces}<h2${styleAttr}>${element.content || 'Heading'}</h2>`;

    case 'text':
      return `${spaces}<p${styleAttr}>${element.content || 'Text content'}</p>`;

    case 'button':
      return `${spaces}<button className="btn btn-primary"${styleAttr}>${element.content || 'Button'}</button>`;

    case 'image':
      return `${spaces}<img${styleAttr} src="${element.src || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800'}" alt="${element.name}" loading="lazy" />`;

    case 'link':
      return `${spaces}<a${styleAttr} href="${element.href || '#'}">${element.content || 'Link'}</a>`;

    case 'divider':
      return `${spaces}<hr${styleAttr} />`;

    case 'spacer':
      return `${spaces}<div${styleAttr} aria-hidden="true" />`;

    case 'video':
      return `${spaces}<video${styleAttr} src="${element.src || ''}" controls />`;

    case 'embed':
      return `${spaces}<iframe${styleAttr} src="${element.src || ''}" title="${element.name}" loading="lazy" />`;

    case 'input':
      return `${spaces}<input className="form-input"${styleAttr} type="text" placeholder="${element.placeholder || 'Enter text...'}" />`;

    case 'textarea':
      return `${spaces}<textarea className="form-textarea"${styleAttr} placeholder="${element.placeholder || 'Enter text...'}" rows={4} />`;

    case 'navbar':
      return `${spaces}<Navbar brand="${element.content || 'Brand'}" />`;

    case 'hero':
      return `${spaces}<Hero title="${element.content || 'Welcome to Your Website'}" />`;

    case 'card':
      return `${spaces}<Card title="${element.content || 'Card Title'}" />`;

    case 'feature':
      return `${spaces}<Feature title="${element.content || 'Feature Title'}" />`;

    case 'testimonial':
      return `${spaces}<Testimonial quote="${element.content || '"This product changed my life!"'}" />`;

    case 'pricing':
      return `${spaces}<PricingCard plan="${element.content || 'Professional'}" />`;

    case 'cta':
      return `${spaces}<CTASection title="${element.content || 'Ready to Get Started?'}" />`;

    case 'footer':
      return `${spaces}<Footer copyright="${element.content || '© 2024 Your Company'}" />`;

    case 'gallery':
      return `${spaces}<Gallery />`;

    case 'scene3d':
      return `${spaces}<Scene3D />`;

    case 'container':
    case 'flexbox':
    case 'grid': {
      const childrenJSX = element.children
        .map(child => elementToReact(child, indent + 2))
        .join('\n');

      if (childrenJSX) {
        return `${spaces}<div${styleAttr}>
${childrenJSX}
${spaces}</div>`;
      }
      return `${spaces}<div${styleAttr} />`;
    }

    case 'section': {
      const childrenJSX = element.children
        .map(child => elementToReact(child, indent + 2))
        .join('\n');

      if (childrenJSX) {
        return `${spaces}<section${styleAttr}>
${childrenJSX}
${spaces}</section>`;
      }
      return `${spaces}<section${styleAttr} />`;
    }

    case 'form': {
      const childrenJSX = element.children
        .map(child => elementToReact(child, indent + 2))
        .join('\n');

      if (childrenJSX) {
        return `${spaces}<form${styleAttr} onSubmit={(e) => e.preventDefault()}>
${childrenJSX}
${spaces}</form>`;
      }
      return `${spaces}<form${styleAttr} />`;
    }

    default:
      return `${spaces}<div${styleAttr}>{/* ${element.type} */}</div>`;
  }
};

// Check if special components are used
const hasComponent = (elements: BuilderElement[], type: string): boolean => {
  for (const element of elements) {
    if (element.type === type) return true;
    if (element.children.length > 0 && hasComponent(element.children, type)) return true;
  }
  return false;
};

export const generateReactExport = (elements: BuilderElement[]): string => {
  const use3D = hasComponent(elements, 'scene3d');
  const useNavbar = hasComponent(elements, 'navbar');
  const useHero = hasComponent(elements, 'hero');
  const useCard = hasComponent(elements, 'card');
  const useFeature = hasComponent(elements, 'feature');
  const useTestimonial = hasComponent(elements, 'testimonial');
  const usePricing = hasComponent(elements, 'pricing');
  const useCTA = hasComponent(elements, 'cta');
  const useFooter = hasComponent(elements, 'footer');
  const useGallery = hasComponent(elements, 'gallery');

  const imports = use3D
    ? `import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';`
    : '';

  // Generate component definitions
  let components = '';

  if (useNavbar) {
    components += `
// Professional Navbar Component
function Navbar({ brand }: { brand: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>{brand}</div>
      <button 
        style={styles.navToggle} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span style={styles.navToggleLine} />
        <span style={styles.navToggleLine} />
        <span style={styles.navToggleLine} />
      </button>
      <ul style={{ ...styles.navLinks, ...(isOpen ? styles.navLinksOpen : {}) }}>
        {['Home', 'About', 'Services', 'Contact'].map(item => (
          <li key={item}><a href="#" style={styles.navLink}>{item}</a></li>
        ))}
      </ul>
    </nav>
  );
}
`;
  }

  if (useHero) {
    components += `
// Hero Section Component
function Hero({ title }: { title: string }) {
  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>{title}</h1>
        <p style={styles.heroSubtitle}>
          Create stunning experiences with our professional solutions
        </p>
        <div style={styles.heroButtons}>
          <a href="#" style={styles.btnPrimary}>Get Started</a>
          <a href="#" style={styles.btnSecondary}>Learn More</a>
        </div>
      </div>
    </section>
  );
}
`;
  }

  if (useCard) {
    components += `
// Card Component
function Card({ title }: { title: string }) {
  return (
    <article style={styles.card}>
      <div style={styles.cardImage} />
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDescription}>
          Transform your ideas into reality with our innovative solutions.
        </p>
        <a href="#" style={styles.cardLink}>Learn more →</a>
      </div>
    </article>
  );
}
`;
  }

  if (useFeature) {
    components += `
// Feature Component
function Feature({ title }: { title: string }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureIcon}>★</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDescription}>
        Discover the power of innovation with our cutting-edge solutions.
      </p>
    </div>
  );
}
`;
  }

  if (useTestimonial) {
    components += `
// Testimonial Component
function Testimonial({ quote }: { quote: string }) {
  return (
    <blockquote style={styles.testimonial}>
      <p style={styles.testimonialText}>{quote}</p>
      <footer style={styles.testimonialAuthor}>
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
          alt="Author" 
          style={styles.authorAvatar} 
        />
        <div>
          <cite style={styles.authorName}>John Anderson</cite>
          <span style={styles.authorRole}>CEO, TechCorp</span>
        </div>
      </footer>
    </blockquote>
  );
}
`;
  }

  if (usePricing) {
    components += `
// Pricing Card Component
function PricingCard({ plan }: { plan: string }) {
  return (
    <div style={styles.pricing}>
      <div style={styles.pricingHeader}>
        <h3 style={styles.pricingName}>{plan}</h3>
        <p style={styles.pricingTagline}>Best for growing businesses</p>
      </div>
      <div style={styles.pricingPrice}>
        <span style={styles.priceCurrency}>$</span>
        <span style={styles.priceAmount}>49</span>
        <span style={styles.pricePeriod}>/month</span>
      </div>
      <ul style={styles.pricingFeatures}>
        {['Unlimited projects', 'Priority support 24/7', 'Advanced analytics', 'Custom integrations'].map((item, i) => (
          <li key={i} style={styles.pricingFeatureItem}>✓ {item}</li>
        ))}
      </ul>
      <a href="#" style={styles.pricingCta}>Get Started</a>
    </div>
  );
}
`;
  }

  if (useCTA) {
    components += `
// CTA Section Component
function CTASection({ title }: { title: string }) {
  return (
    <section style={styles.cta}>
      <div style={styles.ctaContent}>
        <h2 style={styles.ctaTitle}>{title}</h2>
        <p style={styles.ctaDescription}>
          Join thousands of companies already using our platform to accelerate growth.
        </p>
        <div style={styles.ctaButtons}>
          <a href="#" style={styles.btnLight}>Start Free Trial</a>
          <a href="#" style={styles.btnOutlineLight}>Schedule Demo</a>
        </div>
      </div>
    </section>
  );
}
`;
  }

  if (useFooter) {
    components += `
// Footer Component
function Footer({ copyright }: { copyright: string }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerGrid}>
        <div style={styles.footerBrand}>
          <h4 style={styles.footerBrandTitle}>Brand</h4>
          <p style={styles.footerBrandText}>Building the future, one project at a time.</p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Pricing', 'Integrations'] },
          { title: 'Company', links: ['About', 'Blog', 'Careers'] },
          { title: 'Support', links: ['Help Center', 'Contact', 'Privacy'] }
        ].map((section, i) => (
          <div key={i} style={styles.footerLinks}>
            <h5 style={styles.footerLinksTitle}>{section.title}</h5>
            <ul>
              {section.links.map((link, j) => (
                <li key={j}><a href="#" style={styles.footerLink}>{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={styles.footerBottom}>
        <p>{copyright}</p>
      </div>
    </footer>
  );
}
`;
  }

  if (useGallery) {
    components += `
// Gallery Component
function Gallery() {
  const images = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400'
  ];
  
  return (
    <div style={styles.gallery}>
      {images.map((src, i) => (
        <div key={i} style={styles.galleryItem}>
          <img src={src} alt={\`Gallery \${i + 1}\`} style={styles.galleryImage} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
`;
  }

  if (use3D) {
    components += `
// 3D Scene Component
function Scene3D() {
  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <mesh>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#6366f1" metalness={0.5} roughness={0.5} />
        </mesh>
        <OrbitControls />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
`;
  }

  const content = elements
    .map(element => elementToReact(element))
    .join('\n');

  return `import React from 'react';
${imports}

// Professional Design System Styles
const styles: Record<string, React.CSSProperties> = {
  // Base
  app: {
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: '#ffffff',
    color: '#283618',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased',
  },
  
  // Buttons
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #d4a373 0%, #606c38 100%)',
    color: '#ffffff',
    borderRadius: '99px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    background: 'transparent',
    color: '#283618',
    borderRadius: '99px',
    border: '2px solid #283618',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnLight: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: 600,
    background: '#ffffff',
    color: '#d4a373',
    borderRadius: '99px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  btnOutlineLight: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 30px',
    fontSize: '16px',
    fontWeight: 600,
    background: 'transparent',
    color: '#ffffff',
    borderRadius: '99px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    textDecoration: 'none',
    cursor: 'pointer',
  },

  // Navbar
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 48px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(40, 54, 24, 0.05)',
  },
  navBrand: {
    fontSize: '24px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #d4a373 0%, #606c38 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  navToggle: {
    display: 'none',
    flexDirection: 'column' as const,
    gap: '5px',
    padding: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  navToggleLine: {
    width: '24px',
    height: '2px',
    background: '#283618',
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLinksOpen: {},
  navLink: {
    fontWeight: 500,
    color: '#606c38',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'color 0.2s',
  },

  // Hero
  hero: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '700px',
    padding: '80px 40px',
    background: '#fffdf5',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  heroContent: {
    maxWidth: '800px',
    position: 'relative' as const,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 6vw, 5rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '24px',
    color: '#283618',
    letterSpacing: '-0.03em',
  },
  heroSubtitle: {
    fontSize: '22px',
    lineHeight: 1.7,
    marginBottom: '40px',
    color: '#606c38',
    maxWidth: '600px',
    margin: '0 auto 40px',
  },
  heroButtons: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '16px',
  },

  // Card
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '320px',
    background: '#ffffff',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(40, 54, 24, 0.08)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardImage: {
    height: '240px',
    background: '#f5f2e8',
    position: 'relative' as const,
  },
  cardContent: {
    padding: '32px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#283618',
  },
  cardDescription: {
    fontSize: '16px',
    color: '#606c38',
    marginBottom: '24px',
    lineHeight: 1.7,
  },
  cardLink: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#d4a373',
    textDecoration: 'none',
    borderBottom: '2px solid #d4a373',
    paddingBottom: '2px',
  },

  // Feature
  feature: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    textAlign: 'left' as const,
    padding: '40px',
    background: '#fffdf5',
    borderRadius: '24px',
    border: '1px solid transparent',
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f2e8',
    borderRadius: '16px',
    color: '#283618',
    fontSize: '24px',
    marginBottom: '24px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#283618',
  },
  featureDescription: {
    fontSize: '16px',
    color: '#606c38',
    lineHeight: 1.7,
  },

  // Testimonial
  testimonial: {
    padding: '48px',
    background: '#ffffff',
    borderRadius: '24px',
    border: '1px solid rgba(40, 54, 24, 0.08)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    margin: 0,
  },
  testimonialText: {
    fontSize: '24px',
    fontStyle: 'italic',
    color: '#283618',
    lineHeight: 1.6,
    marginBottom: '32px',
    fontWeight: 300,
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  authorAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '3px solid #e9edc9',
  },
  authorName: {
    display: 'block',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    color: '#283618',
  },
  authorRole: {
    fontSize: '14px',
    color: '#bc6c25',
  },

  // Pricing
  pricing: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '320px',
    padding: '48px',
    background: '#ffffff',
    borderRadius: '24px',
    border: '1px solid rgba(40, 54, 24, 0.08)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  pricingHeader: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  pricingName: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#606c38',
    marginBottom: '8px',
  },
  pricingTagline: {
    fontSize: '14px',
    color: '#bc6c25',
    margin: 0,
  },
  pricingPrice: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  priceCurrency: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#283618',
    verticalAlign: 'top',
  },
  priceAmount: {
    fontSize: '64px',
    fontWeight: 800,
    lineHeight: 1,
    color: '#d4a373',
  },
  pricePeriod: {
    fontSize: '16px',
    color: '#606c38',
  },
  pricingFeatures: {
    width: '100%',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    marginBottom: '32px',
  },
  pricingFeatureItem: {
    padding: '12px 0',
    fontSize: '16px',
    color: '#606c38',
    borderBottom: '1px solid #f3f4f6',
  },
  pricingCta: {
    display: 'block',
    width: '100%',
    padding: '18px',
    textAlign: 'center' as const,
    fontWeight: 600,
    fontSize: '16px',
    color: '#ffffff',
    background: '#283618',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },

  // CTA
  cta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '100px 40px',
    background: '#283618',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  ctaContent: {
    textAlign: 'center' as const,
    maxWidth: '700px',
    position: 'relative' as const,
    zIndex: 1,
  },
  ctaTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 800,
    marginBottom: '24px',
    color: '#f5f2e8',  // Cream text
  },
  ctaDescription: {
    fontSize: '20px',
    marginBottom: '40px',
    color: '#e9edc9',  // Sage text
  },
  ctaButtons: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '16px',
  },

  // Footer
  footer: {
    padding: '80px 40px 40px',
    background: '#f5f2e8',
    borderTop: '1px solid rgba(40, 54, 24, 0.05)',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr repeat(3, 1fr)',
    gap: '48px',
    marginBottom: '64px',
  },
  footerBrand: {},
  footerBrandTitle: {
    fontSize: '24px',
    fontWeight: 800,
    marginBottom: '16px',
    color: '#283618',
  },
  footerBrandText: {
    color: '#606c38',
    lineHeight: 1.6,
  },
  footerLinks: {},
  footerLinksTitle: {
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#283618',
    marginBottom: '24px',
  },
  footerLink: {
    color: '#606c38',
    textDecoration: 'none',
    marginBottom: '12px',
    display: 'block',
    transition: 'color 0.2s',
  },
  footerBottom: {
    paddingTop: '32px',
    borderTop: '1px solid rgba(40, 54, 24, 0.05)',
    textAlign: 'center' as const,
    color: '#bc6c25',
    fontSize: '14px',
  },
  
  // Gallery
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
  },
  galleryItem: {
    aspectRatio: '1',
    background: '#f5f2e8',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.5s ease',
  }
};    WebkitTextFillColor: 'transparent',
  },
  footerBrandText: {
    color: '#9ca3af',
    maxWidth: '280px',
    margin: 0,
  },
  footerLinks: {},
  footerLinksTitle: {
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#9ca3af',
    marginBottom: '16px',
  },
  footerLink: {
    display: 'block',
    fontSize: '16px',
    color: '#d1d5db',
    textDecoration: 'none',
    marginBottom: '12px',
  },
  footerBottom: {
    paddingTop: '32px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center' as const,
    color: '#6b7280',
    fontSize: '14px',
  },

  // Gallery
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    padding: '20px',
  },
  galleryItem: {
    borderRadius: '12px',
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },

  // Form Elements
  formInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    color: '#ffffff',
    background: '#1a1a24',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    outline: 'none',
  },
  formTextarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    color: '#ffffff',
    background: '#1a1a24',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: '120px',
  },
};
${components}
function App() {
  return (
    <div style={styles.app}>
${content || '      {/* Add your content here */}'}
    </div>
  );
}

export default App;
`;
};
