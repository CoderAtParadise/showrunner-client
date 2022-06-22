import { LooseObject } from "../util/LooseObject";
import { IConfigBuilder } from "./IConfigBuilder";
import { IConfigurable } from "./IConfigurable";

export interface IConfigValue<T> {
  readonly configurable: IConfigurable;
  storage: (config: IConfigBuilder) => LooseObject;
  get: (index?: number | string) => T;
  set: (value: T, index?: number | string) => void;
  function?: (...parameters: any) => any;
}
