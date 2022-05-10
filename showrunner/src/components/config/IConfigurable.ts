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
    readonly onClick?: (
        builder: ConfigBuilder,
        event: MouseEvent<HTMLButtonElement>
    ) => void;
    readonly Enabled?: (builder: ConfigBuilder) => boolean;
    readonly Options?: (builder: ConfigBuilder) => { label: string; id: string }[];
}
