import { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useBuilderStore } from '../../store/useBuilderStore';
import { BuilderElement } from '../../types';
import './CanvasElement.css';

import { ComponentRegistry, ContainerTypes, Primitive3DTypes } from '../../utils/component-registry';

interface CanvasElementProps {
  element: BuilderElement;
}

function CanvasElement({ element }: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  
  const selectedIds = useBuilderStore(state => state.selectedIds);
  const hoveredId = useBuilderStore(state => state.hoveredId);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const toggleSelection = useBuilderStore(state => state.toggleSelection);
  const setHoveredId = useBuilderStore(state => state.setHoveredId);

  const isSelected = selectedIds.includes(element.id);
  const isHovered = hoveredId === element.id;
  const isContainer = ContainerTypes.includes(element.type);

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
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
          toggleSelection(element.id, true);
      } else {
          toggleSelection(element.id, false);
      }
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
    const Component = ComponentRegistry[element.type];
    
    if (Component) {
      return <Component element={element} style={element.styles as React.CSSProperties} />;
    }
    
    // Container types render children below, so they return null here
    if (isContainer) return null;
    
    return <div>{element.type}</div>;
  };

  // For 3D primitives, they should only be inside scene3d
  if (Primitive3DTypes.includes(element.type)) {
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
      onFocus={(e) => {
        if (!isPreviewMode) {
          e.stopPropagation();
          toggleSelection(element.id, false);
        }
      }}
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
