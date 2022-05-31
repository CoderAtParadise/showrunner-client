import {
  BaseClockSettings,
  ClockIdentifier,
  ClockState,
  MutableClockSource,
  SMPTE,
} from "@coderatparadise/showrunner-common";
import { sendCommand } from "../commands/SendCommand";

export interface CurrentClockState {
  current: string;
  state: string;
  overrun: boolean;
  incorrectFramerate: boolean;
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
    this.incorrectFramerate = currentState.incorrectFramerate;
  }

  duration(): SMPTE {
    try {
      return new SMPTE(this.additional.duration, this.additional.framerate);
    } catch (e) {
      return new SMPTE();
    }
  }

  displayName(): string {
    if (this.additional.displayName !== "") return this.additional.displayName;
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
    sendCommand(
      { show: this.identifier.show, session: this.identifier.session },
      "clock.play",
      { id: this.identifier.id }
    );
  }

  setTime(time: SMPTE): void {
    sendCommand(
      { show: this.identifier.show, session: this.identifier.session },
      "clock.set",
      { id: this.identifier.id, time: time.toString() }
    );
  }

  pause(): void {
    sendCommand(
      { show: this.identifier.show, session: this.identifier.session },
      "clock.pause",
      { id: this.identifier.id }
    );
  }

  stop(): void {
    sendCommand(
      { show: this.identifier.show, session: this.identifier.session },
      "clock.stop",
      { id: this.identifier.id }
    );
  }

  reset(): void {
    sendCommand(
      { show: this.identifier.show, session: this.identifier.id },
      "clock.reset",
      { id: this.identifier.id }
    );
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
    if (data.settings) this.settings = { ...this.settings, ...data.settings };
    if (data.additional)
      this.additional = { ...this.additional, ...data.additional };
  }

  identifier: ClockIdentifier;
  type: string;
  settings: BaseClockSettings & any;
  state: ClockState;
  overrun: boolean;
  incorrectFramerate: boolean;
  private mCurrent: string;
  private additional: {
    data: object;
    framerate: number;
    duration: string;
    displayName: string;
  };
}
