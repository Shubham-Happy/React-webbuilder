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
    return `${element.type}-${element.id.slice(0, 8)}`;
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
            return `${spaces}<img class="${className}" src="${element.src || 'https://via.placeholder.com/400'}" alt="${element.name}" />`;

        case 'link':
            return `${spaces}<a class="${className}" href="${element.href || '#'}">${element.content || 'Link'}</a>`;

        case 'divider':
            return `${spaces}<hr class="${className}" />`;

        case 'video':
            return `${spaces}<video class="${className}" src="${element.src || ''}" controls></video>`;

        case 'embed':
            return `${spaces}<iframe class="${className}" src="${element.src || ''}" title="${element.name}"></iframe>`;

        case 'input':
            return `${spaces}<input class="${className}" type="text" placeholder="${element.placeholder || ''}" />`;

        case 'textarea':
            return `${spaces}<textarea class="${className}" placeholder="${element.placeholder || ''}"></textarea>`;

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
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
${bodyContent || '  <!-- Add your content here -->'}
</body>
</html>`;
};

export const generateCSSExport = (elements: BuilderElement[]): string => {
    const resetCSS = `/* Reset & Base Styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #ffffff;
  color: #283618;
  line-height: 1.5;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
}

a {
  color: inherit;
  text-decoration: none;
}

img, video {
  max-width: 100%;
  display: block;
}`;

    const elementCSS = elements
        .map(element => elementToCSS(element))
        .filter(Boolean)
        .join('\n\n');

    return `${resetCSS}\n\n/* Element Styles */\n${elementCSS}`;
};
