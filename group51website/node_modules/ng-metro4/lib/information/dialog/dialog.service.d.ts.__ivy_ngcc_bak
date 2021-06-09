import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { M4FormGroup } from '../../form/m4-form-group';
export interface DialogOptions {
    title?: string;
    content?: string | any;
    actions?: {
        caption: string;
        cls: string;
        onclick: () => void;
    }[];
    actionsAlign?: 'left' | 'right';
    defaultAction?: boolean;
    overlay?: boolean;
    overlayColor?: string;
    overlayAlpha?: number;
    overlayClickClose?: boolean;
    width?: number;
    closeAction?: boolean;
    clsDialog?: string;
    clsTitle?: string;
    clsContent?: string;
    clsAction?: string;
    clsDefaultAction?: string;
    autoHide?: number;
    removeOnClose?: boolean;
    show?: boolean;
}
export interface InfoboxOptions {
    type?: 'default' | 'success' | 'info' | 'alert' | 'warning';
    width?: number;
    height?: number;
    overlay?: boolean;
    overlayColor?: string;
    overlayAlpha?: string;
    autoHide?: number;
    removeOnClose?: boolean;
    closeButton?: boolean;
    clsBox?: string;
    clsBoxContent?: string;
    clsOverlay?: string;
}
export declare class DialogService {
    private componentFactoryResolver;
    private appRef;
    private injector;
    constructor(componentFactoryResolver: ComponentFactoryResolver, appRef: ApplicationRef, injector: Injector);
    /**
     * Create a custom dialog
     * @param options The options of the dialog
     */
    create(options: DialogOptions): any;
    /**
     * Close a created dialog
     * @param dialogObj The object returned by the create method
     */
    close(dialogObj: any): any;
    /**
     * Shows an alert dialog
     * @param title The title of the dialog
     * @param message The message of the dialog
     * @param cls Optional css classes
     * @param okBtnText The text of the OK-Button
     * @param okBtnCls An optional css class for the OK-Button
     */
    alert(title: string, message: string, cls?: string, okBtnText?: string, okBtnCls?: string): Observable<void>;
    /**
     * Shows a confirm dialog
     * @param title The title of the confirm
     * @param message The message of the confirm
     * @param yesBtnText The text for the Yes-Button
     * @param noBtnText The text for the No-Button
     * @param cls An optional css class for the dialog
     * @param yesBtnCls An optional css class for the Yes-Button
     * @param noBtnCls An optional css class for the No-Button
     */
    confirm(title: string, message: string, yesBtnText?: string, noBtnText?: string, cls?: string, yesBtnCls?: string, noBtnCls?: string): Observable<boolean>;
    /**
     * Show a prompt dialog
     * @param title The title of the prompt
     * @param message The message of the prompt
     * @param submitBtnText The text of the Submit-Button
     * @param placeholder The placeholder of the input
     * @param cls An optional css class for the dialog
     * @param submitBtnCls An optional css class for Submit-Button
     * @param inputCls An optional css class for the input
     */
    prompt(title: string, message: string, submitBtnText?: string, placeholder?: string, cls?: string, submitBtnCls?: string, inputCls?: string): Observable<string>;
    /**
     * Show a prompt dialog that contains a form
     * @param title The title of the prompt
     * @param form The form group
     * @param submitBtnText The text of the Submit-Button
     * @param abortBtnText The text of the Abort-Button
     * @param placeholder The placeholder of the input
     * @param cls An optional css class for the dialog
     * @param submitBtnCls An optional css class for Submit-Button
     * @param abortBtnCls An optional css class for Abort-Button
     */
    formPrompt<T = string>(title: string, form: M4FormGroup, submitBtnText?: string, abortBtnText?: string, placeholder?: string, cls?: string, submitBtnCls?: string, abortBtnCls?: string): Observable<T>;
    /**
     * Show a dialog that contains a component
     * @param component The component class to render
     * @param dialogData Data to pass to the new component instance
     * @param title The title of the dialog
     * @param closeBtnText Custom text for the close button
     * @param cls Custom dialog class (accent, size etc.)
     * @param closeBtnCls Custom close button class
     */
    show<TOutput = null>(component: new (...args: any[]) => any, dialogData?: any, title?: string, closeBtnText?: string, cls?: string, closeBtnCls?: string): Observable<TOutput>;
    /**
     * Show an info dialog
     * @param content The content of the info
     * @param options Options for info
     */
    info(content: string, options?: InfoboxOptions): {
        setContent: (content: string) => void;
        setType: (type: 'default' | 'success' | 'info' | 'alert' | 'warning') => void;
        close: () => void;
    };
}
