import { useState } from 'react';
import { Trash2, Copy, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ElementStyles } from '../../types';
import './PropertiesPanel.css';

type TabType = 'style' | 'layout' | 'content';

function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('style');
  
  const { 
    selectedId, 
    getElementById, 
    updateElement,
    deleteElement,
    duplicateElement 
  } = useBuilderStore();

  const element = selectedId ? getElementById(selectedId) : null;

  if (!element) {
    return (
      <aside className="properties-panel">
        <div className="properties-empty">
          <p>Select an element to edit its properties</p>
        </div>
      </aside>
    );
  }

  const handleStyleChange = (property: keyof ElementStyles, value: string) => {
    updateElement(element.id, {
      styles: { ...element.styles, [property]: value }
    });
  };

  const handleContentChange = (value: string) => {
    updateElement(element.id, { content: value });
  };

  const handleNameChange = (value: string) => {
    updateElement(element.id, { name: value });
  };

  const handleToggleLock = () => {
    updateElement(element.id, { isLocked: !element.isLocked });
  };

  const handleToggleVisibility = () => {
    updateElement(element.id, { isVisible: !element.isVisible });
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'style', label: 'Style' },
    { key: 'layout', label: 'Layout' },
    { key: 'content', label: 'Content' }
  ];

  return (
    <aside className="properties-panel">
      <div className="properties-header">
        <input
          type="text"
          value={element.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="element-name-input"
        />
        <div className="header-actions">
          <button 
            className={`action-btn ${element.isLocked ? 'active' : ''}`}
            onClick={handleToggleLock}
            title={element.isLocked ? 'Unlock' : 'Lock'}
          >
            {element.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          <button 
            className={`action-btn ${!element.isVisible ? 'active' : ''}`}
            onClick={handleToggleVisibility}
            title={element.isVisible ? 'Hide' : 'Show'}
          >
            {element.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button 
            className="action-btn"
            onClick={() => duplicateElement(element.id)}
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => deleteElement(element.id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="properties-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="properties-content">
        {activeTab === 'style' && (
          <div className="properties-section">
            <div className="property-group">
              <h4>Colors</h4>
              <div className="property-row">
                <label>Text Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={element.styles.color || '#ffffff'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                  />
                  <input
                    type="text"
                    value={element.styles.color || ''}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="property-row">
                <label>Background</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={element.styles.backgroundColor || '#000000'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={element.styles.backgroundColor || ''}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    placeholder="transparent"
                  />
                </div>
              </div>
            </div>

            <div className="property-group">
              <h4>Typography</h4>
              <div className="property-row">
                <label>Font Size</label>
                <input
                  type="text"
                  value={element.styles.fontSize || ''}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  placeholder="16px"
                />
              </div>
              <div className="property-row">
                <label>Font Weight</label>
                <select
                  value={element.styles.fontWeight || ''}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                </select>
              </div>
              <div className="property-row">
                <label>Text Align</label>
                <select
                  value={element.styles.textAlign || ''}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="property-group">
              <h4>Border</h4>
              <div className="property-row">
                <label>Border Radius</label>
                <input
                  type="text"
                  value={element.styles.borderRadius || ''}
                  onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                  placeholder="0px"
                />
              </div>
              <div className="property-row">
                <label>Border</label>
                <input
                  type="text"
                  value={element.styles.border || ''}
                  onChange={(e) => handleStyleChange('border', e.target.value)}
                  placeholder="1px solid #333"
                />
              </div>
            </div>

            <div className="property-group">
              <h4>Effects</h4>
              <div className="property-row">
                <label>Box Shadow</label>
                <input
                  type="text"
                  value={element.styles.boxShadow || ''}
                  onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                  placeholder="0 4px 6px rgba(0,0,0,0.1)"
                />
              </div>
              <div className="property-row">
                <label>Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={element.styles.opacity || '1'}
                  onChange={(e) => handleStyleChange('opacity', e.target.value)}
                />
                <span className="range-value">{element.styles.opacity || '1'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="properties-section">
            <div className="property-group">
              <h4>Size</h4>
              <div className="property-row">
                <label>Width</label>
                <input
                  type="text"
                  value={element.styles.width || ''}
                  onChange={(e) => handleStyleChange('width', e.target.value)}
                  placeholder="auto"
                />
              </div>
              <div className="property-row">
                <label>Height</label>
                <input
                  type="text"
                  value={element.styles.height || ''}
                  onChange={(e) => handleStyleChange('height', e.target.value)}
                  placeholder="auto"
                />
              </div>
              <div className="property-row">
                <label>Min Height</label>
                <input
                  type="text"
                  value={element.styles.minHeight || ''}
                  onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="property-row">
                <label>Max Width</label>
                <input
                  type="text"
                  value={element.styles.maxWidth || ''}
                  onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                  placeholder="none"
                />
              </div>
            </div>

            <div className="property-group">
              <h4>Spacing</h4>
              <div className="property-row">
                <label>Padding</label>
                <input
                  type="text"
                  value={element.styles.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="property-row">
                <label>Margin</label>
                <input
                  type="text"
                  value={element.styles.margin || ''}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="property-row">
                <label>Gap</label>
                <input
                  type="text"
                  value={element.styles.gap || ''}
                  onChange={(e) => handleStyleChange('gap', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="property-group">
              <h4>Flexbox</h4>
              <div className="property-row">
                <label>Display</label>
                <select
                  value={element.styles.display || ''}
                  onChange={(e) => handleStyleChange('display', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="grid">Grid</option>
                  <option value="inline">Inline</option>
                  <option value="inline-block">Inline Block</option>
                </select>
              </div>
              <div className="property-row">
                <label>Direction</label>
                <select
                  value={element.styles.flexDirection || ''}
                  onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                  <option value="row-reverse">Row Reverse</option>
                  <option value="column-reverse">Column Reverse</option>
                </select>
              </div>
              <div className="property-row">
                <label>Justify</label>
                <select
                  value={element.styles.justifyContent || ''}
                  onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                </select>
              </div>
              <div className="property-row">
                <label>Align</label>
                <select
                  value={element.styles.alignItems || ''}
                  onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="stretch">Stretch</option>
                </select>
              </div>
            </div>

            <div className="property-group">
              <h4>Grid</h4>
              <div className="property-row">
                <label>Columns</label>
                <input
                  type="text"
                  value={element.styles.gridTemplateColumns || ''}
                  onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                  placeholder="repeat(3, 1fr)"
                />
              </div>
              <div className="property-row">
                <label>Rows</label>
                <input
                  type="text"
                  value={element.styles.gridTemplateRows || ''}
                  onChange={(e) => handleStyleChange('gridTemplateRows', e.target.value)}
                  placeholder="auto"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="properties-section">
            {['heading', 'text', 'button', 'link'].includes(element.type) && (
              <div className="property-group">
                <h4>Text Content</h4>
                <textarea
                  value={element.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Enter content..."
                  rows={4}
                />
              </div>
            )}

            {['image', 'video'].includes(element.type) && (
              <div className="property-group">
                <h4>Source URL</h4>
                <input
                  type="text"
                  value={element.src || ''}
                  onChange={(e) => updateElement(element.id, { src: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}

            {element.type === 'link' && (
              <div className="property-group">
                <h4>Link URL</h4>
                <input
                  type="text"
                  value={element.href || ''}
                  onChange={(e) => updateElement(element.id, { href: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}

            {['input', 'textarea'].includes(element.type) && (
              <div className="property-group">
                <h4>Placeholder</h4>
                <input
                  type="text"
                  value={element.placeholder || ''}
                  onChange={(e) => updateElement(element.id, { placeholder: e.target.value })}
                  placeholder="Enter placeholder text..."
                />
              </div>
            )}

            {element.type === 'embed' && (
              <div className="property-group">
                <h4>Embed URL</h4>
                <input
                  type="text"
                  value={element.src || ''}
                  onChange={(e) => updateElement(element.id, { src: e.target.value })}
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default PropertiesPanel;
