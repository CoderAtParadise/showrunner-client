import {
    BaseClockSettings,
    ClockIdentifier,
    ClockState,
    MutableClockSource,
    SMPTE
} from "@coderatparadise/showrunner-common";

export interface CurrentClockState {
    current: string;
    state: string;
    overrun: boolean;
}

export interface AdditionalData {
    data: object;
    duration: string;
    framerate: number;
    displayName: string;
}

export class RenderClockSource implements MutableClockSource<any> {
    constructor(
        type: string,
        identifier: ClockIdentifier,
        currentState: CurrentClockState,
        settings: BaseClockSettings & any,
        additional: AdditionalData
    ) {
        this.type = type;
        this.identifier = identifier;
        this.settings = settings;
        this.additional = additional;
        this.state = currentState.state as ClockState;
        this.overrun = currentState.overrun;
        this.mCurrent = currentState.current;
    }

    duration(): SMPTE {
        try {
            return new SMPTE(
                this.additional.duration,
                this.additional.framerate
            );
        } catch (e) {
            return new SMPTE();
        }
    }

    displayName(): string {
        if (this.additional.displayName !== "")
            return this.additional.displayName;
        return this.settings.displayName;
    }

    current(): SMPTE {
        try {
            return new SMPTE(this.mCurrent, this.additional.framerate);
        } catch (e) {
            return new SMPTE();
        }
    }

    data(): object {
        return this.additional.data;
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
        if (data.currentState) {
            this.mCurrent = data.currentState.current;
            this.state = data.currentState.state;
            this.overrun = data.currentState.overrun;
        }
        if (data.settings)
            this.settings = { ...this.settings, ...data.settings };
        if (data.additional)
            this.additional = { ...this.additional, ...data.additional };
    }

    identifier: ClockIdentifier;
    type: string;
    settings: BaseClockSettings & any;
    state: ClockState;
    overrun: boolean;
    private mCurrent: string;
    private additional: {
        data: object;
        framerate: number;
        duration: string;
        displayName: string;
    };
}
