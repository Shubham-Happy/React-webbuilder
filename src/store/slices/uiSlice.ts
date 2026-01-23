
import { StateCreator } from 'zustand';
import { ViewportSize } from '../../types';
import { BuilderStore } from '../useBuilderStore';

export interface UiSlice {
    viewport: ViewportSize;
    zoom: number;
    isDarkMode: boolean;
    isPreviewMode: boolean;

    setViewport: (viewport: ViewportSize) => void;
    setZoom: (zoom: number) => void;
    setPreviewMode: (isPreview: boolean) => void;
    toggleTheme: () => void;
}

export const createUiSlice: StateCreator<BuilderStore, [], [], UiSlice> = (set) => ({
    viewport: 'desktop',
    zoom: 100,
    isPreviewMode: false,
    isDarkMode: false, // Default to light/cream theme

    setViewport: (viewport) => set({ viewport }),
    setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
    setPreviewMode: (isPreviewMode) => set({ isPreviewMode, selectedIds: [] }),
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
});
