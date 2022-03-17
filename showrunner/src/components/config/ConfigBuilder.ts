import { LooseObject } from "../../util/LooseObject";
import { ConfigStorageWatcher } from "./ConfigStorageWatcher";
import { ConfigValue } from "./ConfigValue";
import { ConfigValueBoolean } from "./ConfigValueBoolean";
import { ConfigValueSwatch } from "./ConfigValueSwatch";
import { ConfigValueText } from "./ConfigValueText";
import { ConfigValueOptions } from "./ConfigValueOptions";
import { ConfigurableType, IConfigurable } from "./IConfigurable";

export class ConfigBuilder {
    constructor(
        show: string,
        defaultStorageWatcher: ConfigStorageWatcher,
        edit: boolean = false
    ) {
        this.show = show;
        this.storage = defaultStorageWatcher;
        this.edit = edit;
    }

    buildConfig(config: IConfigurable[]) {
        config.forEach((value: IConfigurable) => {
            const storage = value.Storage
                ? value.Storage
                : (builder: ConfigBuilder) => builder.storage;
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
            }
        });
    }

    setStorage(storage: LooseObject) {
        this.storage.updateStorage(storage);
    }

    filter(key: string): ConfigValue<any>[] {
        if (key === "") return this.configs;
        const keysplit = key.split(":");
        const filtered: ConfigValue<any>[] = [];
        if (keysplit.length > 1) {
            if (keysplit[0] === "category") {
                this.configs.forEach((value: ConfigValue<any>) => {
                    if (
                        value.configurable.category === keysplit[0] &&
                        (value.configurable.Enabled
                            ? value.configurable?.Enabled(this)
                            : true)
                    )
                        filtered.push(value);
                });
            } else if (keysplit[0] === "group") {
                this.configs.forEach((value: ConfigValue<any>) => {
                    if (
                        value.configurable.group === keysplit[0] &&
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

    raw(key: string): any {
        return this.storage.get(key);
    }

    show: string;
    edit: boolean;
    private configs: ConfigValue<any>[] = [];
    private storage: ConfigStorageWatcher;
}
