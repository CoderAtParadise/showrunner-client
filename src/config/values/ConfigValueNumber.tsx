import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigValueRender } from "../IConfigValueRender";
import { IConfigurable, IConfigurableConstraint } from "../IConfigurable";
import "./ConfigValue.css";

export class ConfigValueNumber implements IConfigValueRender<number | string> {
  constructor(
    builder: IConfigBuilder,
    configurable: IConfigurable,
    storage: (config: IConfigBuilder) => LooseObject
  ) {
    this.builder = builder;
    this.configurable = configurable;
    this.storage = storage;
  }

  get(): number | string {
    return (
      this.storage(this.builder).get(
        `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
      ) || this.configurable?.defaultValue
    );
  }

  set(value: number | string): void {
    this.storage(this.builder).set(
      this.builder,
      `${this.configurable.identifier.group}.${this.configurable.identifier.key}`,
      value
    );
  }

  render(): ReactNode {
    const constraints: IConfigurableConstraint[] =
      this.configurable.constraints?.(this.builder) || [];
    const min: number =
      (constraints.find((value: IConfigurableConstraint) => value.id === "min")
        ?.value as number) || -Number.MAX_VALUE;
    const max: number =
      (constraints.find((value: IConfigurableConstraint) => value.id === "max")
        ?.value as number) || Number.MAX_VALUE;
    if (
      this.storage(this.builder).get(
        `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
      ) === undefined &&
      this.configurable.defaultValue
    )
      this.set(this.configurable?.defaultValue);
    return (
      <div className="container">
        <div className="display">{this.configurable.displayName}: </div>
        <input
          className="text"
          type="number"
          min={min}
          max={max}
          value={this.get()}
          defaultValue={max < 0 ? max : min > 0 ? min : 0}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (!isNaN(v) && v < min) this.set(min);
            else if (!isNaN(v) && v > max) this.set(max);
            else this.set(e.target.value);
          }}
        />
      </div>
    );
  }

  builder: IConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
