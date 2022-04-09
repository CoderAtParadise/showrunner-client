import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";

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
    Enabled?: (builder: ConfigBuilder) => boolean;
    Storage?: (builder: ConfigBuilder) => ConfigStorageWatcher;
    Options?: (builder: ConfigBuilder) => { label: string; id: string }[];
    preload?: (builder: ConfigBuilder) => LooseObject;
}
