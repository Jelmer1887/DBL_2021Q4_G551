import { Observable } from 'rxjs';
import { EasingType } from '../../helper/types';
export interface NotifySetupOptions {
    container?: string;
    width?: string;
    timeout?: number;
    duration?: number;
    distance?: string;
    animation?: EasingType;
}
export interface NotifyOptions {
    keepOpen?: boolean;
    cls?: string;
    width?: string;
}
export declare class NotifyService {
    constructor();
    /**
     * Setup the notify system
     * @param options The options for the setup
     */
    setup(options: NotifySetupOptions): void;
    /**
     * Reset the settings of the notify system
     */
    reset(): void;
    /**
     * Create a notify
     * @param message The message
     * @param title The title
     * @param options Optional options object
     */
    create(message: string, title?: string, options?: NotifyOptions): Observable<void>;
}
