import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import { useBuilderStore } from './store/useBuilderStore';
import { useBuilderDragDrop } from './hooks/useBuilderDragDrop';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import Toolbar from './components/Toolbar/Toolbar';
import ComponentsSidebar from './components/Sidebar/ComponentsSidebar';
import Canvas from './components/Canvas/Canvas';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import ExportModal from './components/Export/ExportModal';
import './styles/components.css';
import './App.css';

function App() {
  const [showExportModal, setShowExportModal] = useState(false);
  
  const { isPreviewMode } = useBuilderStore();
  
  useKeyboardShortcuts();
  
  const { 
    activeDragType, 
    handleDragStart, 
    handleDragEnd 
  } = useBuilderDragDrop();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const isDarkMode = useBuilderStore(state => state.isDarkMode);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
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
