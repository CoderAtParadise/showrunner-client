import structuredClone from "@ungap/structured-clone";
import { getRecoil, setRecoil } from "recoil-nexus";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";
import { fetched } from "../../network/fetcher/Fetcher";

export class FetcherStorageWatcher implements ConfigStorageWatcher {
  constructor(
    identifier: { show: string; session: string; key: string },
    forceUpdate: () => void
  ) {
    this.identifier = identifier;
    this.forceUpdate = forceUpdate;
  }

  set(builder: ConfigBuilder, key: string, value: any): any {
    const nested = key.split(".");
    setRecoil(fetched(this.identifier), (map: Map<string, any>) => {
      const newMap = new Map(map);
      let ret = newMap.get(this.identifier.key);
      let tmp = ret;
      nested.forEach((v: string, index: number) => {
        if (tmp[v] === undefined) tmp[v] = {};
        if (index < nested.length - 1) tmp = tmp[v];
        else {
          const oldValue = structuredClone(tmp[v]);
          tmp[v] = value;
          builder.invokeListeners(key, oldValue, value);
        }
      });
      newMap.set(this.identifier.key, ret);
      this.forceUpdate();
      return newMap;
    });
  }

  get(key: string): any {
    const _fetched = getRecoil(
      fetched({ show: this.identifier.show, session: this.identifier.session })
    ) as Map<string, any>;
    if (_fetched.has(this.identifier.key)) {
      const content = _fetched.get(this.identifier.key);
      const nested = key.split(".");
      let tmp: any = content;
      for (let i = 0; i < nested.length; i++) {
        const v = nested[i];
        if (tmp[v] === undefined) return undefined;
        else tmp = tmp[v];
      }
      return tmp;
    }
    return undefined;
  }

  updateStorage(storage: LooseObject): void {}

  raw(): LooseObject {
    const _fetched = getRecoil(fetched(this.identifier));
    return _fetched.get(this.identifier.key);
  }

  private identifier: { show: string; session: string; key: string };
  private forceUpdate: () => void;
}
