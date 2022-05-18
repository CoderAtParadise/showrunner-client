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

export class ConfigValueNumber implements ConfigValue<number | string> {
    constructor(
        builder: ConfigBuilder,
        configurable: IConfigurable,
        storage: (config: ConfigBuilder) => LooseObject
    ) {
        this.builder = builder;
        this.configurable = configurable;
        this.storage = storage;
    }

    get(): number | string {
        return (
            this.storage(this.builder).get(
                `${this.configurable.group}.${this.configurable.key}`
            ) || this.configurable?.defaultValue
        );
    }

    set(value: number | string): void {
        this.storage(this.builder).set(
            this.builder,
            `${this.configurable.group}.${this.configurable.key}`,
            value
        );
    }

    render(key: string): ReactNode {
        const options: { label: string; id: string }[] =
            this.configurable.Options?.(this.builder) || [];
        const min: number = parseFloat(
            options.find(
                (value: { label: string; id: string }) => value.id === "min"
            )?.label || `${-Number.MAX_VALUE}`
        );
        const max: number = parseFloat(
            options.find(
                (value: { label: string; id: string }) => value.id === "max"
            )?.label || `${Number.MAX_VALUE}`
        );
        if (
            this.storage(this.builder).get(
                `${this.configurable.group}.${this.configurable.key}`
            ) === undefined &&
            this.configurable.defaultValue
        )
            this.set(this.configurable?.defaultValue);
        return (
            <Content key={key}>
                <div>{this.configurable.displayName}: </div>
                <Input
                    type="number"
                    min={min}
                    max={max}
                    value={this.get()}
                    defaultValue={max < 0 ? max : min > 0 ? min : 0}
                    onChange={(e) => {
                        const v = e.target.valueAsNumber;
                        if (!isNaN(v) && v < min) this.set(min);
                        else if (!isNaN(v) && v > max) this.set(max);
                        else this.set(e.target.value);
                    }}
                />
            </Content>
        );
    }

    builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
