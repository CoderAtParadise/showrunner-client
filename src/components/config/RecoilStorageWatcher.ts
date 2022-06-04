import structuredClone from "@ungap/structured-clone";
import { RecoilState } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";

export class RecoilStorageWatcher implements ConfigStorageWatcher {
  constructor(recoilState: RecoilState<any>, forceUpdate: () => void) {
    this.state = recoilState;
    this.forceUpdate = forceUpdate;
  }

  set(builder: ConfigBuilder, key: string, value: any): any {
    const nested = key.split(".");
    let ret = null;
    setRecoil(this.state, (prevState) => {
      ret = structuredClone(prevState);
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
      this.updateStorage(ret);
      this.forceUpdate();
      return ret;
    });
  }

  get(key: string): any {
    const content = getRecoil(this.state);
    const nested = key.split(".");
    let tmp: any = content;
    for (let i = 0; i < nested.length; i++) {
      const v = nested[i];
      if (tmp[v] === undefined) return undefined;
      else tmp = tmp[v];
    }
    return tmp;
  }

  updateStorage(storage: LooseObject): void {}

  raw(): LooseObject {
    return getRecoil(this.state);
  }

  private state: RecoilState<any>;
  private forceUpdate: () => void;
}
