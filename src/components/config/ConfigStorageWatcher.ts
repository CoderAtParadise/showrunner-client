import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";

export interface ConfigStorageWatcher {
    get: (key: string) => any | undefined;
    set: (builder: ConfigBuilder, key: string, value: any) => any;
    updateStorage: (storage: LooseObject) => void;
    readonly raw: () => LooseObject;
}
