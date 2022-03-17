import { LooseObject } from "../../util/LooseObject";

export interface ConfigStorageWatcher {
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    updateStorage: (storage: LooseObject) => void;
}
