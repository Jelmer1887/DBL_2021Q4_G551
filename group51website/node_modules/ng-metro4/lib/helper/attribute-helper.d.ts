import { ElementRef, Renderer2 } from '@angular/core';
export declare class AttributeHelper {
    /**
     * Sets an attribute to the element or removes the attribute if no value is given
     * @param renderer The renderer
     * @param element The element
     * @param attribute The attribute
     * @param value The optional value
     */
    static setAttribute(renderer: Renderer2, element: ElementRef, attribute: string, value?: any): void;
    /**
     * Creates a class observer on an element
     * @param element The element to observe
     * @param newClassValues The function to be called on change
     */
    static createObserver(element: ElementRef, newClassValues: (newClassValues: string[], oldClassValues: string[]) => void): MutationObserver;
}
