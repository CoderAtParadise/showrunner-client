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
    margin-right: 5px;
    /* :checked {
        filter: invert(100%) hue-rotate(18deg) brightness(1.7);
    } */
`;

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
        const value = this.storage(this.builder).get(
            `${this.configurable.group}.${this.configurable.key}`
        );
        return value || this.configurable.defaultValue;
    }

    set(value: boolean): void {
        this.storage(this.builder).set(
            this.builder,
            `${this.configurable.group}.${this.configurable.key}`,
            value
        );
    }

    render(): ReactNode {
        if (
            this.storage(this.builder).get(
                `${this.configurable.group}.${this.configurable.key}`
            ) === undefined &&
            this.configurable.defaultValue
        )
            this.set(this.configurable?.defaultValue);
        return (
            <Content>
                <Input
                    type="checkbox"
                    checked={this.get() || false}
                    onChange={(e) => {
                        this.set(e.target.checked);
                    }}
                />
                <div>{this.configurable.displayName}</div>
            </Content>
        );
    }

    private builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
