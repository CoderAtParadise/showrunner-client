import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { IConfigurable } from "./IConfigurable";

export interface ConfigValue<T> {
    readonly configurable: IConfigurable;
    storage: (config:ConfigBuilder) => LooseObject;
    get: (index?: number | string) => T;
    set: (value: T, index?: number | string) => void;
    render: (props: { className?: string }) => ReactNode;
}
