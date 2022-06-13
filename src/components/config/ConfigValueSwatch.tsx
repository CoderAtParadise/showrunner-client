import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ColorSwatch } from "../colorswatch/ColorSwatch";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
import styled from "@emotion/styled";

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

export class ConfigValueSwatch implements ConfigValue<string> {
  constructor(
    builder: ConfigBuilder,
    configurable: IConfigurable,
    storage: (config: ConfigBuilder) => LooseObject
  ) {
    this.builder = builder;
    this.configurable = configurable;
    this.storage = storage;
  }

  get(): string {
    return (
      this.storage(this.builder).get(
        `${this.configurable.group}.${this.configurable.key}`
      ) || this.configurable?.defaultValue
    );
  }

  set(value: string): void {
    this.storage(this.builder).set(
      this.builder,
      `${this.configurable.group}.${this.configurable.key}`,
      value
    );
  }

  render(): ReactNode {
    if (
      this.storage(this.builder).get(
        `${this.configurable.group}.${this.configurable.key}`
      ) === undefined &&
      this.configurable.defaultValue
    )
      this.set(this.configurable?.defaultValue);
    return (
      <Content>
        <div>{this.configurable.displayName}: </div>
        <ColorSwatch
          color={this.get() || "#000000"}
          onChange={(c) => this.set(c)}
        />
      </Content>
    );
  }

  private builder: ConfigBuilder;
  configurable: IConfigurable;
  storage: (config: ConfigBuilder) => LooseObject;
}
