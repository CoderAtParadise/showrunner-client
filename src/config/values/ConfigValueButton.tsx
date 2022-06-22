import { ReactNode, MouseEvent } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigurable } from "../IConfigurable";
import { IConfigValueRender } from "../IConfigValueRender";
import "./ConfigValue.css";

export class ConfigValueButton implements IConfigValueRender<boolean> {
  constructor(
    builder: IConfigBuilder,
    configurable: IConfigurable,
    storage: (config: IConfigBuilder) => LooseObject
  ) {
    this.builder = builder;
    this.configurable = configurable;
    this.storage = storage;
  }

  get(): boolean {
    return false;
  }

  set(value: boolean): void {
    this.builder.invokeListeners(
      `${this.configurable.identifier.group}.${this.configurable.identifier.key}`,
      false,
      value
    );
  }

  onClick(event: MouseEvent<HTMLButtonElement>): boolean {
    return this.configurable.function!(
      this.builder,
      "onClick"
    )(event) as boolean;
  }

  render(): ReactNode {
    return (
      <div className="container">
        <button
          className="button"
          onClick={(e) => {
            this.set(this.onClick(e));
          }}
        >
          {this.configurable.displayName}
        </button>
      </div>
    );
  }

  private builder: IConfigBuilder;
  configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
}
