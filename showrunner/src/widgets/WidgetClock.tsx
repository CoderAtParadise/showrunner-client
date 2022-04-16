import { IWidget, IWidgetRenderer } from "../components/widget/IWidget";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { ReactNode, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
    PlayArrow,
    Pause as PauseIcon,
    Stop as StopIcon,
    RestartAlt
} from "@mui/icons-material";
import { Start, Stop, Pause, Reset } from "../commands/Clock";
import { ClockState, ClockSource } from "@coderatparadise/showrunner-common";
import { useClock } from "../hooks/useClock";
import { ClockSourceComponent } from "../components/ClockSourceComponent";
import { clocksState } from "../components/Sync/Clocks";
import { ConfigurableType } from "../components/config/IConfigurable";
import { ConfigBuilder } from "../components/config/ConfigBuilder";
import { getRecoil } from "recoil-nexus";
import { StateStorageWatcher } from "../components/config/StateConfigStorageWatcher";

const blink = keyframes`
    50% {
        opacity:0;
    }
`;

const Container = styled.div``;
const ClockName = styled.div<{ widgetStyle: {} }>``;
const DisplayTime = styled(ClockSourceComponent)<{
    paused: boolean;
    overrun: boolean;
    widgetStyle: {
        flashPaused: boolean;
        overrunColor: string;
        color: string;
        fontSize: string;
    };
}>`
    font-weight: bold;
    font-size: ${(props: { widgetStyle: { fontSize: string } }) =>
        props.widgetStyle.fontSize};
    font-variant-numeric: tabular-nums;
    color: ${(props: {
        overrun: boolean;
        widgetStyle: { overrunColor: string; color: string };
    }) =>
        props.overrun
            ? props.widgetStyle.overrunColor
            : props.widgetStyle.color};
    animation: ${(props: {
        paused: boolean;
        widgetStyle: { flashPaused: boolean };
    }) =>
        props.widgetStyle.flashPaused &&
        props.paused &&
        css`
            ${blink} 1s linear infinite
        `};
`;

const ControlBarButton = styled(IconButton)`
    padding: 1em;
    width: 1em;
    height: 1em;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;

const renderControlBar = (props: {
    className?: string;
    show: string;
    clock: ClockSource<any> | null;
}) => {
    return (
        <div className={props.className}>
            <Tooltip title="Play">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Start(
                            props.show,
                            props.clock?.session || "",
                            props.clock?.id || ""
                        );
                    }}
                >
                    <PlayArrow />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Pause">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Pause(
                            props.show,
                            props.clock?.session || "",
                            props.clock?.id || ""
                        );
                    }}
                >
                    <PauseIcon />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Stop">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Stop(
                            props.show,
                            props.clock?.session || "",
                            props.clock?.id || ""
                        );
                    }}
                >
                    <StopIcon />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Reset">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Reset(
                            props.show,
                            props.clock?.session || "",
                            props.clock?.id || ""
                        );
                    }}
                >
                    <RestartAlt />
                </ControlBarButton>
            </Tooltip>
        </div>
    );
};

const ControlBar = styled(renderControlBar)<{ widgetStyle: {} }>``;

const ClockDisplayContainer = (props: {
    builder: ConfigBuilder;
    forceUpdate: () => void;
}) => {
    const clock = useClock(props.builder.get("display.source")?.get() || "");
    const [config, setConfig] = useState({
        settings: clock?.settings
    } as any);
    props.builder.addStorageWatcher(
        "clock",
        new StateStorageWatcher(config, setConfig, props.forceUpdate)
    );
    const [initialLoad, setInitialLoad] = useState(true);

    const fetchChannels = (): any => {
        try {
            fetch(`${serverurl}/command`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    command: "amp.channel",
                    data: {}
                })
            })
                .then((res) => res.json())
                .then((v) =>
                    props.builder.setFetched({ channels: v.message }, "clock")
                );
            return setTimeout(fetchChannels, 10000);
        } catch (err) {
            console.log("error", err);
        }
    };

    useEffect(() => {
        const timer = fetchChannels();
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }
        if (config !== clock?.settings) {
            const delayChange = setTimeout(() => {
                console.log("Clock Synced");
            }, 500);
            return () => clearTimeout(delayChange);
        }
        return () => {};
    }, [config, clock]);
    return (
        <Container>
            {props.builder.get("display.clockName")?.get() ? (
                <ClockName widgetStyle={props.builder.raw("display")}>
                    {clock?.displayName!()}
                </ClockName>
            ) : null}
            <DisplayTime
                paused={clock?.state === ClockState.PAUSED}
                overrun={clock?.overrun || false}
                widgetStyle={props.builder.raw("display")}
                clock={clock || null}
            />
            {props.builder.get("controlBar.display")?.get() ? (
                <ControlBar
                    widgetStyle={props.builder.raw("controlBar")}
                    show={props.builder.show}
                    clock={clock || null}
                />
            ) : null}
        </Container>
    );
};

const WidgetClockCompactRenderer: IWidgetRenderer = {
    render: (props: {
        config: ConfigBuilder;
        forceUpdate: () => void;
    }): ReactNode => {
        // Wrap because of hook constrains
        return (
            <ClockDisplayContainer
                builder={props.config}
                forceUpdate={props.forceUpdate}
            />
        );
    }
};

const serverurl = process.env.SERVER_URL || "http://localhost:3001";

const WidgetClock: IWidget = {
    renderMode: {
        compact: WidgetClockCompactRenderer,
        default: WidgetClockCompactRenderer
    },
    config: [
        {
            type: ConfigurableType.Options,
            category: "clock",
            displayName: "Source",
            group: "display",
            key: "source",
            Options: (builder: ConfigBuilder) => {
                const clocks = getRecoil(clocksState(builder.show));
                const ret: { label: string; id: string }[] = [];
                Array.from(clocks.values()).forEach((clock) =>
                    ret.push({
                        label: clock.displayName!(),
                        id: `${clock.session}:${clock.id}`
                    })
                );
                return ret;
            }
        },
        {
            type: ConfigurableType.Swatch,
            category: "clock",
            displayName: "Colour",
            group: "display",
            key: "color"
        },
        {
            type: ConfigurableType.Swatch,
            category: "clock",
            displayName: "Overrun Colour",
            group: "display",
            key: "overrunColor"
        },
        {
            type: ConfigurableType.Text,
            category: "clock",
            displayName: "Font Size",
            group: "display",
            key: "fontSize"
        },
        {
            type: ConfigurableType.Boolean,
            category: "clock",
            displayName: "Flash When Paused",
            group: "display",
            key: "flashPaused"
        },
        {
            type: ConfigurableType.Boolean,
            category: "clock",
            displayName: "Show Name",
            group: "display",
            key: "clockName"
        },
        {
            type: ConfigurableType.Boolean,
            category: "clock",
            displayName: "Show Control Bar",
            group: "controlBar",
            key: "display"
        },
        {
            type: ConfigurableType.Options,
            category: "clock",
            displayName: "Behaviour",
            group: "settings",
            key: "behaviour",
            storage: "clock",
            Enabled: (builder: ConfigBuilder) => {
                return builder.get("settings.behaviour")?.get() !== undefined;
            },
            Options: () => {
                return [
                    { id: "stop", label: "Stop" },
                    { id: "overrun", label: "Overrun" }
                ];
            }
        },
        {
            type: ConfigurableType.Options,
            category: "clock",
            displayName: "Channel",
            group: "settings",
            key: "channel",
            storage: "clock",
            Options: (
                builder: ConfigBuilder
            ): { label: string; id: string }[] => {
                const channels = builder.fetched("channels", "clock") || [];
                const options: { label: string; id: string }[] = [];
                (channels as string[]).forEach((v) => {
                    options.push({ label: v, id: v });
                });
                return options;
            },
            Enabled: (builder: ConfigBuilder) => {
                return builder.get("settings.channel")?.get() !== undefined;
            }
        },
        {
            type: ConfigurableType.Dropdown,
            category: "clock",
            displayName: "Direction",
            group: "settings",
            key: "direction",
            storage: "clock",
            Enabled: (builder: ConfigBuilder) => {
                return builder.get("settings.direction")?.get() !== undefined;
            },
            Options: () => {
                return [
                    { id: "countup", label: "Count Up" },
                    { id: "countdown", label: "Count Down" }
                ];
            }
        },
        {
            type: ConfigurableType.Time,
            category: "clock",
            displayName: "Time",
            group: "settings",
            key: "time",
            storage: "clock",
            Enabled: (config: ConfigBuilder) => {
                return config.get("settings.time")?.get() !== undefined;
            }
        },
        {
            type: ConfigurableType.Text,
            category: "clock",
            displayName: "Clock Name",
            group: "settings",
            key: "displayName",
            storage: "clock",
            Enabled: (config: ConfigBuilder) => {
                return config.get("settings.displayName")?.get() !== undefined;
            }
        }
        // {
        //     type: ConfigurableType.Options,
        //     category: "clock",
        //     displayName: "Authority",
        //     group: "settings",
        //     key: "authority",
        //     Enabled: (builder: ConfigBuilder) => {
        //         return builder.get("settings.authority")?.get() !== undefined;
        //     },
        //     Options: (builder: ConfigBuilder) => {
        //         const clocks = useRecoilValue(clocksState(builder.show));
        //         const ret: { label: string; id: string }[] = [];
        //         Array.from(clocks.values())
        //             .filter(
        //                 (clock) =>
        //                     clock.type !== "offset" &&
        //                     clock.type !== "tod:offset" &&
        //                     clock.type !== "sync"
        //             )
        //             .forEach((clock) =>
        //                 ret.push({
        //                     label: clock.settings.displayName,
        //                     id: `${clock.session}:${clock.id}`
        //                 })
        //             );
        //         return ret;
        //     },
        //     Storage: (builder: ConfigBuilder) => {
        //         return builder.getStorageWatcher("clock");
        //     }
        // }
    ]
};

export default WidgetClock;
