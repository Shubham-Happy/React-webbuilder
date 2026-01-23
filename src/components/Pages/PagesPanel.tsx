import { useState } from 'react';
import { 
    Plus, 
    FileText, 
    Home, 
    Trash2, 
    Copy, 
    Edit2, 
    Check, 
    X,
    MoreVertical,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import './PagesPanel.css';

function PagesPanel() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [showMenu, setShowMenu] = useState<string | null>(null);

    const pages = useBuilderStore(state => state.pages);
    const currentPageId = useBuilderStore(state => state.currentPageId);
    const addPage = useBuilderStore(state => state.addPage);
    const deletePage = useBuilderStore(state => state.deletePage);
    const renamePage = useBuilderStore(state => state.renamePage);
    const setCurrentPage = useBuilderStore(state => state.setCurrentPage);
    const duplicatePage = useBuilderStore(state => state.duplicatePage);
    const setHomepage = useBuilderStore(state => state.setHomepage);

    const handleAddPage = () => {
        const newPage = addPage(`Page ${pages.length + 1}`);
        setCurrentPage(newPage.id);
    };

    const handleStartEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setEditName(currentName);
        setShowMenu(null);
    };

    const handleSaveEdit = (id: string) => {
        if (editName.trim()) {
            renamePage(id, editName.trim());
        }
        setEditingId(null);
        setEditName('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    return (
        <div className="pages-panel">
            <div 
                className="pages-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <FileText size={16} />
                <span>Pages</span>
                <span className="pages-count">{pages.length}</span>
            </div>
            
            {isExpanded && (
                <div className="pages-list">
                    {pages.map(page => (
                        <div
                            key={page.id}
                            className={`page-item ${currentPageId === page.id ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page.id)}
                        >
                            {editingId === page.id ? (
                                <div className="page-edit-form">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit(page.id);
                                            if (e.key === 'Escape') handleCancelEdit();
                                        }}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <button 
                                        className="edit-btn save"
                                        onClick={(e) => { e.stopPropagation(); handleSaveEdit(page.id); }}
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button 
                                        className="edit-btn cancel"
                                        onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="page-info">
                                        {page.isHomepage && <Home size={14} className="home-icon" />}
                                        <span className="page-name">{page.name}</span>
                                    </div>
                                    <div className="page-actions">
                                        <button 
                                            className="menu-trigger"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setShowMenu(showMenu === page.id ? null : page.id); 
                                            }}
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                        
                                        {showMenu === page.id && (
                                            <div className="page-menu" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => handleStartEdit(page.id, page.name)}>
                                                    <Edit2 size={14} /> Rename
                                                </button>
                                                <button onClick={() => { duplicatePage(page.id); setShowMenu(null); }}>
                                                    <Copy size={14} /> Duplicate
                                                </button>
                                                {!page.isHomepage && (
                                                    <button onClick={() => { setHomepage(page.id); setShowMenu(null); }}>
                                                        <Home size={14} /> Set as Home
                                                    </button>
                                                )}
                                                {pages.length > 1 && (
                                                    <button 
                                                        className="delete"
                                                        onClick={() => { deletePage(page.id); setShowMenu(null); }}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    
                    <button className="add-page-btn" onClick={handleAddPage}>
                        <Plus size={16} />
                        <span>Add Page</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default PagesPanel;
