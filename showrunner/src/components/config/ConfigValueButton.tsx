import { ReactNode, MouseEvent } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
import styled from "@emotion/styled";

const Content = styled.div`
    display: flex;
    flex-direction: row;
`;

const Input = styled.button`
    margin-right: 5px;
    background-color: rgb(54, 54, 54);
    border: solid;
    color: white;
    margin-left: 5px;
    border-color: rgb(150, 150, 150);
    border-radius: 3px;
    &:hover {
        cursor: pointer;
        background-color: rgb(100, 100, 100);
    }
`;

export class ConfigValueButton implements ConfigValue<void> {
    constructor(
        builder: ConfigBuilder,
        configurable: IConfigurable,
        storage: (config: ConfigBuilder) => LooseObject
    ) {
        this.builder = builder;
        this.configurable = configurable;
        this.storage = storage;
    }

    get(): void {}

    set(): void {}

    onClick(event: MouseEvent<HTMLButtonElement>): void {
        this.configurable.onClick!(this.builder, event);
    }

    render(key: string): ReactNode {
        return (
            <Content key={key}>
                <Input
                    onClick={(e) => {
                        this.onClick(e);
                    }}
                >
                    {this.configurable.displayName}
                </Input>
            </Content>
        );
    }

    private builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
