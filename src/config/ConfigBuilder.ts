import { IStorageWatcher } from "./IStorageWatcher";
import { IConfigValue } from "./IConfigValue";
import { ConfigurableType, IConfigurable } from "./IConfigurable";
import { isArray } from "lodash";
import { ConfigValueBoolean } from "./values/ConfigValueBoolean";
import { ConfigValueTime } from "./values/ConfigValueTime";
import { ConfigValueText } from "./values/ConfigValueText";
import { ConfigValueButton } from "./values/ConfigValueButton";
import { ConfigValueNumber } from "./values/ConfigValueNumber";
import { IConfigBuilder } from "./IConfigBuilder";
import { ConfigValueDropdown } from "./values/ConfigValueDropdown";
import { ConfigValueSearch } from "./values/ConfigValueSearch";
import { ConfigValueSwatch } from "./values/ConfigValueSwatch";

export class ConfigBuilder implements IConfigBuilder {
  constructor(
    show: string,
    session: string,
    defaultStorageWatcher: IStorageWatcher,
    edit: boolean = false
  ) {
    this.show = show;
    this.session = session;
    this.storageWatchers.set("default", defaultStorageWatcher);
    this.edit = edit;
  }

  buildConfig(config: IConfigurable[]) {
    if (!this.isBuilt) {
      this.isBuilt = true;
      config.forEach((value: IConfigurable) => {
        if (
          !this.filters.find(
            (v: { display: string; filter: string; category?: string }) =>
              v.filter === `category:${value.identifier.category}`
          )
        ) {
          this.filters.push({
            display: value.identifier.category,
            filter: `category:${value.identifier.category}`,
            groups: [],
          });
        }
        const category = this.filters.find(
          (v: { display: string; filter: string; category?: string }) =>
            v.filter === `category:${value.identifier.category}`
        );
        if (
          !category!.groups.find(
            (v: { display: string; filter: string }) =>
              v.filter === `group:${value.identifier.group}`
          )
        ) {
          category!.groups.push({
            display: value.identifier.group,
            filter: `group:${value.identifier.group}`,
          });
        }
        const storagekey = value.storage || "default";
        const storage = (builder: IConfigBuilder) =>
          builder.getStorageWatcher(storagekey) as IStorageWatcher;
        switch (value.type) {
          case ConfigurableType.Boolean:
            this.configs.push(new ConfigValueBoolean(this, value, storage));
            break;
          case ConfigurableType.Number:
            this.configs.push(new ConfigValueNumber(this, value, storage));
            break;
          case ConfigurableType.Button:
            this.configs.push(new ConfigValueButton(this, value, storage));
            break;
          case ConfigurableType.Swatch:
            this.configs.push(new ConfigValueSwatch(this, value, storage));
            break;
          case ConfigurableType.Text:
            this.configs.push(new ConfigValueText(this, value, storage));
            break;
          case ConfigurableType.Search:
            this.configs.push(new ConfigValueSearch(this, value, storage));
            break;
          case ConfigurableType.Dropdown:
            this.configs.push(new ConfigValueDropdown(this, value, storage));
            break;
          case ConfigurableType.Time:
            this.configs.push(new ConfigValueTime(this, value, storage));
            break;
          case ConfigurableType.List:
            break;
        }
      });
    }
  }

  // removeListener(
  //     key: string | string[],
  //     cb: (prevState?: any, newState?: any) => void
  // ) {

  // }

  listen(
    key: string | string[],
    cb: (prevState?: any, newState?: any) => void
  ) {
    if (!isArray(key)) this._listen(key, cb);
    else {
      (key as string[]).forEach((value: string) => this._listen(value, cb));
    }
  }

  throw(error: string) {
    this.errors.push(error);
  }

  isErrorThrown(error: string): boolean {
    return this.errors.includes(error);
  }

  private _listen(key: string, cb: (prevState?: any, newState?: any) => void) {
    if (this.listeners.get(key) !== undefined)
      this.listeners.get(key)?.push(cb);
    else this.listeners.set(key, [cb]);
  }

  invokeListeners(key: string, oldValue: any, newValue: any) {
    if (this.listeners.get(key)) {
      this.listeners
        .get(key)
        ?.forEach((cb: (prevState: any, newState: any) => void) => {
          cb(oldValue, newValue);
        });
    }
    this.listeners
      .get("*")
      ?.forEach((cb: (prevState: any, newState: any) => void) => {
        cb(oldValue, newValue);
      });
  }

  filter(key: string | string[]): IConfigValue<any>[] {
    if (!isArray(key)) return this._filter(key as string);
    else {
      let filtered: IConfigValue<any>[] = [];
      (key as string[]).forEach((value: string) => {
        filtered = filtered.concat(this._filter(value));
      });
      return filtered;
    }
  }

  private _filter(key: string): IConfigValue<any>[] {
    if (key === "") return this.configs;
    const keysplit = key.split(":");
    const filtered: IConfigValue<any>[] = [];
    if (keysplit.length > 1) {
      if (keysplit[0] === "category") {
        this.configs.forEach((value: IConfigValue<any>) => {
          if (
            value.configurable.identifier.category === keysplit[1] &&
            (value.configurable.enabled
              ? value.configurable?.enabled(this)
              : true)
          )
            filtered.push(value);
        });
      } else if (keysplit[0] === "group") {
        this.configs.forEach((value: IConfigValue<any>) => {
          if (
            value.configurable.identifier.group === keysplit[1] &&
            (value.configurable.enabled
              ? value.configurable?.enabled(this)
              : true)
          )
            filtered.push(value);
        });
      }
    }
    return filtered;
  }

  get(key: string): IConfigValue<any> | undefined {
    const keysplit = key.split(".");
    for (let i = 0; i < this.configs.length; i++) {
      const value = this.configs[i];
      if (value.configurable.identifier.group === keysplit[0])
        if (value.configurable.identifier.key === keysplit[1]) return value;
    }
    return undefined;
  }

  getStorageWatcher(key: string): IStorageWatcher {
    return (
      this.storageWatchers.get(key) ||
      (this.storageWatchers.get("default") as IStorageWatcher)
    );
  }

  hasStorageWatcher(key: string): boolean {
    return this.storageWatchers.has(key);
  }

  addStorageWatcher(key: string, watcher: IStorageWatcher): void {
    this.storageWatchers.set(key, watcher);
  }

  raw(key: string, watcher: string = "default"): any {
    return this.storageWatchers.get(watcher)?.get(key);
  }

  setAdditionalData(key: string, value: any): void {
    this.additionalData.set(key, value);
  }

  getAdditionalData(key: string): any {
    return this.additionalData.get(key);
  }

  show: string;
  session: string;
  edit: boolean;
  filters: {
    display: string;
    filter: string;
    groups: { display: string; filter: string }[];
  }[] = [];
  errors: string[] = [];

  // prettier-ignore
  // eslint-disable-next-line
  private listeners: Map<string, ((prevState?: any, newState?: any) => void)[]> = new Map<string, ((prevState?: any, newState?: any) => void)[]>();
  private isBuilt = false;
  private configs: IConfigValue<any>[] = [];
  private storageWatchers: Map<string, IStorageWatcher> = new Map<
    string,
    IStorageWatcher
  >();
  private additionalData: Map<string, any> = new Map<string, any>();
}
