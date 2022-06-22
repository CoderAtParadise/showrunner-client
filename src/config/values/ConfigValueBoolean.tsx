import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigValueRender } from "../IConfigValueRender";
import { IConfigurable } from "../IConfigurable";
import { IConfigBuilder } from "../IConfigBuilder";
import { ConfigBuilder } from "../ConfigBuilder";
import "./ConfigValue.css";

export class ConfigValueBoolean implements IConfigValueRender<boolean> {
  constructor(
    builder: ConfigBuilder,
    configurable: IConfigurable,
    storage: (config: IConfigBuilder) => LooseObject
  ) {
    this.builder = builder;
    this.configurable = configurable;
    this.storage = storage;
  }

  get(): boolean {
    const value = this.storage(this.builder).get(
      `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
    );
    return value || this.configurable.defaultValue;
  }

  set(value: boolean): void {
    this.storage(this.builder).set(
      this.builder,
      `${this.configurable.identifier.group}.${this.configurable.identifier.key}`,
      value
    );
  }

  render(): ReactNode {
    if (
      this.storage(this.builder).get(
        `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
      ) === undefined &&
      this.configurable.defaultValue
    )
      this.set(this.configurable?.defaultValue);
    return (
      <div className="container">
        <input
          className="checkbox"
          type="checkbox"
          checked={this.get() || false}
          onChange={(e) => {
            this.set(e.target.checked);
          }}
        />
        <div className="display">{this.configurable.displayName}</div>
      </div>
    );
  }

  private builder: ConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
