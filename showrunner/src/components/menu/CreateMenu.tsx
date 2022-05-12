import styled from "@emotion/styled";
import { CloseRounded } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { Tooltip, TooltipContent, TooltipHoverable } from "../tooltip";
import { StateStorageWatcher } from "../config/StateStorageWatcher";
import { ConfigValue } from "../config/ConfigValue";
import { Scrollable } from "../Scrollable";
import { ConfigurableType, IConfigurable } from "../config/IConfigurable";
import { Offset } from "@coderatparadise/showrunner-common";

const Background = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgb(200, 200, 200);
    z-index: 2;
    justify-content: center;
    display: flex;
    align-items: center;
`;

const Header = styled.div`
    width: 100%;
    height: 5%;
    border-bottom: solid;
    border-color: rgb(150, 150, 150);
    align-items: center;
    display: inline-block;
    flex-direction: row;
`;

const ConfigContent = styled.div`
    display: flex;
    flex-direction: row;
    height: 95%;
    width: 100%;
`;

const Configure = styled.div`
    width: 70%;
    height: 100%;
    margin: 5px;
    font-size: 1.2em;
`;

const Menu = styled.div`
    width: 40em;
    height: 40em;
    background-color: rgb(54, 54, 54);
    border: solid;
    position: relative;
    border-radius: 3px;
    border-color: rgb(150, 150, 150);
`;

const Title = styled.div`
    margin-top: 0.5em;
    font-weight: bold;
    width: 50%;
`;

const SettingsTooltip = styled(Tooltip)`
    width: 10%;
    position: absolute;
    right: 0.5px;
`;

const CloseButton = styled(CloseRounded)`
    width: 0.8em;
    height: 0.8em;
    float: right;
    position: absolute;
    top: 0.2em;
    right: 0.2em;
    color: rgb(255, 255, 255);
    &:hover {
        color: rgb(200, 200, 200);
        cursor: pointer;
    }
`;

const CloseButtonTooltipContent = styled(TooltipContent)`
    top: -100%;
    left: 125%;
`;

const Br = styled.p`
    font-size: 50%;
`;

const TimerClockFilter = [
    "group:create_clock_base",
    "group:create_clock_behaviour",
    "group:create_clock_direction",
    "group:create_clock_time",
    "group:create_clock_button"
];
const OffsetClockFilter = [
    "group:create_clock_base",
    "group:create_clock_authority",
    "group:create_clock_behaviour",
    "group:create_clock_direction",
    "group:create_clock_time",
    "group:create_clock_button"
];
const TODClockFilter = [
    "group:create_clock_base",
    "group:create_clock_behaviour",
    "group:create_clock_direction",
    "group:create_clock_time",
    "group:create_clock_button"
];
const VideoClockFilter = [
    "group:create_clock_base",
    "group:create_clock_chanel",
    "group:create_clock_source",
    "group:create_clock_direction",
    "group:create_clock_button"
];

function validateBase(obj: any) {
    return obj.type !== undefined && obj.displayName !== undefined;
}

function validateBehaviour(obj: any) {
    return obj.behaviour !== undefined;
}

function validateDirection(obj: any) {
    return obj.direction !== undefined;
}

function validateTime(obj: any) {
    return obj.time !== undefined;
}

function validateAuthority(obj: any) {
    return obj.authority !== undefined;
}

function validateTimerSettings(obj: any) {
    return (
        validateBase(obj) && validateBehaviour(obj) && validateDirection(obj)
    );
}

function validateOffsetSettings(obj: any) {
    return (
        validateBase(obj) &&
        validateAuthority(obj) &&
        validateBehaviour(obj) &&
        validateDirection(obj) &&
        validateTime(obj)
    );
}

const creator: IConfigurable[] = [
    {
        type: ConfigurableType.Dropdown,
        category: "create:clock",
        displayName: "Clock Type",
        group: "create_clock_base",
        key: "type",
        defaultValue: "timer",
        Options: () => {
            return [
                { label: "Timer", id: "timer" },
                { label: "Offset", id: "offset" },
                { label: "Time of Day", id: "tod" },
                { label: "Video", id: "video" }
            ];
        }
    },
    {
        type: ConfigurableType.Text,
        category: "create:clock",
        displayName: "Clock Name",
        group: "create_clock_base",
        key: "displayName"
    },
    {
        type: ConfigurableType.Options,
        category: "create:clock",
        displayName: "Authority",
        group: "create_clock_authority",
        key: "authority"
    },
    {
        type: ConfigurableType.Dropdown,
        category: "create:clock",
        displayName: "Offset",
        group: "create_clock_offset",
        key: "offset",
        Options: () => {
            return [
                { label: "Start", id: Offset.START },
                { label: "End", id: Offset.END }
            ];
        }
    },
    {
        type: ConfigurableType.Time,
        category: "create:clock",
        displayName: "Time",
        group: "create_clock_time",
        key: "time"
    },
    {
        type: ConfigurableType.Dropdown,
        category: "create:clock",
        displayName: "Behaviour",
        group: "create_clock_behaviour",
        key: "behaviour",
        defaultValue: "stop",
        Options: () => {
            return [
                { id: "stop", label: "Stop" },
                { id: "overrun", label: "Overrun" }
            ];
        }
    },
    {
        type: ConfigurableType.Dropdown,
        category: "create:clock",
        displayName: "Direction",
        group: "create_clock_direction",
        key: "direction",
        defaultValue: "countup",
        Options: () => {
            return [
                { id: "countup", label: "Count Up" },
                { id: "countdown", label: "Count Down" }
            ];
        }
    },
    {
        type: ConfigurableType.Dropdown,
        category: "create:clock",
        displayName: "Chanel",
        group: "create_clock_chanel",
        key: "chanel"
    },
    {
        type: ConfigurableType.Options,
        category: "create:clock",
        displayName: "Source",
        group: "create_clock_source",
        key: "source"
    },
    {
        type: ConfigurableType.Button,
        category: "create:clock",
        displayName: "Create Clock",
        group: "create_clock_button",
        key: "create",
        onClick(builder: ConfigBuilder) {
            const storage = builder.getStorageWatcher("default").raw();
            let out: any = {};
            Object.values(storage as object).forEach((v: object) => {
                out = { ...out, ...v };
            });
            let error = false;
            switch (out.type) {
                case "timer":
                    if (!validateTimerSettings(out)) {
                        error = true;
                        builder.get("error.error")!.set(true);
                    }
                    break;
                case "offset":
                    if (!validateOffsetSettings(out)) {
                        error = true;
                        builder.get("error.error")!.set(true);
                    }
                    break;
            }

            if (!error) {
                // NOOP
            }
        }
    },
    {
        type: ConfigurableType.Boolean,
        category: "error",
        displayName: "ERROR",
        group: "error",
        key: "error"
    }
];

export const CreateClockMenu = (props: {
    className?: string;
    show: string;
    session: string;
}) => {
    const [isOpen, setOpen] = useState(false);
    const [clockFilter, setClockFilter] = useState<string[]>(TimerClockFilter);
    const [config, setConfig] = useState({});
    const builder = useMemo(() => {
        const b = new ConfigBuilder(
            props.show,
            props.session,
            new StateStorageWatcher(config, setConfig, () => {})
        );
        b.buildConfig(creator);
        b.listen(
            "create_clock_base.type",
            (prevState: string, newState: string) => {
                if (prevState !== newState) {
                    switch (newState) {
                        case "timer":
                            setConfig({ create_clock_base: { type: "timer" } });
                            setClockFilter(TimerClockFilter);
                            break;
                        case "offset":
                            setConfig({
                                create_clock_base: { type: "offset" }
                            });
                            setClockFilter(OffsetClockFilter);
                            break;
                        case "tod":
                            setConfig({ create_clock_base: { type: "tod" } });
                            setClockFilter(TODClockFilter);
                            break;
                        case "video":
                            setConfig({ create_clock_base: { type: "video" } });
                            setClockFilter(VideoClockFilter);
                            break;
                    }
                }
            }
        );
        return b;
    }, [config, props.session, props.show]);

    return isOpen ? (
        <Background
            className={props.className}
            onClick={() => {
                setOpen(false);
                setConfig({
                    create_clock_base: { type: "timer" }
                });
                setClockFilter(TimerClockFilter);
            }}
        >
            <Menu onClick={(e) => e.stopPropagation()}>
                <Header>
                    <SettingsTooltip>
                        <TooltipHoverable>
                            <CloseButton
                                onClick={() => {
                                    setOpen(false);
                                    setConfig({
                                        create_clock_base: { type: "timer" }
                                    });
                                    setClockFilter(TimerClockFilter);
                                }}
                            />
                        </TooltipHoverable>
                        <CloseButtonTooltipContent>
                            Close
                        </CloseButtonTooltipContent>
                    </SettingsTooltip>
                    <Title>Create</Title>
                </Header>
                <ConfigContent>
                    <Configure>
                        <Scrollable>
                            {builder
                                .filter(clockFilter)
                                /* eslint-disable indent */
                                .map((value: ConfigValue<any>) => {
                                    if (value.configurable.Enabled) {
                                        return value.configurable.Enabled(
                                            builder
                                        ) ? (
                                            <>
                                                {value.render(
                                                    `${value.configurable.group}.${value.configurable.key}`
                                                )}
                                                <Br />
                                            </>
                                        ) : null;
                                    } else {
                                        return (
                                            <>
                                                {value.render(
                                                    `${value.configurable.group}.${value.configurable.key}`
                                                )}
                                                <Br />
                                            </>
                                        );
                                    }
                                })}
                            {/* eslint-enable indent */}
                        </Scrollable>
                    </Configure>
                </ConfigContent>
            </Menu>
        </Background>
    ) : null;
};
