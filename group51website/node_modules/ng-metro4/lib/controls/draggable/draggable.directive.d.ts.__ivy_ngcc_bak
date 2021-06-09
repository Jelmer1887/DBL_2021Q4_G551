import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
export interface DragPosition {
    x: number;
    y: number;
}
export declare class DraggableDirective implements OnInit, OnChanges, OnDestroy {
    private element;
    private renderer;
    dragElement: string;
    dragArea: string;
    dragStart: EventEmitter<DragPosition>;
    dragStop: EventEmitter<DragPosition>;
    dragMove: EventEmitter<DragPosition>;
    private draggableData;
    constructor(element: ElementRef, renderer: Renderer2);
    private createElement;
    setPosition(position: DragPosition): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
