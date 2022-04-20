import { LooseObject } from "../../util/LooseObject";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";
import { ConfigValue } from "./ConfigValue";
import { ConfigValueBoolean } from "./ConfigValueBoolean";
import { ConfigValueSwatch } from "./ConfigValueSwatch";
import { ConfigValueText } from "./ConfigValueText";
import { ConfigValueOptions } from "./ConfigValueOptions";
import { ConfigValueDropdown } from "./ConfigValueDropdown";
import { ConfigurableType, IConfigurable } from "./IConfigurable";

export class ConfigBuilder {
    constructor(
        show: string,
        session: string,
        defaultStorageWatcher: ConfigStorageWatcher,
        edit: boolean = false
    ) {
        this.show = show;
        this.session = session;
        this.storageWatchers.set("default", defaultStorageWatcher);
        this.edit = edit;
    }

    buildConfig(config: IConfigurable[]) {
        config.forEach((value: IConfigurable) => {
            if (
                !this.filters.find(
                    (v: {
                        display: string;
                        filter: string;
                        category?: string;
                    }) => v.filter === `category:${value.category}`
                )
            ) {
                this.filters.push({
                    display: value.category,
                    filter: `category:${value.category}`,
                    groups: []
                });
            }
            const category = this.filters.find(
                (v: { display: string; filter: string; category?: string }) =>
                    v.filter === `category:${value.category}`
            );
            if (
                !category!.groups.find(
                    (v: { display: string; filter: string }) =>
                        v.filter === `group:${value.group}`
                )
            ) {
                category!.groups.push({
                    display: value.group,
                    filter: `group:${value.group}`
                });
            }
            const storagekey = value.storage || "default";
            const storage = (builder: ConfigBuilder) =>
                builder.storageWatchers.get(storagekey) as ConfigStorageWatcher;
            switch (value.type) {
                case ConfigurableType.Boolean:
                    this.configs.push(
                        new ConfigValueBoolean(this, value, storage)
                    );
                    break;
                case ConfigurableType.Swatch:
                    this.configs.push(
                        new ConfigValueSwatch(this, value, storage)
                    );
                    break;
                case ConfigurableType.Text:
                    this.configs.push(
                        new ConfigValueText(this, value, storage)
                    );
                    break;
                case ConfigurableType.Options:
                    this.configs.push(
                        new ConfigValueOptions(this, value, storage)
                    );
                    break;
                case ConfigurableType.Dropdown:
                    this.configs.push(
                        new ConfigValueDropdown(this, value, storage)
                    );
                    break;
            }
        });
    }

    setStorage(storage: LooseObject, watcher: string = "default") {
        this.storageWatchers.get(watcher)?.updateStorage(storage);
    }

    filter(key: string): ConfigValue<any>[] {
        if (key === "") return this.configs;
        const keysplit = key.split(":");
        const filtered: ConfigValue<any>[] = [];
        if (keysplit.length > 1) {
            if (keysplit[0] === "category") {
                this.configs.forEach((value: ConfigValue<any>) => {
                    if (
                        value.configurable.category === keysplit[1] &&
                        (value.configurable.Enabled
                            ? value.configurable?.Enabled(this)
                            : true)
                    )
                        filtered.push(value);
                });
            } else if (keysplit[0] === "group") {
                this.configs.forEach((value: ConfigValue<any>) => {
                    if (
                        value.configurable.group === keysplit[1] &&
                        (value.configurable.Enabled
                            ? value.configurable?.Enabled(this)
                            : true)
                    )
                        filtered.push(value);
                });
            }
        }
        return filtered;
    }

    get(key: string): ConfigValue<any> | undefined {
        const keysplit = key.split(".");
        for (let i = 0; i < this.configs.length; i++) {
            const value = this.configs[i];
            if (value.configurable.group === keysplit[0])
                if (value.configurable.key === keysplit[1]) return value;
        }
        return undefined;
    }

    getStorageWatcher(key: string): ConfigStorageWatcher {
        return (
            this.storageWatchers.get(key) ||
            (this.storageWatchers.get("default") as ConfigStorageWatcher)
        );
    }

    hasStorageWatcher(key: string): boolean {
        return this.storageWatchers.has(key);
    }

    addStorageWatcher(key: string, watcher: ConfigStorageWatcher): void {
        const fetched = { ...this.storageWatchers.get(key)?.rawFetched() };
        watcher.updateFetched(fetched);
        this.storageWatchers.set(key, watcher);
    }

    raw(key: string, watcher: string = "default"): any {
        return this.storageWatchers.get(watcher)?.get(key);
    }

    fetched(key: string, watcher: string = "default"): any | [] {
        return this.storageWatchers.get(watcher)?.fetched(key);
    }

    setFetched(storage: LooseObject, watcher: string = "default"): void {
        this.storageWatchers.get(watcher)?.updateFetched(storage);
    }

    show: string;
    session: string;
    edit: boolean;
    filters: {
        display: string;
        filter: string;
        groups: { display: string; filter: string }[];
    }[] = [];

    private configs: ConfigValue<any>[] = [];
    private storageWatchers: Map<string, ConfigStorageWatcher> = new Map<
        string,
        ConfigStorageWatcher
    >();
}
