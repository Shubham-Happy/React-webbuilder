import { useRef, Suspense } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useBuilderStore } from '../../store/useBuilderStore';
import { BuilderElement } from '../../types';
import Scene3D from '../3D/Scene3D';
import './CanvasElement.css';

interface CanvasElementProps {
  element: BuilderElement;
}

function CanvasElement({ element }: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  const { 
    selectedId, 
    hoveredId,
    isPreviewMode,
    setSelectedId, 
    setHoveredId 
  } = useBuilderStore();

  const isSelected = selectedId === element.id;
  const isHovered = hoveredId === element.id;
  const isContainer = ['container', 'section', 'flexbox', 'grid', 'form', 'scene3d'].includes(element.type);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: element.id,
    disabled: !isContainer || isPreviewMode
  });

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `drag-${element.id}`,
    data: {
      elementId: element.id,
      isNew: false
    },
    disabled: isPreviewMode || element.isLocked
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      setSelectedId(element.id);
    }
  };

  const handleMouseEnter = () => {
    if (!isPreviewMode) {
      setHoveredId(element.id);
    }
  };

  const handleMouseLeave = () => {
    if (!isPreviewMode) {
      setHoveredId(null);
    }
  };

  // Merge refs for container elements
  const setRefs = (node: HTMLDivElement | null) => {
    elementRef.current = node;
    setDragRef(node);
    if (isContainer) {
      setDropRef(node);
    }
  };

  // Render the actual element content
  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        return <h2 style={element.styles as React.CSSProperties}>{element.content || 'Heading'}</h2>;
      
      case 'text':
        return <p style={element.styles as React.CSSProperties}>{element.content || 'Text content'}</p>;
      
      case 'button':
        return (
          <button style={element.styles as React.CSSProperties}>
            {element.content || 'Button'}
          </button>
        );
      
      case 'image':
        return element.src ? (
          <img 
            src={element.src} 
            alt={element.name}
            style={element.styles as React.CSSProperties}
          />
        ) : (
          <div className="image-placeholder" style={element.styles as React.CSSProperties}>
            <span>Image</span>
          </div>
        );
      
      case 'link':
        return (
          <a 
            href={element.href || '#'} 
            style={element.styles as React.CSSProperties}
            onClick={(e) => isPreviewMode ? undefined : e.preventDefault()}
          >
            {element.content || 'Link'}
          </a>
        );
      
      case 'divider':
        return <hr style={element.styles as React.CSSProperties} />;
      
      case 'video':
        return element.src ? (
          <video 
            src={element.src} 
            controls 
            style={element.styles as React.CSSProperties}
          />
        ) : (
          <div className="video-placeholder" style={element.styles as React.CSSProperties}>
            <span>Video</span>
          </div>
        );
      
      case 'embed':
        return element.src ? (
          <iframe 
            src={element.src} 
            style={element.styles as React.CSSProperties}
            title={element.name}
          />
        ) : (
          <div className="embed-placeholder" style={element.styles as React.CSSProperties}>
            <span>Embed URL</span>
          </div>
        );
      
      case 'input':
        return (
          <input 
            type="text"
            placeholder={element.placeholder || 'Enter text...'}
            style={element.styles as React.CSSProperties}
            readOnly={!isPreviewMode}
          />
        );
      
      case 'textarea':
        return (
          <textarea 
            placeholder={element.placeholder || 'Enter text...'}
            style={element.styles as React.CSSProperties}
            readOnly={!isPreviewMode}
          />
        );
      
      case 'scene3d':
        return (
          <Suspense fallback={<div className="loading-3d">Loading 3D...</div>}>
            <Scene3D element={element} />
          </Suspense>
        );
      
      case 'container':
      case 'section':
      case 'flexbox':
      case 'grid':
      case 'form':
        return null; // Container types render children below
      
      default:
        return <div>{element.type}</div>;
    }
  };

  // For 3D primitives, they should only be inside scene3d
  if (['box3d', 'sphere3d', 'torus3d'].includes(element.type)) {
    return null; // 3D primitives are rendered inside Scene3D
  }

  const wrapperStyles: React.CSSProperties = isContainer ? {
    ...element.styles as React.CSSProperties
  } : {};

  return (
    <div
      ref={setRefs}
      className={`canvas-element ${element.type} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''} ${isPreviewMode ? 'preview' : ''}`}
      style={wrapperStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...attributes}
      {...listeners}
    >
      {!isPreviewMode && (isSelected || isHovered) && (
        <div className="element-label">
          {element.name}
        </div>
      )}
      
      {renderContent()}
      
      {/* Render children for container types */}
      {isContainer && element.children.map((child) => (
        <CanvasElement key={child.id} element={child} />
      ))}
      
      {/* Empty container indicator */}
      {isContainer && element.children.length === 0 && !isPreviewMode && element.type !== 'scene3d' && (
        <div className="empty-container">
          Drop elements here
        </div>
      )}
    </div>
  );
}

export default CanvasElement;
