import { LooseObject } from "../../util/LooseObject";
import { ConfigValue } from "./ConfigValue";
import { ConfigValueBoolean } from "./ConfigValueBoolean";
import { ConfigValueSwatch } from "./ConfigValueSwatch";
import { ConfigValueText } from "./ConfigValueText";
import { ConfigurableType, IConfigurable } from "./IConfigurable";
import structuredClone from "@ungap/structured-clone";

export class ConfigBuilder {
    constructor(storage: LooseObject) {
        this.storage = storage;
        this.oldCache = structuredClone(storage); // We are using v16 LTS version of Nodejs. structuredClone is only introduced in v17 of Nodejs
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
            }
        });
    }

    filter(key: string): ConfigValue<any>[] {
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
        this.configs.forEach((value: ConfigValue<any>) => {
            if (value.configurable.group === keysplit[0])
                if (value.configurable.key === keysplit[1]) return value;
        });
        return undefined;
    }

    private configs: ConfigValue<any>[] = [];
    private storage: LooseObject;
    private oldCache: LooseObject;
}
