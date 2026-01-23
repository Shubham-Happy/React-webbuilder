import { useDraggable } from '@dnd-kit/core';
import * as Icons from 'lucide-react';
import { COMPONENT_DEFINITIONS, ElementType } from '../../types';
import PagesPanel from '../Pages/PagesPanel';
import LayersPanel from '../Layers/LayersPanel';
import './ComponentsSidebar.css';

interface DraggableComponentProps {
  type: ElementType;
  label: string;
  iconName: string;
}

function DraggableComponent({ type, label, iconName }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type,
      isNew: true
    }
  });

  // Get icon component dynamically
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[iconName] || Icons.Square;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`component-item ${isDragging ? 'dragging' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Add ${label} component`}
    >
      <div className="component-icon">
        <IconComponent size={20} />
      </div>
      <span className="component-label">{label}</span>
    </div>
  );
}

const categories = [
  { key: 'layout', label: 'Layout', icon: 'Layout' },
  { key: 'basic', label: 'Basic', icon: 'Type' },
  { key: 'media', label: 'Media', icon: 'Image' },
  { key: '3d', label: '3D Elements', icon: 'Box' },
  { key: 'forms', label: 'Forms', icon: 'FileInput' }
] as const;

function ComponentsSidebar() {
  return (
    <aside className="components-sidebar">
      <div className="sidebar-header">
        <h2>WebCraft Studio</h2>
        <p>Build your dream website</p>
      </div>
      
      <PagesPanel />
      <LayersPanel />
      
      <div className="sidebar-content">
        <div className="sidebar-section-title">
          <Icons.Puzzle size={14} />
          <span>Components</span>
        </div>
        
        {categories.map(category => {
          const components = COMPONENT_DEFINITIONS.filter(c => c.category === category.key);
          const CategoryIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[category.icon] || Icons.Square;
          
          if (components.length === 0) return null;
          
          return (
            <div key={category.key} className="component-category">
              <div className="category-header">
                <CategoryIcon size={16} />
                <span>{category.label}</span>
              </div>
              <div className="component-grid">
                {components.map(component => (
                  <DraggableComponent
                    key={component.type}
                    type={component.type}
                    label={component.label}
                    iconName={component.icon}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ComponentsSidebar;

