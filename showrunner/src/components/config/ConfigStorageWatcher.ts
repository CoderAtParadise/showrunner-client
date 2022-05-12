import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";

export interface ConfigStorageWatcher {
    get: (key: string) => any | undefined;
    set: (builder: ConfigBuilder, key: string, value: any) => any;
    updateStorage: (storage: LooseObject) => void;
    updateFetched: (storage: LooseObject) => void;
    fetched: (key: string) => any | undefined;
    readonly rawFetched: () => LooseObject;
    readonly raw: () => LooseObject;
}
