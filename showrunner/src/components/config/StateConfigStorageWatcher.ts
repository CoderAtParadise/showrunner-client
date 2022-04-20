import { Dispatch } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";
import structuredClone from "@ungap/structured-clone";

export class StateStorageWatcher implements ConfigStorageWatcher {
    constructor(
        storage: LooseObject,
        dispatcher: Dispatch<LooseObject>,
        forceUpdate: () => void
    ) {
        this.storage = storage;
        this.dispatcher = dispatcher;
        this.forceUpdate = forceUpdate;
    }

    set(key: string, value: any): any {
        const nested = key.split(".");
        let ret = null;
        this.dispatcher((prevState: LooseObject) => {
            ret = structuredClone(prevState);
            let tmp = ret;
            nested.forEach((v: string, index: number) => {
                if (tmp[v] === undefined) tmp[v] = {};
                if (index < nested.length - 1) tmp = tmp[v];
                else tmp[v] = value;
            });
            this.updateStorage(ret);
            this.forceUpdate();
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

    updateFetched(storage: LooseObject): void {
        this.mfetched = storage;
    }

    fetched(key: string): any {
        const nested = key.split(".");
        let tmp: any = this.mfetched;
        for (let i = 0; i < nested.length; i++) {
            const v = nested[i];
            if (tmp[v] === undefined) return undefined;
            else tmp = tmp[v];
        }
        return tmp;
    }

    rawFetched(): LooseObject {
        return this.mfetched;
    }

    private storage: LooseObject;
    private mfetched: LooseObject = {};
    private dispatcher: Dispatch<LooseObject>;
    private forceUpdate: () => void;
}
