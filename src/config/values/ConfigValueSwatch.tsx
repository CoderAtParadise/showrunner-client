import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ColorSwatch } from "../../components/colorswatch/ColorSwatch";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigurable } from "../IConfigurable";
import { IConfigValueRender } from "../IConfigValueRender";
import "./ConfigValue.css";

export class ConfigValueSwatch implements IConfigValueRender<string> {
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
        <ColorSwatch
          className="config-swatch"
          color={this.get() || "#000000"}
          onChange={(c) => this.set(c)}
        />
      </div>
    );
  }

  private builder: IConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
