import { IConfigValue } from "./IConfigValue";
import { IStorageWatcher } from "./IStorageWatcher";

export interface IConfigBuilder {
  filter: (key: string | string[]) => IConfigValue<any>[];
  get: (key: string) => IConfigValue<any> | undefined;
  getStorageWatcher: (key: string) => IStorageWatcher;
  raw: (key: string, watcher: string) => any;
  listen: (
    key: string | string[],
    cb: (prevState?: any, newState?: any) => void
  ) => void;
  invokeListeners: (key: string, oldValue: any, newValue: any) => void;
  setAdditionalData: (key: string, value: any) => void;
  getAdditionalData: (key: string) => any;
  throw: (error: string) => void;
  isErrorThrown: (error: string) => boolean;
}
