import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigValueRender } from "../IConfigValueRender";
import { IConfigurable, IConfigurableConstraint } from "../IConfigurable";
import { Dropdown } from "../../components/dropdown/Dropdown";
import "./ConfigValue.css";

export class ConfigValueDropdown implements IConfigValueRender<string> {
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
    const options: IConfigurableConstraint[] =
      this.configurable.constraints?.(this.builder) || [];
    if (
      this.storage(this.builder).get(
        `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
      ) === undefined &&
      this.configurable.defaultValue
    )
      this.set(this.configurable?.defaultValue);
    return (
      <div className="container">
        <div className="display">{this.configurable.displayName}:</div>
        <Dropdown
          className="config-dropdown"
          options={options}
          value={
            options.find(
              (value: IConfigurableConstraint) => value.id === this.get()
            ) || { label: "", id: "" }
          }
          onChange={(value: IConfigurableConstraint) => this.set(value.id)}
        />
      </div>
    );
  }

  builder: IConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
