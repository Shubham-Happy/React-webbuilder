
import React, { Suspense } from 'react';
import Scene3D from '../components/3D/Scene3D';
import { ElementType, BuilderElement } from '../types';

// Component interfaces
interface ComponentProps {
    element: BuilderElement;
    style?: React.CSSProperties;
}

// Basic Components
const HeadingComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <h2 style={style}>{element.content || 'Heading'}</h2>
);

const TextComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <p style={style}>{element.content || 'Text content'}</p>
);

const ButtonComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <button style={style} type="button">
        {element.content || 'Button'}
    </button>
);

const ImageComponent: React.FC<ComponentProps> = ({ element, style }) => element.src ? (
    <img
        src={element.src}
        alt={element.name}
        style={style}
    />
) : (
    <div className="image-placeholder" style={style}>
        <span>Image</span>
    </div>
);

const LinkComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <a
        href={element.href || '#'}
        style={style}
        onClick={(e) => e.preventDefault()}
    >
        {element.content || 'Link'}
    </a>
);

const DividerComponent: React.FC<ComponentProps> = ({ style }) => (
    <hr style={style} />
);

const SpacerComponent: React.FC<ComponentProps> = ({ style }) => (
    <div style={style} aria-hidden="true" />
);

// Media Components
const VideoComponent: React.FC<ComponentProps> = ({ element, style }) => element.src ? (
    <video
        src={element.src}
        controls
        style={style}
    />
) : (
    <div className="video-placeholder" style={style}>
        <span>Video</span>
    </div>
);

const EmbedComponent: React.FC<ComponentProps> = ({ element, style }) => element.src ? (
    <iframe
        src={element.src}
        style={style}
        title={element.name}
    />
) : (
    <div className="embed-placeholder" style={style}>
        <span>Embed URL</span>
    </div>
);

// Form Components
const InputComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <input
        type="text"
        placeholder={element.placeholder || 'Enter text...'}
        style={style}
        readOnly
        aria-label={element.name || 'Input field'}
    />
);

const TextareaComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <textarea
        placeholder={element.placeholder || 'Enter text...'}
        style={style}
        readOnly
        aria-label={element.name || 'Textarea field'}
    />
);

// Professional Components
const NavbarComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <nav style={style} className="wc-navbar">
        <div className="navbar-brand">{element.content || 'Brand'}</div>
        <div className="navbar-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Home</a>
            <a href="#" onClick={(e) => e.preventDefault()}>About</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Services</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
        </div>
    </nav>
);

const HeroComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <section style={style} className="wc-hero">
        <h1>{element.content || 'Welcome to Your Website'}</h1>
        <p>Create stunning experiences with our professional solutions</p>
        <div className="wc-hero-buttons">
            <button>Get Started</button>
            <button>Learn More</button>
        </div>
    </section>
);

const CardComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <div style={style} className="wc-card">
        <div className="wc-card-image" />
        <div className="wc-card-content">
            <h3>{element.content || 'Card Title'}</h3>
            <p>Transform your ideas into reality with our innovative solutions.</p>
            <a href="#" onClick={(e) => e.preventDefault()}>Learn more →</a>
        </div>
    </div>
);

const FeatureComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <div style={style} className="wc-feature">
        <div className="wc-feature-icon">★</div>
        <h3>{element.content || 'Feature Title'}</h3>
        <p>Discover the power of innovation with our cutting-edge solutions.</p>
    </div>
);

const CTAComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <section style={style} className="wc-cta">
        <h2>{element.content || 'Ready to Get Started?'}</h2>
        <p>Join thousands of companies already using our platform to accelerate growth.</p>
        <button>Start Free Trial</button>
    </section>
);

const TestimonialComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <div style={style} className="wc-testimonial">
        <p>{element.content || '"This product completely transformed our business. Highly recommended!"'}</p>
        <div className="wc-testimonial-author">
            <div className="wc-testimonial-avatar" />
            <div className="wc-testimonial-info">
                <h4>John Anderson</h4>
                <span>CEO, TechCorp</span>
            </div>
        </div>
    </div>
);

const PricingComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <div style={style} className="wc-pricing">
        <h3>{element.content || 'Professional'}</h3>
        <div className="wc-pricing-price">$49</div>
        <ul>
            <li>✓ Unlimited projects</li>
            <li>✓ Priority support 24/7</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Custom integrations</li>
        </ul>
        <button>Get Started</button>
    </div>
);

const FooterComponent: React.FC<ComponentProps> = ({ element, style }) => (
    <footer style={style} className="wc-footer">
        <div className="wc-footer-grid">
            <div>
                <h4>Brand</h4>
                <p>Building the future, one project at a time.</p>
            </div>
            <div>
                <h5>Product</h5>
                <ul>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Features</a></li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Pricing</a></li>
                </ul>
            </div>
            <div>
                <h5>Company</h5>
                <ul>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>About</a></li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Careers</a></li>
                </ul>
            </div>
            <div>
                <h5>Support</h5>
                <ul>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Help</a></li>
                    <li><a href="#" onClick={(e) => e.preventDefault()}>Contact</a></li>
                </ul>
            </div>
        </div>
        <div>
            <p>{element.content || '© 2024 Your Company. All rights reserved.'}</p>
        </div>
    </footer>
);

const GalleryComponent: React.FC<ComponentProps> = ({ style }) => (
    <div style={style} className="wc-gallery">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="wc-gallery-item">
                <img src={`https://images.unsplash.com/photo-${1550000000000 + i}?w=400`} alt="Gallery" />
            </div>
        ))}
    </div>
);

// 3D Components
const Scene3DComponent: React.FC<ComponentProps> = ({ element }) => (
    <Suspense fallback={<div className="loading-3d">Loading 3D...</div>}>
        <Scene3D element={element} />
    </Suspense>
);

// Registry Map
export const ComponentRegistry: Partial<Record<ElementType, React.FC<ComponentProps>>> = {
    heading: HeadingComponent,
    text: TextComponent,
    button: ButtonComponent,
    image: ImageComponent,
    link: LinkComponent,
    divider: DividerComponent,
    spacer: SpacerComponent,
    video: VideoComponent,
    embed: EmbedComponent,
    input: InputComponent,
    textarea: TextareaComponent,
    scene3d: Scene3DComponent,
    // Professional Components
    navbar: NavbarComponent,
    hero: HeroComponent,
    card: CardComponent,
    feature: FeatureComponent,
    cta: CTAComponent,
    testimonial: TestimonialComponent,
    pricing: PricingComponent,
    footer: FooterComponent,
    gallery: GalleryComponent
};

export const ContainerTypes: ElementType[] = [
    'container', 
    'section', 
    'flexbox', 
    'grid', 
    'form', 
    'scene3d',
    'navbar',
    'hero',
    'cta',
    'footer',
    'gallery'
];

export const Primitive3DTypes: ElementType[] = [
    'box3d', 
    'sphere3d', 
    'torus3d'
];

