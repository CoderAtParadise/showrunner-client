import { ReactNode } from "react";
import { LooseObject } from "../../util/LooseObject";
import { ConfigBuilder } from "./ConfigBuilder";
import { ConfigValue } from "./ConfigValue";
import { IConfigurable } from "./IConfigurable";
import styled from "@emotion/styled";
import { SMPTE } from "@coderatparadise/showrunner-common";
import { zeroPad } from "../../util/ZeroPad";

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
    width: 2.5em;
`;

export class ConfigValueTime implements ConfigValue<string> {
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
        return (
            this.storage(this.builder).get(
                `${this.configurable.group}.${this.configurable.key}`
            ) || this.configurable?.defaultValue
        );
    }

    set(value: string): void {
        this.storage(this.builder).set(
            `${this.configurable.group}.${this.configurable.key}`,
            value
        );
    }

    render(): ReactNode {
        const clock = new SMPTE(this.get() || "00:00:00:00");
        return (
            <Content>
                <div>{this.configurable.displayName}: </div>
                <Input
                    type="number"
                    min={0}
                    max={23}
                    value={clock.hours()}
                    onChange={(e) => {
                        if (e.target.valueAsNumber < 0) {
                            this.set(
                                `00:${zeroPad(clock.minutes(), 2)}:${zeroPad(
                                    clock.seconds(),
                                    2
                                )}:00`
                            );
                        } else if (e.target.valueAsNumber > 23) {
                            this.set(
                                `23:${zeroPad(clock.minutes(), 2)}:${zeroPad(
                                    clock.seconds(),
                                    2
                                )}:00`
                            );
                        } else {
                            this.set(
                                `${zeroPad(
                                    e.target.valueAsNumber,
                                    2
                                )}:${zeroPad(clock.minutes(), 2)}:${zeroPad(
                                    clock.seconds(),
                                    2
                                )}:00`
                            );
                        }
                    }}
                />
                :
                <Input
                    type="number"
                    min={0}
                    max={59}
                    value={clock.minutes()}
                    onChange={(e) => {
                        if (e.target.valueAsNumber < 0) {
                            this.set(
                                `${zeroPad(clock.hours(), 2)}:00:${zeroPad(
                                    clock.seconds(),
                                    2
                                )}:00`
                            );
                        } else if (e.target.valueAsNumber > 59) {
                            this.set(
                                `${zeroPad(clock.hours(), 2)}:59:${zeroPad(
                                    clock.seconds(),
                                    2
                                )}:00`
                            );
                        } else {
                            this.set(
                                `${zeroPad(clock.hours(), 2)}:${zeroPad(
                                    e.target.valueAsNumber,
                                    2
                                )}:${zeroPad(clock.seconds(), 2)}:00`
                            );
                        }
                    }}
                />
                :
                <Input
                    type="number"
                    min={0}
                    max={59}
                    value={clock.seconds()}
                    onChange={(e) => {
                        if (e.target.valueAsNumber < 0) {
                            this.set(
                                `${zeroPad(clock.hours(), 2)}:${zeroPad(
                                    clock.minutes(),
                                    2
                                )}:00:00`
                            );
                        } else if (e.target.valueAsNumber > 59) {
                            this.set(
                                `${zeroPad(clock.hours(), 2)}:${zeroPad(
                                    clock.minutes(),
                                    2
                                )}:59:00`
                            );
                        } else {
                            this.set(
                                `${zeroPad(clock.hours(), 2)}:${zeroPad(
                                    clock.minutes(),
                                    2
                                )}:${zeroPad(e.target.valueAsNumber, 2)}:00`
                            );
                        }
                    }}
                />
            </Content>
        );
    }

    builder: ConfigBuilder;
    configurable: IConfigurable;
    storage: (config: ConfigBuilder) => LooseObject;
}
