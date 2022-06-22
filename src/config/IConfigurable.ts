import { IConfigBuilder } from "./IConfigBuilder";

export enum ConfigurableType {
  Text,
  Number,
  Button,
  Swatch,
  Boolean,
  Search,
  Dropdown,
  Time,
  List,
}

export enum UserMode {
  BASIC,
  ADVANCED,
}

export interface IConfigurableConstraint {
  readonly id: string;
  readonly label: string;
  readonly value?: any;
}

export interface IConfigurable {
  readonly type: ConfigurableType;
  readonly variant?: string;
  readonly identifier: { category: string; group: string; key: string };
  readonly userMode: UserMode;
  readonly displayName: string;
  readonly defaultValue?: any;
  readonly storage?: string;
  readonly function?: (
    builder: IConfigBuilder,
    id: string
  ) => (...parameters: any) => any;
  readonly enabled?: (builder: IConfigBuilder) => boolean;
  readonly constraints?: (builder: IConfigBuilder) => IConfigurableConstraint[];
}
