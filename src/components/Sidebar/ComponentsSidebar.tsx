import { useDraggable } from '@dnd-kit/core';
import * as Icons from 'lucide-react';
import { COMPONENT_DEFINITIONS, ElementType } from '../../types';
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
        <h2>Components</h2>
        <p>Drag to canvas</p>
      </div>
      
      <div className="sidebar-content">
        {categories.map(category => {
          const components = COMPONENT_DEFINITIONS.filter(c => c.category === category.key);
          const CategoryIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[category.icon] || Icons.Square;
          
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
