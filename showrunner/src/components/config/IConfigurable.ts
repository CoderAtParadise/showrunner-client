import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";

export enum ConfigurableType {
    Text,
    number,
    Swatch,
    Boolean,
    Options,
    Time
}

export interface IConfigurable {
    readonly type: ConfigurableType;
    readonly displayName: string;
    readonly category: string;
    readonly group: string;
    readonly key: string;
    Enabled?: (builder: ConfigBuilder) => boolean;
    Storage?: (builder: ConfigBuilder) => LooseObject;
    Options?: (builder: ConfigBuilder) => { label: string; id: string }[];
}
