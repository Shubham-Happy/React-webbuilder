
import { StateCreator } from 'zustand';
import { BuilderElement } from '../../types';
import { BuilderStore } from '../useBuilderStore';

interface HistoryState {
    elements: BuilderElement[];
    selectedIds: string[];
}

export interface HistorySlice {
    history: HistoryState[];
    historyIndex: number;

    undo: () => void;
    redo: () => void;
    saveToHistory: () => void;
}

export const createHistorySlice: StateCreator<BuilderStore, [], [], HistorySlice> = (set, get) => ({
    history: [],
    historyIndex: -1,

    saveToHistory: () => {
        const { elements, selectedIds, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);

        // Use structuredClone for better performance if available, otherwise fallback
        const clonedElements = typeof structuredClone === 'function'
            ? structuredClone(elements)
            : JSON.parse(JSON.stringify(elements));

        newHistory.push({ elements: clonedElements, selectedIds: [...selectedIds] });

        if (newHistory.length > 50) newHistory.shift();

        set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            set({
                elements: prevState.elements,
                selectedIds: prevState.selectedIds,
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
                selectedIds: nextState.selectedIds,
                historyIndex: historyIndex + 1
            });
        }
    }
});
