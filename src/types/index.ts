// Element Types for the Website Builder

export type ElementType =
    // Layout
    | 'container'
    | 'section'
    | 'flexbox'
    | 'grid'
    // Basic
    | 'heading'
    | 'text'
    | 'button'
    | 'image'
    | 'link'
    | 'divider'
    // Media
    | 'video'
    | 'embed'
    // 3D
    | 'scene3d'
    | 'box3d'
    | 'sphere3d'
    | 'torus3d'
    // Forms
    | 'input'
    | 'textarea'
    | 'form';

export interface ElementStyles {
    // Layout
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;

    // Sizing
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;

    // Spacing
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    margin?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;

    // Position
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textDecoration?: string;
    textTransform?: string;

    // Colors
    color?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;

    // Border
    border?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;

    // Effects
    boxShadow?: string;
    opacity?: string;
    transform?: string;
    transition?: string;

    // Overflow
    overflow?: string;
    overflowX?: string;
    overflowY?: string;

    // Cursor
    cursor?: string;
}

export interface Element3DProps {
    // Position
    positionX?: number;
    positionY?: number;
    positionZ?: number;

    // Rotation
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;

    // Scale
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;

    // Material
    color?: string;
    metalness?: number;
    roughness?: number;
    wireframe?: boolean;

    // Animation
    animate?: boolean;
    animationSpeed?: number;
}

export interface BuilderElement {
    id: string;
    type: ElementType;
    name: string;
    content?: string;
    src?: string;
    href?: string;
    placeholder?: string;
    styles: ElementStyles;
    props3d?: Element3DProps;
    children: BuilderElement[];
    isLocked?: boolean;
    isVisible?: boolean;
}

export interface DragItem {
    type: ElementType;
    isNew?: boolean;
    elementId?: string;
}

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export interface ViewportDimensions {
    width: number;
    height: number;
    label: string;
}

export const VIEWPORT_SIZES: Record<ViewportSize, ViewportDimensions> = {
    desktop: { width: 1440, height: 900, label: 'Desktop' },
    tablet: { width: 768, height: 1024, label: 'Tablet' },
    mobile: { width: 375, height: 812, label: 'Mobile' }
};

// Component definitions for the sidebar
export interface ComponentDefinition {
    type: ElementType;
    label: string;
    icon: string;
    category: 'layout' | 'basic' | 'media' | '3d' | 'forms';
    defaultStyles: ElementStyles;
    defaultContent?: string;
    default3DProps?: Element3DProps;
}

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
    // Layout
    {
        type: 'container',
        label: 'Container',
        icon: 'Square',
        category: 'layout',
        defaultStyles: {
            width: '100%',
            padding: '20px',
            backgroundColor: 'transparent'
        }
    },
    {
        type: 'section',
        label: 'Section',
        icon: 'Layers',
        category: 'layout',
        defaultStyles: {
            width: '100%',
            minHeight: '200px',
            padding: '40px 20px',
            backgroundColor: '#1a1a24'
        }
    },
    {
        type: 'flexbox',
        label: 'Flexbox',
        icon: 'LayoutGrid',
        category: 'layout',
        defaultStyles: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: '16px',
            width: '100%',
            minHeight: '100px',
            padding: '16px'
        }
    },
    {
        type: 'grid',
        label: 'Grid',
        icon: 'Grid3X3',
        category: 'layout',
        defaultStyles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            width: '100%',
            minHeight: '100px',
            padding: '16px'
        }
    },

    // Basic
    {
        type: 'heading',
        label: 'Heading',
        icon: 'Type',
        category: 'basic',
        defaultStyles: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2'
        },
        defaultContent: 'Heading'
    },
    {
        type: 'text',
        label: 'Text',
        icon: 'AlignLeft',
        category: 'basic',
        defaultStyles: {
            fontSize: '16px',
            fontWeight: '400',
            color: '#94a3b8',
            lineHeight: '1.6'
        },
        defaultContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
        type: 'button',
        label: 'Button',
        icon: 'MousePointer2',
        category: 'basic',
        defaultStyles: {
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff',
            backgroundColor: '#6366f1',
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease'
        },
        defaultContent: 'Click Me'
    },
    {
        type: 'image',
        label: 'Image',
        icon: 'Image',
        category: 'basic',
        defaultStyles: {
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            borderRadius: '8px'
        }
    },
    {
        type: 'link',
        label: 'Link',
        icon: 'Link',
        category: 'basic',
        defaultStyles: {
            fontSize: '16px',
            color: '#6366f1',
            textDecoration: 'none',
            cursor: 'pointer'
        },
        defaultContent: 'Click here'
    },
    {
        type: 'divider',
        label: 'Divider',
        icon: 'Minus',
        category: 'basic',
        defaultStyles: {
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            margin: '20px 0'
        }
    },

    // Media
    {
        type: 'video',
        label: 'Video',
        icon: 'Video',
        category: 'media',
        defaultStyles: {
            width: '100%',
            maxWidth: '800px',
            borderRadius: '12px'
        }
    },
    {
        type: 'embed',
        label: 'Embed',
        icon: 'Code',
        category: 'media',
        defaultStyles: {
            width: '100%',
            height: '400px',
            border: 'none',
            borderRadius: '8px'
        }
    },

    // 3D
    {
        type: 'scene3d',
        label: '3D Scene',
        icon: 'Box',
        category: '3d',
        defaultStyles: {
            width: '100%',
            height: '400px',
            borderRadius: '12px',
            overflow: 'hidden'
        }
    },
    {
        type: 'box3d',
        label: '3D Box',
        icon: 'Boxes',
        category: '3d',
        defaultStyles: {},
        default3DProps: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            color: '#6366f1',
            metalness: 0.5,
            roughness: 0.5,
            wireframe: false,
            animate: true,
            animationSpeed: 1
        }
    },
    {
        type: 'sphere3d',
        label: '3D Sphere',
        icon: 'Circle',
        category: '3d',
        defaultStyles: {},
        default3DProps: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            color: '#8b5cf6',
            metalness: 0.5,
            roughness: 0.5,
            wireframe: false,
            animate: true,
            animationSpeed: 1
        }
    },
    {
        type: 'torus3d',
        label: '3D Torus',
        icon: 'Donut',
        category: '3d',
        defaultStyles: {},
        default3DProps: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            color: '#a855f7',
            metalness: 0.5,
            roughness: 0.5,
            wireframe: false,
            animate: true,
            animationSpeed: 1
        }
    },

    // Forms
    {
        type: 'input',
        label: 'Input',
        icon: 'TextCursor',
        category: 'forms',
        defaultStyles: {
            width: '100%',
            maxWidth: '300px',
            padding: '12px 16px',
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#1a1a24',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
        }
    },
    {
        type: 'textarea',
        label: 'Textarea',
        icon: 'FileText',
        category: 'forms',
        defaultStyles: {
            width: '100%',
            maxWidth: '400px',
            minHeight: '120px',
            padding: '12px 16px',
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#1a1a24',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
        }
    },
    {
        type: 'form',
        label: 'Form',
        icon: 'FileInput',
        category: 'forms',
        defaultStyles: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            backgroundColor: '#12121a',
            borderRadius: '12px'
        }
    }
];
