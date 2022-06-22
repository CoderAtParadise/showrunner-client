import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigurable } from "../IConfigurable";
import { AutoComplete } from "../../components/autocomplete/AutoComplete";
import { IConfigValueRender } from "../IConfigValueRender";
import "./ConfigValue.css";

export class ConfigValueSearch implements IConfigValueRender<string> {
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
    return this.storage(this.builder).get(
      `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
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
    const options: { label: string; id: string }[] =
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
        <AutoComplete
          className="config-search"
          options={options}
          value={
            options.find(
              (value: { label: string; id: string }) => value.id === this.get()
            ) || { label: "", id: "" }
          }
          onChange={(value: { label: string; id: string }) =>
            this.set(value.id)
          }
        />
      </div>
    );
  }

  builder: IConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
