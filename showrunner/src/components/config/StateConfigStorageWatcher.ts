import { Dispatch } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";

export class StateStorageWatcher implements ConfigStorageWatcher {
    constructor(storage: LooseObject, dispatcher: Dispatch<LooseObject>) {
        this.storage = storage;
        this.dispatcher = dispatcher;
    }

    set(key: string, value: any): any {
        const nested = key.split(".");
        let ret = null;
        this.dispatcher((prevState: LooseObject) => {
            ret = { ...prevState };
            let tmp = ret;
            nested.forEach((v: string, index: number) => {
                if (tmp[v] === undefined) tmp[v] = {};
                if (index < nested.length - 1) tmp = tmp[v];
                else tmp[v] = value;
            });
            return ret;
        });
        return ret;
    }

    get(key: string): any {
        const nested = key.split(".");
        let tmp: any = this.storage;
        for (let i = 0; i < nested.length; i++) {
            const v = nested[i];
            if (tmp[v] === undefined) return undefined;
            else tmp = tmp[v];
        }
        return tmp;
    }

    updateStorage(storage: LooseObject): void {
        this.storage = storage;
    }

    private storage: LooseObject;
    private dispatcher: Dispatch<LooseObject>;
}
