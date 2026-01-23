import { useState } from 'react';
import { 
    ChevronDown, 
    ChevronRight, 
    Eye, 
    EyeOff, 
    Lock, 
    Unlock,
    Layers,
    Trash2,
    Copy,
    GripVertical
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useBuilderStore } from '../../store/useBuilderStore';
import { BuilderElement } from '../../types';
import './LayersPanel.css';

interface LayerItemProps {
    element: BuilderElement;
    depth: number;
}

function LayerItem({ element, depth }: LayerItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    
    const selectedIds = useBuilderStore(state => state.selectedIds);
    const toggleSelection = useBuilderStore(state => state.toggleSelection);
    const updateElement = useBuilderStore(state => state.updateElement);
    const deleteElement = useBuilderStore(state => state.deleteElement);
    const duplicateElement = useBuilderStore(state => state.duplicateElement);
    
    const isSelected = selectedIds.includes(element.id);
    const hasChildren = element.children.length > 0;
    
    const handleToggleVisibility = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateElement(element.id, { isVisible: !element.isVisible });
    };
    
    const handleToggleLock = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateElement(element.id, { isLocked: !element.isLocked });
    };
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElement(element.id);
    };
    
    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateElement(element.id);
    };

    return (
        <div className="layer-item-wrapper">
            <div 
                className={`layer-item ${isSelected ? 'selected' : ''} ${!element.isVisible ? 'hidden' : ''} ${element.isLocked ? 'locked' : ''}`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={(e) => {
                    toggleSelection(element.id, e.shiftKey || e.ctrlKey || e.metaKey);
                }}
            >
                <div className="layer-left">
                    <span className="layer-grip">
                        <GripVertical size={12} />
                    </span>
                    
                    {hasChildren && (
                        <button 
                            className="expand-btn"
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}
                    
                    <span className="layer-type">{element.type}</span>
                    <span className="layer-name">{element.name}</span>
                </div>
                
                <div className="layer-actions">
                    <button 
                        className={`action-btn ${!element.isVisible ? 'active' : ''}`}
                        onClick={handleToggleVisibility}
                        title={element.isVisible ? 'Hide' : 'Show'}
                    >
                        {element.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button 
                        className={`action-btn ${element.isLocked ? 'active' : ''}`}
                        onClick={handleToggleLock}
                        title={element.isLocked ? 'Unlock' : 'Lock'}
                    >
                        {element.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <button 
                        className="action-btn"
                        onClick={handleDuplicate}
                        title="Duplicate"
                    >
                        <Copy size={12} />
                    </button>
                    <button 
                        className="action-btn delete"
                        onClick={handleDelete}
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
            
            {hasChildren && isExpanded && (
                <div className="layer-children">
                    {element.children.map(child => (
                        <LayerItem key={child.id} element={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

function LayersPanel() {
    const [isExpanded, setIsExpanded] = useState(true);
    const elements = useBuilderStore(useShallow(state => state.elements));

    return (
        <div className="layers-panel">
            <div 
                className="layers-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Layers size={16} />
                <span>Layers</span>
                <span className="layers-count">{elements.length}</span>
            </div>
            
            {isExpanded && (
                <div className="layers-list">
                    {elements.length === 0 ? (
                        <div className="layers-empty">
                            <p>No elements yet</p>
                            <span>Drag components to the canvas</span>
                        </div>
                    ) : (
                        elements.map(element => (
                            <LayerItem key={element.id} element={element} depth={0} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default LayersPanel;
