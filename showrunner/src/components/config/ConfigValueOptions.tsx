import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
import { Autocomplete, TextField } from "@mui/material";

export class ConfigValueOptions implements ConfigValue<string> {
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
        const options = this.configurable.Options?.(this.builder) || [];
        console.log(options);
        return (
            <div>
                <div>{this.configurable.displayName}</div>
                <Autocomplete
                    options={options}
                    value={options.find(
                        (value: { label: string; id: string }) =>
                            value.id === this.get()
                    )}
                    onChange={(event, value) =>
                        this.set((value as { label: string; id: string }).id)
                    }
                    renderInput={(params) => <TextField {...params} />}
                />
            </div>
        );
    }

    builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
