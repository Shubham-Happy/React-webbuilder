import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../../store/useBuilderStore';
import { VIEWPORT_SIZES } from '../../types';
import CanvasElement from './CanvasElement';
import './Canvas.css';

function Canvas() {
  const { 
    elements, 
    viewport, 
    zoom, 
    isPreviewMode,
    setSelectedId 
  } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas'
  });

  const dimensions = VIEWPORT_SIZES[viewport];
  const scale = zoom / 100;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-container">
        <div
          ref={setNodeRef}
          className={`canvas ${isOver ? 'drag-over' : ''} ${isPreviewMode ? 'preview-mode' : ''}`}
          style={{
            width: dimensions.width,
            minHeight: dimensions.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top center'
          }}
          onClick={handleCanvasClick}
        >
          {elements.length === 0 && !isPreviewMode && (
            <div className="canvas-empty">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12H3M12 3v18M7.5 7.5L3 12l4.5 4.5M16.5 7.5L21 12l-4.5 4.5" />
                </svg>
              </div>
              <h3>Start Building</h3>
              <p>Drag components from the sidebar to begin</p>
            </div>
          )}
          
          {elements.map((element) => (
            <CanvasElement 
              key={element.id} 
              element={element} 
            />
          ))}
        </div>
      </div>
      
      <div className="canvas-info">
        <span>{dimensions.label}</span>
        <span>{dimensions.width} × {dimensions.height}</span>
      </div>
    </div>
  );
}

export default Canvas;
