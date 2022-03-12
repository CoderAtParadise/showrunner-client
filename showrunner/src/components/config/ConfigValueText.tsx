import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";

export class ConfigValueText implements ConfigValue<string> {
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
        return this.storage(this.builder)[this.configurable.group][
            this.configurable.key
        ];
    }

    set(value: string): void {
        this.storage(this.builder)[this.configurable.group][
            this.configurable.key
        ] = value;
    }

    render(props: { className?: string }): ReactNode {
        return (
            <div className={props.className}>
                <div>{this.configurable.displayName}</div>
                <input
                    type="text"
                    value={this.get()}
                    onChange={(e) => {
                        this.set(e.target.value);
                    }}
                />
            </div>
        );
    }

    builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
