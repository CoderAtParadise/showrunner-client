import { LooseObject } from "../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";

export interface IStorageWatcher {
    get: (key: string) => any | undefined;
    set: (builder: ConfigBuilder, key: string, value: any) => any;
    raw: () => LooseObject;
}
