import { AccentType } from '../../helper/types';
import { Observable } from 'rxjs';
export interface ToastOptions {
    timeout?: number;
    cls?: string | AccentType;
    additional?: {
        distance?: number;
        showTop?: boolean;
    };
}
export declare class ToastService {
    constructor();
    /**
     * Create a toast message
     * @param message The message
     * @param options The options of the toast
     */
    create(message: string, options?: ToastOptions): Observable<void>;
}
