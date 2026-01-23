import { useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';

export function useKeyboardShortcuts() {
    const selectedIds = useBuilderStore(state => state.selectedIds);
    const deleteElement = useBuilderStore(state => state.deleteElement);
    const duplicateElement = useBuilderStore(state => state.duplicateElement);
    const undo = useBuilderStore(state => state.undo);
    const redo = useBuilderStore(state => state.redo);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input, textarea, or contentEditable
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                (e.target instanceof HTMLElement && e.target.isContentEditable)
            ) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedIds.length > 0) {
                    e.preventDefault();
                    // Delete all selected
                    selectedIds.forEach(id => deleteElement(id));
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                if (selectedIds.length > 0) {
                    e.preventDefault();
                    // Duplicate all selected
                    selectedIds.forEach(id => duplicateElement(id));
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) {
                    e.preventDefault();
                    redo();
                } else {
                    e.preventDefault();
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, deleteElement, duplicateElement, undo, redo]);
}
