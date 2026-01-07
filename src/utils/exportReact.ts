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
const elementToReact = (element: BuilderElement, indent: number = 4): string => {
    const spaces = ' '.repeat(indent);
    const styleStr = stylesToInline(element.styles);
    const styleAttr = styleStr ? ` style={{ ${styleStr} }}` : '';

    switch (element.type) {
        case 'heading':
            return `${spaces}<h2${styleAttr}>${element.content || 'Heading'}</h2>`;

        case 'text':
            return `${spaces}<p${styleAttr}>${element.content || 'Text content'}</p>`;

        case 'button':
            return `${spaces}<button${styleAttr}>${element.content || 'Button'}</button>`;

        case 'image':
            return `${spaces}<img${styleAttr} src="${element.src || 'https://via.placeholder.com/400'}" alt="${element.name}" />`;

        case 'link':
            return `${spaces}<a${styleAttr} href="${element.href || '#'}">${element.content || 'Link'}</a>`;

        case 'divider':
            return `${spaces}<hr${styleAttr} />`;

        case 'video':
            return `${spaces}<video${styleAttr} src="${element.src || ''}" controls />`;

        case 'embed':
            return `${spaces}<iframe${styleAttr} src="${element.src || ''}" title="${element.name}" />`;

        case 'input':
            return `${spaces}<input${styleAttr} type="text" placeholder="${element.placeholder || ''}" />`;

        case 'textarea':
            return `${spaces}<textarea${styleAttr} placeholder="${element.placeholder || ''}" />`;

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
                return `${spaces}<form${styleAttr}>
${childrenJSX}
${spaces}</form>`;
            }
            return `${spaces}<form${styleAttr} />`;
        }

        default:
            return `${spaces}<div${styleAttr}>{/* ${element.type} */}</div>`;
    }
};

// Check if 3D scene is used
const has3DElements = (elements: BuilderElement[]): boolean => {
    for (const element of elements) {
        if (element.type === 'scene3d') return true;
        if (element.children.length > 0 && has3DElements(element.children)) return true;
    }
    return false;
};

export const generateReactExport = (elements: BuilderElement[]): string => {
    const use3D = has3DElements(elements);

    const imports = use3D
        ? `import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';`
        : '';

    const scene3DComponent = use3D
        ? `
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
`
        : '';

    const content = elements
        .map(element => elementToReact(element))
        .join('\n');

    return `import React from 'react';
${imports}

const globalStyles: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  backgroundColor: '#0a0a0f',
  color: '#f8fafc',
  minHeight: '100vh',
};
${scene3DComponent}
function App() {
  return (
    <div style={globalStyles}>
${content || '      {/* Add your content here */}'}
    </div>
  );
}

export default App;
`;
};
