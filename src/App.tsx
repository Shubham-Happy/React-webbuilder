import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { useBuilderStore } from './store/useBuilderStore';
import Toolbar from './components/Toolbar/Toolbar';
import ComponentsSidebar from './components/Sidebar/ComponentsSidebar';
import Canvas from './components/Canvas/Canvas';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import ExportModal from './components/Export/ExportModal';
import { ElementType } from './types';
import './App.css';

function App() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);
  
  const { 
    addElement, 
    moveElement,
    isPreviewMode 
  } = useBuilderStore();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.isNew) {
      setActiveDragType(active.data.current.type);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveDragType(null);
    
    if (!over) return;
    
    const isNew = active.data.current?.isNew;
    const type = active.data.current?.type as ElementType;
    
    if (isNew && type) {
      // Adding new element
      const parentId = over.id === 'canvas' ? null : String(over.id);
      addElement(type, parentId);
    } else if (active.data.current?.elementId) {
      // Moving existing element
      const dragId = active.data.current.elementId;
      const targetId = over.id === 'canvas' ? null : String(over.id);
      const position = over.data.current?.position || 'inside';
      
      if (dragId !== targetId) {
        moveElement(dragId, targetId, position);
      }
    }
  }, [addElement, moveElement]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <div className="app">
        <Toolbar onExport={() => setShowExportModal(true)} />
        
        <div className="app-main">
          {!isPreviewMode && <ComponentsSidebar />}
          <Canvas />
          {!isPreviewMode && <PropertiesPanel />}
        </div>
        
        <DragOverlay>
          {activeDragType && (
            <div className="drag-overlay">
              <span>{activeDragType}</span>
            </div>
          )}
        </DragOverlay>
        
        {showExportModal && (
          <ExportModal onClose={() => setShowExportModal(false)} />
        )}
      </div>
    </DndContext>
  );
}

export default App;
