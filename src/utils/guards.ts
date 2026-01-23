
import { ElementTypes, ElementType } from '../types';

/**
 * Type guard to check if a string is a valid ElementType
 */
export function isElementType(value: any): value is ElementType {
    return Object.values(ElementTypes).includes(value as ElementTypes);
}

/**
 * Type guard to check if value is a defined string
 */
export function isString(value: any): value is string {
    return typeof value === 'string' && value.length > 0;
}
