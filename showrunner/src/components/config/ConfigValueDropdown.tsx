import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
// import { Autocomplete, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { Dropdown } from "../Dropdown";

const Content = styled.div`
    display: flex;
    flex-direction: row;
`;

export class ConfigValueDropdown implements ConfigValue<string> {
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
        ) || this.configurable?.defaultValue;
    }

    set(value: string): void {
        this.storage(this.builder).set(
            `${this.configurable.group}.${this.configurable.key}`,
            value
        );
    }

    render(): ReactNode {
        const options: { label: string; id: string }[] =
            this.configurable.Options?.(this.builder) || [];
        return (
            <Content>
                <div>{this.configurable.displayName}:</div>
                <Dropdown
                    options={options}
                    value={
                        options.find(
                            (value: { label: string; id: string }) =>
                                value.id === this.get()
                        ) || { label: "", id: "" }
                    }
                    onChange={(value: { label: string; id: string }) =>
                        this.set(value.id)
                    }
                />
            </Content>
        );
    }

    builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
