import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
    BuilderElement,
    ElementType,
    ViewportSize,
    COMPONENT_DEFINITIONS
} from '../types';

interface HistoryState {
    elements: BuilderElement[];
    selectedId: string | null;
}

interface BuilderStore {
    // State
    elements: BuilderElement[];
    selectedId: string | null;
    hoveredId: string | null;
    viewport: ViewportSize;
    zoom: number;
    isPreviewMode: boolean;

    // History
    history: HistoryState[];
    historyIndex: number;

    // Actions
    setElements: (elements: BuilderElement[]) => void;
    setSelectedId: (id: string | null) => void;
    setHoveredId: (id: string | null) => void;
    setViewport: (viewport: ViewportSize) => void;
    setZoom: (zoom: number) => void;
    setPreviewMode: (isPreview: boolean) => void;

    // Element actions
    addElement: (type: ElementType, parentId?: string | null, index?: number) => BuilderElement;
    updateElement: (id: string, updates: Partial<BuilderElement>) => void;
    deleteElement: (id: string) => void;
    moveElement: (dragId: string, targetId: string | null, position: 'before' | 'after' | 'inside') => void;
    duplicateElement: (id: string) => void;

    // History actions
    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;

    // Utility
    getElementById: (id: string) => BuilderElement | null;
    getElementPath: (id: string) => string[];
}

// Helper to find element by id recursively
const findElement = (elements: BuilderElement[], id: string): BuilderElement | null => {
    for (const el of elements) {
        if (el.id === id) return el;
        if (el.children.length > 0) {
            const found = findElement(el.children, id);
            if (found) return found;
        }
    }
    return null;
};

// Helper to update element recursively
const updateElementInTree = (
    elements: BuilderElement[],
    id: string,
    updates: Partial<BuilderElement>
): BuilderElement[] => {
    return elements.map(el => {
        if (el.id === id) {
            return { ...el, ...updates };
        }
        if (el.children.length > 0) {
            return { ...el, children: updateElementInTree(el.children, id, updates) };
        }
        return el;
    });
};

// Helper to delete element recursively
const deleteElementFromTree = (elements: BuilderElement[], id: string): BuilderElement[] => {
    return elements.filter(el => {
        if (el.id === id) return false;
        if (el.children.length > 0) {
            el.children = deleteElementFromTree(el.children, id);
        }
        return true;
    });
};

// Helper to add element to parent
const addElementToParent = (
    elements: BuilderElement[],
    newElement: BuilderElement,
    parentId: string | null,
    index?: number
): BuilderElement[] => {
    if (!parentId) {
        if (typeof index === 'number') {
            const newElements = [...elements];
            newElements.splice(index, 0, newElement);
            return newElements;
        }
        return [...elements, newElement];
    }

    return elements.map(el => {
        if (el.id === parentId) {
            const newChildren = [...el.children];
            if (typeof index === 'number') {
                newChildren.splice(index, 0, newElement);
            } else {
                newChildren.push(newElement);
            }
            return { ...el, children: newChildren };
        }
        if (el.children.length > 0) {
            return { ...el, children: addElementToParent(el.children, newElement, parentId, index) };
        }
        return el;
    });
};

// Helper to get element path
const getPath = (elements: BuilderElement[], id: string, path: string[] = []): string[] | null => {
    for (const el of elements) {
        if (el.id === id) return [...path, el.id];
        if (el.children.length > 0) {
            const found = getPath(el.children, id, [...path, el.id]);
            if (found) return found;
        }
    }
    return null;
};

// Deep clone element with new IDs
const cloneElement = (element: BuilderElement): BuilderElement => {
    return {
        ...element,
        id: uuidv4(),
        name: `${element.name} (copy)`,
        children: element.children.map(cloneElement)
    };
};

// Create a new element from type
const createElement = (type: ElementType): BuilderElement => {
    const definition = COMPONENT_DEFINITIONS.find(d => d.type === type);

    return {
        id: uuidv4(),
        type,
        name: definition?.label || type,
        content: definition?.defaultContent,
        styles: { ...definition?.defaultStyles } || {},
        props3d: definition?.default3DProps ? { ...definition.default3DProps } : undefined,
        children: [],
        isLocked: false,
        isVisible: true
    };
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
    // Initial state
    elements: [],
    selectedId: null,
    hoveredId: null,
    viewport: 'desktop',
    zoom: 100,
    isPreviewMode: false,
    history: [],
    historyIndex: -1,

    // Setters
    setElements: (elements) => set({ elements }),
    setSelectedId: (id) => set({ selectedId: id }),
    setHoveredId: (id) => set({ hoveredId: id }),
    setViewport: (viewport) => set({ viewport }),
    setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
    setPreviewMode: (isPreviewMode) => set({ isPreviewMode, selectedId: null }),

    // Element actions
    addElement: (type, parentId = null, index) => {
        const newElement = createElement(type);
        const { elements, saveToHistory } = get();

        saveToHistory();

        const newElements = addElementToParent(elements, newElement, parentId, index);
        set({ elements: newElements, selectedId: newElement.id });

        return newElement;
    },

    updateElement: (id, updates) => {
        const { elements, saveToHistory } = get();
        saveToHistory();
        set({ elements: updateElementInTree(elements, id, updates) });
    },

    deleteElement: (id) => {
        const { elements, selectedId, saveToHistory } = get();
        saveToHistory();

        const newElements = deleteElementFromTree([...elements], id);
        set({
            elements: newElements,
            selectedId: selectedId === id ? null : selectedId
        });
    },

    moveElement: (dragId, targetId, position) => {
        const { elements, saveToHistory } = get();
        const dragElement = findElement(elements, dragId);
        if (!dragElement) return;

        saveToHistory();

        // Remove from current position
        let newElements = deleteElementFromTree([...elements], dragId);

        // Add to new position
        if (position === 'inside' && targetId) {
            newElements = addElementToParent(newElements, dragElement, targetId);
        } else if (targetId) {
            // Find parent and index of target
            const findParentAndIndex = (
                els: BuilderElement[],
                id: string,
                parent: BuilderElement | null = null
            ): { parent: BuilderElement | null; index: number } | null => {
                for (let i = 0; i < els.length; i++) {
                    if (els[i].id === id) {
                        return { parent, index: position === 'after' ? i + 1 : i };
                    }
                    if (els[i].children.length > 0) {
                        const found = findParentAndIndex(els[i].children, id, els[i]);
                        if (found) return found;
                    }
                }
                return null;
            };

            const result = findParentAndIndex(newElements, targetId);
            if (result) {
                newElements = addElementToParent(
                    newElements,
                    dragElement,
                    result.parent?.id || null,
                    result.index
                );
            }
        } else {
            newElements = [...newElements, dragElement];
        }

        set({ elements: newElements });
    },

    duplicateElement: (id) => {
        const { elements, saveToHistory } = get();
        const element = findElement(elements, id);
        if (!element) return;

        saveToHistory();

        const cloned = cloneElement(element);

        // Find parent and add after original
        const findParent = (els: BuilderElement[], targetId: string): BuilderElement | null => {
            for (const el of els) {
                if (el.children.some(c => c.id === targetId)) return el;
                const found = findParent(el.children, targetId);
                if (found) return found;
            }
            return null;
        };

        const parent = findParent(elements, id);

        if (parent) {
            const index = parent.children.findIndex(c => c.id === id) + 1;
            const newElements = addElementToParent(elements, cloned, parent.id, index);
            set({ elements: newElements, selectedId: cloned.id });
        } else {
            const index = elements.findIndex(e => e.id === id) + 1;
            const newElements = [...elements];
            newElements.splice(index, 0, cloned);
            set({ elements: newElements, selectedId: cloned.id });
        }
    },

    // History
    saveToHistory: () => {
        const { elements, selectedId, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ elements: JSON.parse(JSON.stringify(elements)), selectedId });

        // Limit history to 50 states
        if (newHistory.length > 50) newHistory.shift();

        set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            set({
                elements: prevState.elements,
                selectedId: prevState.selectedId,
                historyIndex: historyIndex - 1
            });
        }
    },

    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            set({
                elements: nextState.elements,
                selectedId: nextState.selectedId,
                historyIndex: historyIndex + 1
            });
        }
    },

    // Utility
    getElementById: (id) => findElement(get().elements, id),
    getElementPath: (id) => getPath(get().elements, id) || []
}));
