import { create } from 'zustand';
import { ElementsSlice, createElementsSlice } from './slices/elementsSlice';
import { UiSlice, createUiSlice } from './slices/uiSlice';
import { HistorySlice, createHistorySlice } from './slices/historySlice';
import { PagesSlice, createPagesSlice } from './slices/pagesSlice';

export type BuilderStore = ElementsSlice & UiSlice & HistorySlice & PagesSlice;

export const useBuilderStore = create<BuilderStore>()((...a) => ({
    ...createElementsSlice(...a),
    ...createUiSlice(...a),
    ...createHistorySlice(...a),
    ...createPagesSlice(...a),
}));


