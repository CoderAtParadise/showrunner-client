import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { IConfigBuilder } from "../IConfigBuilder";
import { IConfigValueRender } from "../IConfigValueRender";
import { IConfigurable } from "../IConfigurable";
import "./ConfigValue.css";

export class ConfigValueText implements IConfigValueRender<string> {
    constructor(
        builder: IConfigBuilder,
        configurable: IConfigurable,
        storage: (config: IConfigBuilder) => LooseObject
    ) {
        this.builder = builder;
        this.configurable = configurable;
        this.storage = storage;
    }

    get(): string {
        const ret = this.storage(this.builder).get(
            `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
        );
        if (ret === undefined) return this.configurable?.defaultValue;
        else return ret;
    }

    set(value: string): void {
        this.storage(this.builder).set(
            this.builder,
            `${this.configurable.identifier.group}.${this.configurable.identifier.key}`,
            value
        );
    }

    render(): ReactNode {
        if (
            this.storage(this.builder).get(
                `${this.configurable.identifier.group}.${this.configurable.identifier.key}`
            ) === undefined &&
            this.configurable.defaultValue
        )
            this.set(this.configurable?.defaultValue);

        return (
            <div className="container">
                <div className="display">{this.configurable.displayName}: </div>
                <input className="text"
                    type="text"
                    value={this.get() || ""}
                    onChange={(e) => {
                        this.set(e.target.value);
                    }}
                />
            </div>
        );
    }

    builder: IConfigBuilder;
    configurable: IConfigurable;
    storage: (config: IConfigBuilder) => LooseObject;
}
