
import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBuilderStore } from '../store/useBuilderStore';
import { ElementType } from '../types';

export function useBuilderDragDrop() {
    const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);

    const {
        addElement,
        moveElement
    } = useBuilderStore();

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.isNew) {
            setActiveDragType(active.data.current.type);
        }
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        setActiveDragType(null);

        if (!over) return;

        const isNew = active.data.current?.isNew;
        const type = active.data.current?.type as ElementType;

        if (isNew && type) {
            // Adding new element
            const parentId = over.id === 'canvas' ? null : String(over.id);
            addElement(type, parentId);
        } else if (active.data.current?.elementId) {
            // Moving existing element
            const dragId = active.data.current.elementId;
            const targetId = over.id === 'canvas' ? null : String(over.id);
            const position = over.data.current?.position || 'inside';

            if (dragId !== targetId) {
                moveElement(dragId, targetId, position);
            }
        }
    }, [addElement, moveElement]);

    return {
        activeDragType,
        handleDragStart,
        handleDragEnd
    };
}
