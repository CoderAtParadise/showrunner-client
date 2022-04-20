import { LooseObject } from "../../util/LooseObject";

export interface ConfigStorageWatcher {
    get: (key: string) => any | undefined;
    set: (key: string, value: any) => any;
    updateStorage: (storage: LooseObject) => void;
    updateFetched: (storage: LooseObject) => void;
    fetched: (key: string) => any | undefined;
    readonly rawFetched: () => LooseObject;
}
