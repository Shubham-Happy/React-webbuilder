# WebCraft Studio - Professional Website Builder

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.0-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Zustand-4.4-orange" alt="Zustand" />
  <img src="https://img.shields.io/badge/dnd--kit-Core-yellow" alt="dnd-kit" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</div>

<div align="center">
  <h3>🚀 Build stunning websites with drag-and-drop simplicity</h3>
  <p>A professional-grade, Wix-like website builder that empowers anyone to create beautiful, responsive websites without coding. Features a modern UI, powerful state management, and clean code export.</p>
</div>

---

## ✨ Features

### 🎨 **Visual Builder & Design**
- **Intuitive Drag & Drop**: Based on `@dnd-kit`, offering collision detection and sortable containers.
- **Real-time Preview**: Instantly see how your site looks as you build.
- **Responsive Design Tools**: Switch viewports between **Desktop**, **Tablet**, and **Mobile** to ensure your site looks great everywhere.
- **Dark/Light Mode**: Fully supported UI theme for your preferred building environment.
- **Zoom & Pan**: Canvas controls for detailed editing (25% - 200% zoom).
- **History Management**: Robust **Undo/Redo** system (Ctrl+Z / Ctrl+Y) powered by structured clones for performance.
- **Multi-Selection**: Hold `Shift` to select and manipulate multiple elements at once.

### 📦 **Rich Component Ecosystem**
A comprehensive library of professional components ready to drop onto your canvas:

- **Structure**: `Container`, `Section`, `Flexbox`, `Grid`, `Divider`, `Spacer`
- **Typography**: `Heading` (H1-H6), `Text` (Paragraphs), `Link`
- **Media**: `Image` (with placeholder), `Video`, `Embed` (iFrames), `Gallery`
- **Forms**: `Input`, `Textarea`, `Form` Container
- **Professional Sections**:
  - **Navbar**: Responsive navigation with brand and links.
  - **Hero**: High-impact landing sections with Call-to-Actions.
  - **Features**: Icon-highlighted feature blocks.
  - **Cards**: Content cards with images and actions.
  - **Testimonials**: Customer review blocks with avatars.
  - **Pricing**: Subscription and pricing tables.
  - **CTA**: Dedicated Call-to-Action sections.
  - **Footer**: Multi-column footer layouts.
- **3D Elements**: Integration with **Three.js** via `@react-three/fiber`:
  - `Scene 3D`, `3D Box`, `3D Sphere`, `3D Torus`.

### 🛠️ **Power User Tools**
- **Layers Panel**: Photoshop-style tree view to manage element hierarchy, visibility, and locking.
- **Pages Panel**: Create multi-page websites, manage routes, rename or delete pages.
- **Code Export**: 
  - **Export to React**: Generates a full Vite + React project.
  - **Export to HTML/CSS**: Generates vanilla HTML and CSS files.
  - **ZIP Download**: Get a deploy-ready project package.

### ⚡ **Technical Highlights**
- **State Management**: Scalable architecture using **Zustand** with slice pattern (`elementsSlice`, `historySlice`, `uiSlice`, `pagesSlice`).
- **Performance**: Optimized rendering with selective state subscriptions and `useShallow`.
- **Type Safety**: Strictly typed with **TypeScript**, utilizing comprehensive interfaces and type guards.
- **Component Registry**: Extensible pattern (`component-registry.tsx`) making it easy to add new components.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webcraft-studio.git
   cd webcraft-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Visit `http://localhost:5173` to start building!

### Build for Production
To create an optimized build for deployment:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🎮 Controls & Shortcuts

| Shortcut | Action |
|----------|--------|
| `Drag & Drop` | Move elements from sidebar to canvas or reorder |
| `Click` | Select an element to edit properties |
| `Shift + Click` | Add to selection (Multi-select) |
| `Delete` / `Backspace` | Remove selected element(s) |
| `Ctrl + D` | Duplicate selected element(s) |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` / `Shift + Z` | Redo action |
| `+/-` | Zoom canvas In/Out (via toolbar) |

---

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── 3D/             # Three.js wrapper components
│   ├── Canvas/         # Main editing area (Droppable)
│   ├── Layers/         # Element hierarchy panel
│   ├── Pages/          # Page management
│   ├── Properties/     # Right-side property editor
│   ├── Sidebar/        # Draggable component library
│   └── Toolbar/        # Top navigation (Zoom, Export, Theme)
├── hooks/              # Custom React Hooks
│   ├── useBuilderDragDrop.ts  # Core DnD logic
│   ├── useKeyboardShortcuts.ts # Hotkey management
├── store/              # Global State (Zustand)
│   ├── slices/         # State modules (elements, history, pages, ui)
│   └── useBuilderStore.ts # Store entry point
├── styles/             # Global CSS & Variables
├── types/              # TypeScript Interfaces
└── utils/              # Helpers
    ├── component-registry.tsx # Map of element types to React components
    └── export*.ts      # Export logic for HTML/React
```

---

## 🤝 Contributing

Contributions are welcome! This project uses a modular architecture to make it easy to extend.

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
