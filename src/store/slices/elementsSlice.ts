
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BuilderElement, ElementType, COMPONENT_DEFINITIONS } from '../../types';
import { BuilderStore } from '../useBuilderStore';

export interface ElementsSlice {
    elements: BuilderElement[];
    selectedIds: string[]; // Changed from single ID to array
    hoveredId: string | null;

    setElements: (elements: BuilderElement[]) => void;
    setSelectedId: (id: string | null) => void; // Helper to set single selection
    toggleSelection: (id: string, multi: boolean) => void; // Main selection handler
    setHoveredId: (id: string | null) => void;

    addElement: (type: ElementType, parentId?: string | null, index?: number) => BuilderElement;
    updateElement: (id: string, updates: Partial<BuilderElement>) => void;
    deleteElement: (id: string) => void;
    moveElement: (dragId: string, targetId: string | null, position: 'before' | 'after' | 'inside') => void;
    duplicateElement: (id: string) => void;

    getElementById: (id: string) => BuilderElement | null;
    getElementPath: (id: string) => string[];
}

// Helpers (moved from original store)
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

const updateElementInTree = (elements: BuilderElement[], id: string, updates: Partial<BuilderElement>): BuilderElement[] => {
    return elements.map(el => {
        if (el.id === id) return { ...el, ...updates };
        if (el.children.length > 0) return { ...el, children: updateElementInTree(el.children, id, updates) };
        return el;
    });
};

const deleteElementFromTree = (elements: BuilderElement[], id: string): BuilderElement[] => {
    return elements.filter(el => {
        if (el.id === id) return false;
        if (el.children.length > 0) el.children = deleteElementFromTree(el.children, id);
        return true;
    });
};

const addElementToParent = (elements: BuilderElement[], newElement: BuilderElement, parentId: string | null, index?: number): BuilderElement[] => {
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
            if (typeof index === 'number') newChildren.splice(index, 0, newElement);
            else newChildren.push(newElement);
            return { ...el, children: newChildren };
        }
        if (el.children.length > 0) return { ...el, children: addElementToParent(el.children, newElement, parentId, index) };
        return el;
    });
};

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

const cloneElement = (element: BuilderElement): BuilderElement => ({
    ...element,
    id: uuidv4(),
    name: `${element.name} (copy)`,
    children: element.children.map(cloneElement)
});

const createElement = (type: ElementType): BuilderElement => {
    const definition = COMPONENT_DEFINITIONS.find(d => d.type === type);
    return {
        id: uuidv4(),
        type,
        name: definition?.label || type,
        content: definition?.defaultContent,
        styles: { ...definition?.defaultStyles },
        props3d: definition?.default3DProps ? { ...definition.default3DProps } : undefined,
        children: [],
        isLocked: false,
        isVisible: true
    };
};

export const createElementsSlice: StateCreator<BuilderStore, [], [], ElementsSlice> = (set, get) => ({
    elements: [],
    selectedIds: [],
    hoveredId: null,

    setElements: (elements) => set({ elements }),

    // Legacy support: clears selection and sets just one, or clears all if id is null
    setSelectedId: (id) => set({ selectedIds: id ? [id] : [] }),

    toggleSelection: (id, multi) => {
        const { selectedIds } = get();
        if (multi) {
            if (selectedIds.includes(id)) {
                set({ selectedIds: selectedIds.filter(sid => sid !== id) });
            } else {
                set({ selectedIds: [...selectedIds, id] });
            }
        } else {
            set({ selectedIds: [id] });
        }
    },

    setHoveredId: (id) => set({ hoveredId: id }),

    addElement: (type, parentId = null, index) => {
        const newElement = createElement(type);
        const { elements, saveToHistory } = get();
        saveToHistory();
        const newElements = addElementToParent(elements, newElement, parentId, index);
        set({ elements: newElements, selectedIds: [newElement.id] });
        return newElement;
    },

    updateElement: (id, updates) => {
        const { elements, saveToHistory } = get();
        saveToHistory();
        set({ elements: updateElementInTree(elements, id, updates) });
    },

    deleteElement: (id) => {
        const { elements, selectedIds, saveToHistory } = get();
        saveToHistory();

        // Use recursive helper to remove the element
        const newElements = deleteElementFromTree([...elements], id);

        // Remove from selection if deleted
        const newSelectedIds = selectedIds.filter(sid => sid !== id);

        set({ elements: newElements, selectedIds: newSelectedIds });
    },

    moveElement: (dragId, targetId, position) => {
        const { elements, saveToHistory } = get();
        const dragElement = findElement(elements, dragId);
        if (!dragElement) return;

        saveToHistory();

        let newElements = deleteElementFromTree([...elements], dragId);

        if (position === 'inside' && targetId) {
            newElements = addElementToParent(newElements, dragElement, targetId);
        } else if (targetId) {
            const findParentAndIndex = (els: BuilderElement[], id: string, parent: BuilderElement | null = null): { parent: BuilderElement | null; index: number } | null => {
                for (let i = 0; i < els.length; i++) {
                    if (els[i].id === id) return { parent, index: position === 'after' ? i + 1 : i };
                    if (els[i].children.length > 0) {
                        const found = findParentAndIndex(els[i].children, id, els[i]);
                        if (found) return found;
                    }
                }
                return null;
            };

            const result = findParentAndIndex(newElements, targetId);
            if (result) {
                newElements = addElementToParent(newElements, dragElement, result.parent?.id || null, result.index);
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
            set({ elements: newElements, selectedIds: [cloned.id] });
        } else {
            const index = elements.findIndex(e => e.id === id) + 1;
            const newElements = [...elements];
            newElements.splice(index, 0, cloned);
            set({ elements: newElements, selectedIds: [cloned.id] });
        }
    },

    getElementById: (id) => findElement(get().elements, id),
    getElementPath: (id) => getPath(get().elements, id) || []
});
