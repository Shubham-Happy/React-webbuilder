import { 
  Undo2, 
  Redo2, 
  Eye, 
  EyeOff, 
  Download, 
  Monitor, 
  Tablet, 
  Smartphone,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ViewportSize } from '../../types';
import './Toolbar.css';

interface ToolbarProps {
  onExport: () => void;
}

function Toolbar({ onExport }: ToolbarProps) {
  const viewport = useBuilderStore(state => state.viewport);
  const zoom = useBuilderStore(state => state.zoom);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const isDarkMode = useBuilderStore(state => state.isDarkMode);
  const historyIndex = useBuilderStore(state => state.historyIndex);
  const historyLength = useBuilderStore(state => state.history.length);

  const setViewport = useBuilderStore(state => state.setViewport);
  const setZoom = useBuilderStore(state => state.setZoom);
  const setPreviewMode = useBuilderStore(state => state.setPreviewMode);
  const toggleTheme = useBuilderStore(state => state.toggleTheme);
  const undo = useBuilderStore(state => state.undo);
  const redo = useBuilderStore(state => state.redo);

  const viewportOptions: { value: ViewportSize; icon: typeof Monitor; label: string }[] = [
    { value: 'desktop', icon: Monitor, label: 'Desktop' },
    { value: 'tablet', icon: Tablet, label: 'Tablet' },
    { value: 'mobile', icon: Smartphone, label: 'Mobile' }
  ];

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-logo">
          <Sparkles className="logo-icon" />
          <span className="logo-text">WebCraft</span>
        </div>
      </div>

      <div className="toolbar-center">
        <div className="toolbar-group">
          <button 
            className="toolbar-btn" 
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>
          <button 
            className="toolbar-btn" 
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={18} />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group viewport-group">
          {viewportOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              className={`toolbar-btn ${viewport === value ? 'active' : ''}`}
              onClick={() => setViewport(value)}
              title={label}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group zoom-group">
          <button 
            className="toolbar-btn" 
            onClick={() => setZoom(zoom - 10)}
            disabled={zoom <= 25}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="zoom-value">{zoom}%</span>
          <button 
            className="toolbar-btn" 
            onClick={() => setZoom(zoom + 10)}
            disabled={zoom >= 200}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        <button
          className="toolbar-btn"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button 
          className={`toolbar-btn preview-btn ${isPreviewMode ? 'active' : ''}`}
          onClick={() => setPreviewMode(!isPreviewMode)}
          title={isPreviewMode ? 'Exit Preview' : 'Preview'}
        >
          {isPreviewMode ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
        </button>
        
        <button className="toolbar-btn export-btn" onClick={onExport}>
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}

export default Toolbar;
