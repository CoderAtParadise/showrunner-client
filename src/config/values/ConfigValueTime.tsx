import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigValueRender } from "../IConfigValueRender";
import { IConfigurable } from "../IConfigurable";
import { Offset, SMPTE, zeroPad } from "@coderatparadise/showrunner-common";
import { Dropdown } from "../../components/dropdown/Dropdown";
import "./ConfigValue.css";

export class ConfigValueTime implements IConfigValueRender<string> {
  constructor(
    builder: IConfigBuilder,
    configurable: IConfigurable,
    storage: (config: IConfigBuilder) => LooseObject
  ) {
    this.builder = builder;
    this.configurable = configurable;
    this.storage = storage;
  }

  get(): string {
    return (
      this.storage(this.builder).get(
        `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
      ) || this.configurable?.defaultValue
    );
  }

  set(value: string): void {
    this.storage(this.builder).set(
      this.builder,
      `${this.configurable.identifier.group}.${this.configurable.identifier.key}`,
      value
    );
  }

  render(): ReactNode {
    const clock = new SMPTE(this.get() || "00:00:00:00");
    if (
      this.storage(this.builder).get(
        `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
      ) === undefined &&
      this.configurable.defaultValue
    ) {
      if (this.configurable.variant !== "offset")
        this.set(`+${this.configurable?.defaultValue}`);
      else this.set(this.configurable?.defaultValue);
    }
    return (
      <div className="container">
        <div className="display">{this.configurable.displayName}: </div>
        {this.configurable.variant === "offset" ? (
          <>
            <Dropdown
              className="config-offset"
              options={[
                { id: Offset.START, label: Offset.START },
                { id: Offset.END, label: Offset.END },
              ]}
              value={{
                label:
                  clock.offset() !== Offset.NONE
                    ? clock.offset()
                    : Offset.START,
                id:
                  clock.offset() !== Offset.NONE
                    ? clock.offset()
                    : Offset.START,
              }}
              onChange={(e) => {
                this.set(
                  `${e.id}${zeroPad(clock.hours(), 2)}:${zeroPad(
                    clock.minutes(),
                    2
                  )}:${zeroPad(clock.seconds(), 2)}:00`
                );
              }}
            />
            <span className="seperator"> </span>
          </>
        ) : null}
        <input
          className="time"
          type="number"
          min={0}
          max={23}
          value={clock.hours()}
          onChange={(e) => {
            if (e.target.valueAsNumber < 0) {
              this.set(
                `${clock.offset()}00:${zeroPad(clock.minutes(), 2)}:${zeroPad(
                  clock.seconds(),
                  2
                )}:00`
              );
            } else if (e.target.valueAsNumber > 23) {
              this.set(
                `${clock.offset()}23:${zeroPad(clock.minutes(), 2)}:${zeroPad(
                  clock.seconds(),
                  2
                )}:00`
              );
            } else {
              this.set(
                `${clock.offset()}${zeroPad(
                  e.target.valueAsNumber,
                  2
                )}:${zeroPad(clock.minutes(), 2)}:${zeroPad(
                  clock.seconds(),
                  2
                )}:00`
              );
            }
          }}
        />
        <span className="seperator">:</span>
        <input
          className="time"
          type="number"
          min={0}
          max={59}
          value={clock.minutes()}
          onChange={(e) => {
            if (e.target.valueAsNumber < 0) {
              this.set(
                `${clock.offset()}${zeroPad(clock.hours(), 2)}:00:${zeroPad(
                  clock.seconds(),
                  2
                )}:00`
              );
            } else if (e.target.valueAsNumber > 59) {
              this.set(
                `${clock.offset()}${zeroPad(clock.hours(), 2)}:59:${zeroPad(
                  clock.seconds(),
                  2
                )}:00`
              );
            } else {
              this.set(
                `${clock.offset()}${zeroPad(clock.hours(), 2)}:${zeroPad(
                  e.target.valueAsNumber,
                  2
                )}:${zeroPad(clock.seconds(), 2)}:00`
              );
            }
          }}
        />
        <span className="seperator">:</span>
        <input
          className="time"
          type="number"
          min={0}
          max={59}
          value={clock.seconds()}
          onChange={(e) => {
            if (e.target.valueAsNumber < 0) {
              this.set(
                `${clock.offset()}${zeroPad(clock.hours(), 2)}:${zeroPad(
                  clock.minutes(),
                  2
                )}:00:00`
              );
            } else if (e.target.valueAsNumber > 59) {
              this.set(
                `${clock.offset()}${zeroPad(clock.hours(), 2)}:${zeroPad(
                  clock.minutes(),
                  2
                )}:59:00`
              );
            } else {
              this.set(
                `${clock.offset()}${zeroPad(clock.hours(), 2)}:${zeroPad(
                  clock.minutes(),
                  2
                )}:${zeroPad(e.target.valueAsNumber, 2)}:00`
              );
            }
          }}
        />
      </div>
    );
  }

  builder: IConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
