import { ConfigBuilder } from "./ConfigBuilder";

export enum ConfigurableType {
    Text,
    number,
    Swatch,
    Boolean,
    Options,
    Dropdown,
    Time
}

export interface IConfigurable {
    readonly type: ConfigurableType;
    readonly displayName: string;
    readonly category: string;
    readonly group: string;
    readonly key: string;
    readonly defaultValue?: any;
    readonly storage?: string;
    Enabled?: (builder: ConfigBuilder) => boolean;
    Options?: (builder: ConfigBuilder) => { label: string; id: string }[];
}
