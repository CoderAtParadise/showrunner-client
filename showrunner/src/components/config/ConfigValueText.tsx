import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
import styled from "@emotion/styled";

const Content = styled.div`
    display: flex;
    flex-direction: row;
`;

const Input = styled.input`
    background-color: rgb(54, 54, 54);
    border: solid;
    color: white;
    margin-left: 5px;
    border-color: rgb(150, 150, 150);
    border-radius: 3px;
`;

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
        return (
            <Content>
                <div>{this.configurable.displayName}: </div>
                <Input
                    type="text"
                    defaultValue={this.get() || ""}
                    onChange={(e) => {
                        this.set(e.target.value);
                    }}
                />
            </Content>
        );
    }

    builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
