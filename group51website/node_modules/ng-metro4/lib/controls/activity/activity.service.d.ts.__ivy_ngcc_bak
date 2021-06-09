import { ActivityStyleType, ActivityType } from '../../helper/types';
export interface ActivityOptions {
    type?: ActivityType;
    style?: ActivityStyleType;
    autoHide?: number;
    overlayClickClose?: boolean;
    overlayColor?: string;
    overlayAlpha?: number;
    text?: string;
}
export declare class ActivityService {
    constructor();
    /**
     * Open an activity
     * @param options The activity options
     */
    open(options: ActivityOptions): any;
    /**
     * Closes an opened activity
     * @param activity The activity object returned by open
     */
    close(activity: any): void;
}
