import { ConfigBuilder } from "./ConfigBuilder";
import { MouseEvent } from "react";

export enum ConfigurableType {
  Text,
  Number,
  Button,
  Swatch,
  Boolean,
  Options,
  Dropdown,
  Time,
  List,
}

export enum UserMode {
  BASIC,
  ADVANCED,
}

export interface IConfigurable {
  readonly type: ConfigurableType;
  readonly userMode?: UserMode;
  readonly displayName: string;
  readonly category: string;
  readonly group: string;
  readonly key: string;
  readonly defaultValue?: any;
  readonly storage?: string;
  readonly onClick?: (
    builder: ConfigBuilder,
    event: MouseEvent<HTMLButtonElement | HTMLDivElement>,
    id?: string,
    data?: any
  ) => boolean;
  readonly Enabled?: (builder: ConfigBuilder) => boolean;
  readonly Options?: (
    builder: ConfigBuilder
  ) => { label: string; id: string; selectiveShow?: boolean }[];
}
