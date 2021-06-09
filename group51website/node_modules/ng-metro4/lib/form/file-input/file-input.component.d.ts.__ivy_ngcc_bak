import { ControlBase } from '../control-base';
import { FileReadModeType } from '../../helper/types';
export interface FileEntry {
    file: File;
    content: any;
}
export declare class FileInputComponent extends ControlBase<File | File[] | FileEntry | FileEntry[]> {
    multiple: boolean;
    accept: string;
    read: FileReadModeType;
    prepend: string;
    buttonTitle: string;
    infoText: string;
    drop: boolean;
    clsComponent: string;
    clsCaption: string;
    clsPrepend: string;
    clsButton: string;
    private input;
    private fileInput;
    private clonedElement;
    createControl(): Promise<void>;
    readFiles(files: File[]): void;
    disable(disabled: boolean): void;
    newValue(): void;
    newClassValue(newClasses: string[], oldClasses: string[]): void;
    private updateInfoText;
}
