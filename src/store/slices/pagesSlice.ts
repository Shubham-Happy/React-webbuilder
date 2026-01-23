import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BuilderElement } from '../../types';
import { BuilderStore } from '../useBuilderStore';

export interface Page {
    id: string;
    name: string;
    slug: string;
    elements: BuilderElement[];
    isHomepage: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PagesSlice {
    pages: Page[];
    currentPageId: string | null;

    // Actions
    addPage: (name: string) => Page;
    deletePage: (id: string) => void;
    renamePage: (id: string, name: string) => void;
    setCurrentPage: (id: string) => void;
    duplicatePage: (id: string) => void;
    setHomepage: (id: string) => void;
    getCurrentPage: () => Page | null;
}

const createDefaultPage = (name: string, isHomepage: boolean = false): Page => ({
    id: uuidv4(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    elements: [],
    isHomepage,
    createdAt: new Date(),
    updatedAt: new Date()
});

export const createPagesSlice: StateCreator<BuilderStore, [], [], PagesSlice> = (set, get) => {
    // Create initial homepage
    const homepage = createDefaultPage('Home', true);

    return {
        pages: [homepage],
        currentPageId: homepage.id,

        addPage: (name) => {
            const newPage = createDefaultPage(name);
            set(state => ({
                pages: [...state.pages, newPage]
            }));
            return newPage;
        },

        deletePage: (id) => {
            const { pages, currentPageId } = get();
            if (pages.length <= 1) return; // Prevent deleting last page

            const newPages = pages.filter(p => p.id !== id);
            const newCurrentId = currentPageId === id ? newPages[0].id : currentPageId;

            set({
                pages: newPages,
                currentPageId: newCurrentId,
                elements: newPages.find(p => p.id === newCurrentId)?.elements || []
            });
        },

        renamePage: (id, name) => {
            set(state => ({
                pages: state.pages.map(p =>
                    p.id === id
                        ? { ...p, name, slug: name.toLowerCase().replace(/\s+/g, '-'), updatedAt: new Date() }
                        : p
                )
            }));
        },

        setCurrentPage: (id) => {
            const { pages, elements, currentPageId } = get();

            // Save current page elements before switching
            const updatedPages = pages.map(p =>
                p.id === currentPageId
                    ? { ...p, elements, updatedAt: new Date() }
                    : p
            );

            const targetPage = updatedPages.find(p => p.id === id);
            if (!targetPage) return;

            set({
                pages: updatedPages,
                currentPageId: id,
                elements: targetPage.elements,
                selectedIds: []
            });
        },

        duplicatePage: (id) => {
            const { pages } = get();
            const sourcePage = pages.find(p => p.id === id);
            if (!sourcePage) return;

            const newPage: Page = {
                ...sourcePage,
                id: uuidv4(),
                name: `${sourcePage.name} (Copy)`,
                slug: `${sourcePage.slug}-copy`,
                isHomepage: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                elements: JSON.parse(JSON.stringify(sourcePage.elements))
            };

            set(state => ({
                pages: [...state.pages, newPage]
            }));
        },

        setHomepage: (id) => {
            set(state => ({
                pages: state.pages.map(p => ({
                    ...p,
                    isHomepage: p.id === id
                }))
            }));
        },

        getCurrentPage: () => {
            const { pages, currentPageId } = get();
            return pages.find(p => p.id === currentPageId) || null;
        }
    };
};
