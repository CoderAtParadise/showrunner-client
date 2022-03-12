import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";

export enum ConfigurableType {
    Text,
    Swatch,
    Boolean,
    Options
}

export interface IConfigurable {
    readonly type: ConfigurableType;
    readonly displayName: string;
    readonly category: string;
    readonly group: string;
    readonly key: string;
    Enabled?: (config: ConfigBuilder) => boolean;
    Storage?: (config: ConfigBuilder) => LooseObject;
    Options?: (data?: any) => { label: string; id: string }[];
}
