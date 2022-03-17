import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ColorSwatch } from "../ColorSwatch";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";

export class ConfigValueSwatch implements ConfigValue<string> {
    constructor(
        builder: ConfigBuilder,
        configurable: IConfigurable,
        storage: (config: ConfigBuilder) => LooseObject
    ) {
        this.builder = builder;
        this.configurable = configurable;
        this.storage = storage;
    }

    get(): string {
        return this.storage(this.builder).get(
            `${this.configurable.group}.${this.configurable.key}`
        );
    }

    set(value: string): void {
        this.storage(this.builder).set(
            `${this.configurable.group}.${this.configurable.key}`,
            value
        );
    }

    render(): ReactNode {
        return (
            <div>
                <div>{this.configurable.displayName}</div>
                <ColorSwatch color={this.get() || "#000000"} onChange={(c) => this.set(c)} />
            </div>
        );
    }

    private builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
