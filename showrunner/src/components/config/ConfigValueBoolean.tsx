import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";

export class ConfigValueBoolean implements ConfigValue<boolean> {
    constructor(
        builder: ConfigBuilder,
        configurable: IConfigurable,
        storage: (config: ConfigBuilder) => LooseObject
    ) {
        this.builder = builder;
        this.configurable = configurable;
        this.storage = storage;
    }

    get(): boolean {
        return this.storage(this.builder).get(
            `${this.configurable.group}.${this.configurable.key}`
        );
    }

    set(value: boolean): void {
        this.storage(this.builder).set(
            `${this.configurable.group}.${this.configurable.key}`,
            value
        );
    }

    render(): ReactNode {
        return (
            <div>
                <div>{this.configurable.displayName}</div>
                <input
                    type="checkbox"
                    checked={this.get() || false}
                    onChange={(e) => {
                        this.set(e.target.checked);
                    }}
                />
            </div>
        );
    }

    private builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
