import {
    ClockSource,
    ClockState,
    SMPTE
} from "@coderatparadise/showrunner-common";

export interface RenderIdentifier {
    current: string;
    framerate: number;
    displayName: string;
    id: string;
    owner: string;
    show: string;
    type: string;
    data: object;
    state: string;
    overrun: boolean;
    automation: boolean;
}

export class RenderClockSource implements ClockSource {
    constructor(identifier: RenderIdentifier) {
        this.owner = identifier.owner;
        this.framerate = identifier.framerate;
        this.show = identifier.show;
        this.id = identifier.id;
        this.type = identifier.type;
        this.mData = identifier.data;
        this.displayName = identifier.displayName;
        this.state = identifier.state as ClockState;
        this.overrun = identifier.overrun;
        this.automation = identifier.automation;
        this.mCurrent = identifier.current;
    }

    current(): SMPTE {
        try {
            return new SMPTE(this.mCurrent, this.framerate);
        } catch (e) {
            return new SMPTE();
        }
    }

    data(): object | undefined {
        return this.mData;
    }

    start(): void {
        // NOOP
    }

    pause(): void {
        // NOOP
    }

    stop(): void {
        // NOOP
    }

    reset(): void {
        // NOOP
    }

    update(): void {
        // NOOP
    }

    owner: string;
    show: string;
    id: string;
    type: string;
    displayName: string;
    state: ClockState;
    overrun: boolean;
    automation: boolean;
    private mData: object;
    private mCurrent: string;
    private framerate: number;
}
