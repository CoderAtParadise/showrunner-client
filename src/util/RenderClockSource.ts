import {
  BaseClockSettings,
  ClockIdentifier,
  ClockSource,
  ClockStatus,
  ControlBar,
  SMPTE,
} from "@coderatparadise/showrunner-common";
import { sendCommand } from "../commands/SendCommand";

export interface CurrentClockStatus {
  current: string;
  status: string;
  overrun: boolean;
  incorrectFrameRate: boolean;
}

export interface AdditionalData {
  data: object;
  duration: string;
  frameRate: number;
  displayName: string;
  controlBar: ControlBar[];
}

export class RenderClockSource implements ClockSource<any> {
  constructor(
    type: string,
    identifier: ClockIdentifier,
    currentState: CurrentClockStatus,
    settings: BaseClockSettings & any,
    additional: AdditionalData
  ) {
    this.type = type;
    this.identifier = identifier;
    this._settings = settings;
    this._additional = additional;
    this._status = currentState.status as ClockStatus;
    this._overrun = currentState.overrun;
    this._current = currentState.current;
    this._incorrectFramerate = currentState.incorrectFrameRate;
  }
  controlBar(): ControlBar[] {
    return this._additional.controlBar;
  }

  settings(): BaseClockSettings & any {
    return this._settings;
  }

  status(): ClockStatus {
    return this._status;
  }

  hasIncorrectFrameRate(): boolean {
    return this._incorrectFramerate;
  }

  isOverrun(): boolean {
    return this._overrun;
  }

  duration(): SMPTE {
    try {
      return new SMPTE(this._additional.duration, this._additional.frameRate);
    } catch (e) {
      return new SMPTE();
    }
  }

  displayName(): string {
    if (this._additional.displayName !== "")
      return this._additional.displayName;
    return this._settings.displayName;
  }

  current(): SMPTE {
    try {
      return new SMPTE(this._current, this._additional.frameRate);
    } catch (e) {
      return new SMPTE();
    }
  }

  data(): object {
    return this._additional.data;
  }

  play(): void {
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
      { show: this.identifier.show, session: this.identifier.session },
      "clock.reset",
      { id: this.identifier.id }
    );
  }

  update(): void {
    // NOOP
  }

  updateSettings(settings: any): void {
    if (settings.currentState) {
      this._current = settings.currentState.current;
      this._status = settings.currentState.state;
      this._overrun = settings.currentState.overrun;
    }
    if (settings.settings)
      this._settings = { ...this._settings, ...settings.settings };
    if (settings.additional)
      this._additional = { ...this._additional, ...settings.additional };
  }

  identifier: ClockIdentifier;
  type: string;
  private _settings: BaseClockSettings & any;
  private _status: ClockStatus;
  private _overrun: boolean;
  private _incorrectFramerate: boolean;
  private _current: string;
  private _additional: AdditionalData;
}
