import { BuilderElement, ElementStyles } from '../types';

// Convert camelCase to kebab-case
const camelToKebab = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Convert styles object to CSS string
const stylesToCSS = (styles: ElementStyles): string => {
    return Object.entries(styles)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
        .join('\n');
};

// Generate unique class name
const generateClassName = (element: BuilderElement): string => {
    return `wc-${element.type}-${element.id.slice(0, 8)}`;
};

// Generate HTML for an element
const elementToHTML = (element: BuilderElement, indent: number = 2): string => {
    const spaces = ' '.repeat(indent);
    const className = generateClassName(element);

    switch (element.type) {
        case 'heading':
            return `${spaces}<h2 class="${className}">${element.content || 'Heading'}</h2>`;

        case 'text':
            return `${spaces}<p class="${className}">${element.content || 'Text content'}</p>`;

        case 'button':
            return `${spaces}<button class="${className}">${element.content || 'Button'}</button>`;

        case 'image':
            return `${spaces}<img class="${className}" src="${element.src || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800'}" alt="${element.name}" loading="lazy" />`;

        case 'link':
            return `${spaces}<a class="${className}" href="${element.href || '#'}">${element.content || 'Link'}</a>`;

        case 'divider':
            return `${spaces}<hr class="${className}" />`;

        case 'spacer':
            return `${spaces}<div class="${className}" aria-hidden="true"></div>`;

        case 'video':
            return `${spaces}<video class="${className}" src="${element.src || ''}" controls></video>`;

        case 'embed':
            return `${spaces}<iframe class="${className}" src="${element.src || ''}" title="${element.name}" loading="lazy"></iframe>`;

        case 'input':
            return `${spaces}<input class="${className}" type="text" placeholder="${element.placeholder || 'Enter text...'}" />`;

        case 'textarea':
            return `${spaces}<textarea class="${className}" placeholder="${element.placeholder || 'Enter text...'}" rows="4"></textarea>`;

        case 'navbar':
            return `${spaces}<nav class="${className}">
${spaces}  <div class="nav-brand">${element.content || 'Brand'}</div>
${spaces}  <button class="nav-toggle" aria-label="Toggle menu">
${spaces}    <span></span><span></span><span></span>
${spaces}  </button>
${spaces}  <ul class="nav-links">
${spaces}    <li><a href="#">Home</a></li>
${spaces}    <li><a href="#">About</a></li>
${spaces}    <li><a href="#">Services</a></li>
${spaces}    <li><a href="#">Contact</a></li>
${spaces}  </ul>
${spaces}</nav>`;

        case 'hero':
            return `${spaces}<section class="${className}">
${spaces}  <div class="hero-content">
${spaces}    <h1 class="hero-title">${element.content || 'Welcome to Your Website'}</h1>
${spaces}    <p class="hero-subtitle">Create stunning experiences with our professional solutions</p>
${spaces}    <div class="hero-buttons">
${spaces}      <a href="#" class="btn btn-primary">Get Started</a>
${spaces}      <a href="#" class="btn btn-secondary">Learn More</a>
${spaces}    </div>
${spaces}  </div>
${spaces}</section>`;

        case 'card':
            return `${spaces}<article class="${className}">
${spaces}  <div class="card-image"></div>
${spaces}  <div class="card-content">
${spaces}    <h3 class="card-title">${element.content || 'Card Title'}</h3>
${spaces}    <p class="card-description">Transform your ideas into reality with our innovative solutions.</p>
${spaces}    <a href="#" class="card-link">Learn more →</a>
${spaces}  </div>
${spaces}</article>`;

        case 'feature':
            return `${spaces}<div class="${className}">
${spaces}  <div class="feature-icon">
${spaces}    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
${spaces}      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
${spaces}    </svg>
${spaces}  </div>
${spaces}  <h3 class="feature-title">${element.content || 'Feature Title'}</h3>
${spaces}  <p class="feature-description">Discover the power of innovation with our cutting-edge solutions.</p>
${spaces}</div>`;

        case 'testimonial':
            return `${spaces}<blockquote class="${className}">
${spaces}  <p class="testimonial-text">${element.content || '"This product completely transformed our business. Highly recommended!"'}</p>
${spaces}  <footer class="testimonial-author">
${spaces}    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Author" class="author-avatar" />
${spaces}    <div class="author-info">
${spaces}      <cite class="author-name">John Anderson</cite>
${spaces}      <span class="author-role">CEO, TechCorp</span>
${spaces}    </div>
${spaces}  </footer>
${spaces}</blockquote>`;

        case 'pricing':
            return `${spaces}<div class="${className}">
${spaces}  <div class="pricing-header">
${spaces}    <h3 class="pricing-name">${element.content || 'Professional'}</h3>
${spaces}    <p class="pricing-tagline">Best for growing businesses</p>
${spaces}  </div>
${spaces}  <div class="pricing-price">
${spaces}    <span class="price-currency">$</span>
${spaces}    <span class="price-amount">49</span>
${spaces}    <span class="price-period">/month</span>
${spaces}  </div>
${spaces}  <ul class="pricing-features">
${spaces}    <li>✓ Unlimited projects</li>
${spaces}    <li>✓ Priority support 24/7</li>
${spaces}    <li>✓ Advanced analytics</li>
${spaces}    <li>✓ Custom integrations</li>
${spaces}    <li>✓ Team collaboration</li>
${spaces}  </ul>
${spaces}  <a href="#" class="pricing-cta">Get Started</a>
${spaces}</div>`;

        case 'cta':
            return `${spaces}<section class="${className}">
${spaces}  <div class="cta-content">
${spaces}    <h2 class="cta-title">${element.content || 'Ready to Transform Your Business?'}</h2>
${spaces}    <p class="cta-description">Join thousands of companies already using our platform to accelerate growth.</p>
${spaces}    <div class="cta-buttons">
${spaces}      <a href="#" class="btn btn-light">Start Free Trial</a>
${spaces}      <a href="#" class="btn btn-outline-light">Schedule Demo</a>
${spaces}    </div>
${spaces}  </div>
${spaces}</section>`;

        case 'footer':
            return `${spaces}<footer class="${className}">
${spaces}  <div class="footer-grid">
${spaces}    <div class="footer-brand">
${spaces}      <h4>${element.content?.split('©')[0]?.trim() || 'Brand'}</h4>
${spaces}      <p>Building the future, one project at a time.</p>
${spaces}      <div class="social-links">
${spaces}        <a href="#" aria-label="Twitter">𝕏</a>
${spaces}        <a href="#" aria-label="LinkedIn">in</a>
${spaces}        <a href="#" aria-label="GitHub">◐</a>
${spaces}      </div>
${spaces}    </div>
${spaces}    <div class="footer-links">
${spaces}      <h5>Product</h5>
${spaces}      <ul>
${spaces}        <li><a href="#">Features</a></li>
${spaces}        <li><a href="#">Pricing</a></li>
${spaces}        <li><a href="#">Integrations</a></li>
${spaces}      </ul>
${spaces}    </div>
${spaces}    <div class="footer-links">
${spaces}      <h5>Company</h5>
${spaces}      <ul>
${spaces}        <li><a href="#">About</a></li>
${spaces}        <li><a href="#">Blog</a></li>
${spaces}        <li><a href="#">Careers</a></li>
${spaces}      </ul>
${spaces}    </div>
${spaces}    <div class="footer-links">
${spaces}      <h5>Support</h5>
${spaces}      <ul>
${spaces}        <li><a href="#">Help Center</a></li>
${spaces}        <li><a href="#">Contact</a></li>
${spaces}        <li><a href="#">Privacy</a></li>
${spaces}      </ul>
${spaces}    </div>
${spaces}  </div>
${spaces}  <div class="footer-bottom">
${spaces}    <p>${element.content || '© 2024 Your Company. All rights reserved.'}</p>
${spaces}  </div>
${spaces}</footer>`;

        case 'gallery':
            return `${spaces}<div class="${className}">
${spaces}  <div class="gallery-item"><img src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400" alt="Gallery 1" loading="lazy" /></div>
${spaces}  <div class="gallery-item"><img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400" alt="Gallery 2" loading="lazy" /></div>
${spaces}  <div class="gallery-item"><img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400" alt="Gallery 3" loading="lazy" /></div>
${spaces}</div>`;

        case 'scene3d':
            return `${spaces}<div class="${className}">
${spaces}  <!-- 3D Scene - Requires Three.js -->
${spaces}  <canvas id="scene-${element.id.slice(0, 8)}"></canvas>
${spaces}</div>`;

        case 'container':
        case 'section':
        case 'flexbox':
        case 'grid':
        case 'form': {
            const tag = element.type === 'section' ? 'section' :
                element.type === 'form' ? 'form' : 'div';
            const childrenHTML = element.children
                .map(child => elementToHTML(child, indent + 2))
                .join('\n');

            if (childrenHTML) {
                return `${spaces}<${tag} class="${className}">
${childrenHTML}
${spaces}</${tag}>`;
            }
            return `${spaces}<${tag} class="${className}"></${tag}>`;
        }

        default:
            return `${spaces}<div class="${className}">${element.type}</div>`;
    }
};

// Generate CSS for an element
const elementToCSS = (element: BuilderElement): string => {
    const className = generateClassName(element);
    const cssRules: string[] = [];

    const styleContent = stylesToCSS(element.styles);
    if (styleContent) {
        cssRules.push(`.${className} {\n${styleContent}\n}`);
    }

    // Recursively get children CSS
    element.children.forEach(child => {
        cssRules.push(elementToCSS(child));
    });

    return cssRules.filter(Boolean).join('\n\n');
};

export const generateHTMLExport = (elements: BuilderElement[]): string => {
    const bodyContent = elements
        .map(element => elementToHTML(element))
        .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Professional website built with WebCraft Studio">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
${bodyContent || '  <!-- Add your content here -->'}

  <script>
    // Mobile navigation toggle
    document.querySelectorAll('.nav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('nav').classList.toggle('nav-open');
      });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section, article, .wc-feature, .wc-card, .wc-testimonial, .wc-pricing').forEach(el => {
      observer.observe(el);
    });
  </script>
</body>
</html>`;
};

export const generateCSSExport = (elements: BuilderElement[]): string => {
    const professionalCSS = `/* ============================================
   PROFESSIONAL WEBSITE STYLES
   Generated by WebCraft Studio
   ============================================ */

/* ==========================================
   CSS CUSTOM PROPERTIES (Design Tokens)
   ========================================== */
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-primary-light: #818cf8;
  --color-secondary: #8b5cf6;
  --color-accent: #06b6d4;
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-black: #030712;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Container */
  --container-max: 1280px;
  --container-padding: 1.5rem;
}

/* ==========================================
   CSS RESET & BASE
   ========================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-gray-800);
  background-color: var(--color-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img, video, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

button {
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}

/* ==========================================
   UTILITY CLASSES
   ========================================== */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* ==========================================
   BUTTONS
   ========================================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: 600;
  line-height: 1.5;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-white);
  box-shadow: var(--shadow-md), 0 0 0 0 rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: var(--color-white);
  color: var(--color-gray-800);
  border: 2px solid var(--color-gray-200);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-light {
  background: var(--color-white);
  color: var(--color-primary);
  font-weight: 600;
}

.btn-light:hover {
  background: var(--color-gray-100);
  transform: translateY(-2px);
}

.btn-outline-light {
  background: transparent;
  color: var(--color-white);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-white);
}

/* ==========================================
   NAVIGATION
   ========================================== */
nav[class*="wc-navbar"] {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-brand {
  font-size: var(--font-size-xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: var(--space-8);
}

.nav-links a {
  font-weight: 500;
  color: var(--color-gray-600);
  transition: color var(--transition-fast);
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.nav-links a:hover {
  color: var(--color-primary);
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-2);
  cursor: pointer;
}

.nav-toggle span {
  width: 24px;
  height: 2px;
  background: var(--color-gray-800);
  transition: all var(--transition-base);
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }
  
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-white);
    padding: var(--space-4);
    gap: var(--space-4);
    box-shadow: var(--shadow-lg);
    transform: translateY(-10px);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
  }
  
  .nav-open .nav-links {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-open .nav-toggle span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav-open .nav-toggle span:nth-child(2) {
    opacity: 0;
  }
  
  .nav-open .nav-toggle span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}

/* ==========================================
   HERO SECTION
   ========================================== */
section[class*="wc-hero"] {
  position: relative;
  overflow: hidden;
}

section[class*="wc-hero"]::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--space-6);
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  line-height: 1.7;
  margin-bottom: var(--space-10);
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* ==========================================
   CARDS
   ========================================== */
article[class*="wc-card"] {
  overflow: hidden;
  transition: all var(--transition-slow);
}

article[class*="wc-card"]:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.card-image {
  height: 200px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  position: relative;
  overflow: hidden;
}

.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.1) 100%);
}

.card-content {
  padding: var(--space-6);
}

.card-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--color-white);
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-400);
  margin-bottom: var(--space-4);
  line-height: 1.7;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary);
  transition: gap var(--transition-fast);
}

.card-link:hover {
  gap: var(--space-3);
}

/* ==========================================
   FEATURES
   ========================================== */
div[class*="wc-feature"] {
  transition: all var(--transition-slow);
}

div[class*="wc-feature"]:hover {
  transform: translateY(-4px);
}

.feature-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-xl);
  color: var(--color-white);
  margin-bottom: var(--space-6);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.feature-icon svg {
  width: 28px;
  height: 28px;
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--color-white);
}

.feature-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-400);
  line-height: 1.7;
}

/* ==========================================
   TESTIMONIALS
   ========================================== */
blockquote[class*="wc-testimonial"] {
  position: relative;
}

blockquote[class*="wc-testimonial"]::before {
  content: '"';
  position: absolute;
  top: -20px;
  left: 20px;
  font-size: 120px;
  font-family: Georgia, serif;
  color: var(--color-primary);
  opacity: 0.2;
  line-height: 1;
}

.testimonial-text {
  font-size: var(--font-size-lg);
  font-style: italic;
  line-height: 1.8;
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 3px solid var(--color-primary);
}

.author-name {
  display: block;
  font-style: normal;
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-white);
}

.author-role {
  font-size: var(--font-size-sm);
  color: var(--color-gray-400);
}

/* ==========================================
   PRICING
   ========================================== */
div[class*="wc-pricing"] {
  position: relative;
  transition: all var(--transition-slow);
}

div[class*="wc-pricing"]:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

.pricing-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.pricing-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: var(--space-2);
}

.pricing-tagline {
  font-size: var(--font-size-sm);
  color: var(--color-gray-400);
}

.pricing-price {
  text-align: center;
  margin-bottom: var(--space-8);
}

.price-currency {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-primary);
  vertical-align: top;
}

.price-amount {
  font-size: var(--font-size-6xl);
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-period {
  font-size: var(--font-size-base);
  color: var(--color-gray-400);
}

.pricing-features {
  margin-bottom: var(--space-8);
}

.pricing-features li {
  padding: var(--space-3) 0;
  font-size: var(--font-size-base);
  color: var(--color-gray-300);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.pricing-features li:last-child {
  border-bottom: none;
}

.pricing-cta {
  display: block;
  width: 100%;
  padding: var(--space-4);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-white);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.pricing-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

/* ==========================================
   CTA SECTION
   ========================================== */
section[class*="wc-cta"] {
  position: relative;
  overflow: hidden;
}

section[class*="wc-cta"]::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse-bg 4s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: var(--space-4);
  color: var(--color-white);
}

.cta-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-8);
  opacity: 0.9;
  color: var(--color-white);
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4);
}

/* ==========================================
   FOOTER
   ========================================== */
footer[class*="wc-footer"] {
  position: relative;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: var(--space-12);
  margin-bottom: var(--space-12);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

.footer-brand h4 {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  margin-bottom: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-brand p {
  color: var(--color-gray-400);
  margin-bottom: var(--space-6);
  max-width: 280px;
}

.social-links {
  display: flex;
  gap: var(--space-3);
}

.social-links a {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  color: var(--color-gray-400);
  font-weight: 600;
  transition: all var(--transition-base);
}

.social-links a:hover {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-2px);
}

.footer-links h5 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-400);
  margin-bottom: var(--space-4);
}

.footer-links ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer-links a {
  font-size: var(--font-size-base);
  color: var(--color-gray-300);
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  padding-top: var(--space-8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.footer-bottom p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

/* ==========================================
   GALLERY
   ========================================== */
div[class*="wc-gallery"] .gallery-item {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-slow);
}

div[class*="wc-gallery"] .gallery-item:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
}

div[class*="wc-gallery"] .gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

div[class*="wc-gallery"] .gallery-item:hover img {
  transform: scale(1.1);
}

/* ==========================================
   ANIMATIONS
   ========================================== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

section, article, div[class*="wc-feature"], div[class*="wc-card"], blockquote[class*="wc-testimonial"], div[class*="wc-pricing"] {
  opacity: 0;
  transform: translateY(30px);
}

section.animate-in, article.animate-in, div[class*="wc-feature"].animate-in, div[class*="wc-card"].animate-in, blockquote[class*="wc-testimonial"].animate-in, div[class*="wc-pricing"].animate-in {
  opacity: 1;
  transform: translateY(0);
}`;

    const elementCSS = elements
        .map(element => elementToCSS(element))
        .filter(Boolean)
        .join('\n\n');

    return `${professionalCSS}\n\n/* ==========================================\n   CUSTOM ELEMENT STYLES\n   ========================================== */\n${elementCSS}`;
};
