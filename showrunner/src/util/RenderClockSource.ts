import {
    ClockState,
    MutableClockSource,
    SMPTE
} from "@coderatparadise/showrunner-common";

export interface RenderIdentifier {
    current: string;
    duration: string;
    framerate: number;
    id: string;
    owner: string;
    displayName: string;
    settings: { displayName: string } & any;
    type: string;
    data: object;
    state: string;
    overrun: boolean;
    automation: boolean;
}

export class RenderClockSource implements MutableClockSource<any> {
    constructor(identifier: RenderIdentifier) {
        this.owner = identifier.owner;
        this.framerate = identifier.framerate;
        this.id = identifier.id;
        this.type = identifier.type;
        this.mData = identifier.data;
        this.settings = identifier.settings;
        this.mDisplayName = identifier.displayName;
        this.state = identifier.state as ClockState;
        this.overrun = identifier.overrun;
        this.automation = identifier.automation;
        this.mCurrent = identifier.current;
        this.mDuration = identifier.duration;
    }

    duration(): SMPTE {
        try {
            return new SMPTE(this.mDuration, this.framerate);
        } catch (e) {
            return new SMPTE();
        }
    }

    displayName(): string {
        if (this.mDisplayName !== "") return this.mDisplayName;
        return this.settings.displayName;
    }

    current(): SMPTE {
        try {
            return new SMPTE(this.mCurrent, this.framerate);
        } catch (e) {
            return new SMPTE();
        }
    }

    data(): object {
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

    setData(data: any): void {
        if (data.current) this.mCurrent = data.current;
        if (data.state) this.state = data.state;
        if (data.overrun) this.overrun = data.overrun;
        if (data.settings) this.settings = data.settings;
        if (data.data) this.mData = data.data;
        if (data.duration) this.mDuration = data.duration;
        if (data.displayName) this.mDisplayName = data.displayName;
    }

    owner: string;
    id: string;
    type: string;
    settings: { displayName: string } & any;
    state: ClockState;
    overrun: boolean;
    automation: boolean;
    private mData: object;
    private mCurrent: string;
    private framerate: number;
    private mDuration: string;
    private mDisplayName: string;
}
