import { IWidget, IWidgetRenderer } from "../components/widget/IWidget";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { ReactNode } from "react";
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
import { ClockSourceComponent } from "../components/clock/ClockSourceComponent";
import { useRecoilValue } from "recoil";
import { clocksState } from "../components/Sync/Clocks";
import { ConfigurableType } from "../components/config/IConfigurable";
import { ConfigBuilder } from "../components/config/ConfigBuilder";
import { getRecoil } from "recoil-nexus";

const blink = keyframes`
    50% {
        opacity:0;
    }
`;

const Container = styled.div``;
const DisplayTime = styled(ClockSourceComponent)<{
    paused: boolean;
    overrun: boolean;
    widgetStyle: { overrunColor: string; color: string; fontSize: string };
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
    animation: ${(props: { paused: boolean }) =>
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
    clock: ClockSource<any> | null;
}) => {
    return (
        <div className={props.className}>
            <Tooltip title="Play">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Start(props.clock?.show || "", props.clock?.id || "");
                    }}
                >
                    <PlayArrow />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Pause">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Pause(props.clock?.show || "", props.clock?.id || "");
                    }}
                >
                    <PauseIcon />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Stop">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Stop(props.clock?.show || "", props.clock?.id || "");
                    }}
                >
                    <StopIcon />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Reset">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        Reset(props.clock?.show || "", props.clock?.id || "");
                    }}
                >
                    <RestartAlt />
                </ControlBarButton>
            </Tooltip>
        </div>
    );
};

const ControlBar = styled(renderControlBar)<{ widgetStyle: {} }>``;

const ClockDisplayContainer = (props: { config: ConfigBuilder }) => {
    // const clock = useClock(props.config.get("display.source")?.get() || "");
    const clock = useClock(props.config.raw("display.source") || "");
    return (
        <Container>
            <DisplayTime
                paused={clock?.clock.state === ClockState.PAUSED}
                overrun={clock?.clock.overrun || false}
                widgetStyle={props.config.raw("display")}
                clock={clock?.clock || null}
            />
            {props.config.get("controlBar.display")?.get() ? (
                <ControlBar
                    widgetStyle={props.config.raw("controlBar")}
                    clock={clock?.clock || null}
                />
            ) : null}
        </Container>
    );
};

const WidgetClockCompactRenderer: IWidgetRenderer = {
    render: (props: { config: ConfigBuilder }): ReactNode => {
        // Wrap because of hook constrains
        return <ClockDisplayContainer config={props.config} />;
    }
};

const tmp = (source: string) => {};

const ClockStorage = (builder: ConfigBuilder) => {
    const source = builder.get("display.source")?.get();
    const [show, id] = source.split(":");
    const clocks = getRecoil(clocksState(show));
    const clock = clocks.get(id);
    return clock?.clock || { settings: {} };
};

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
                        label: clock.clock.settings.displayName,
                        id: `${clock.clock.show}:${clock.clock.id}`
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
            displayName: "Show Control Bar",
            group: "controlBar",
            key: "display"
        }
        // {
        //     type: ConfigurableType.Options,
        //     category: "clock",
        //     displayName: "Behaviour",
        //     group: "settings",
        //     key: "behaviour",
        //     Enabled: (builder: ConfigBuilder) => {
        //         return builder.get("settings.behaviour")?.get() !== undefined;
        //     },
        //     Options: () => {
        //         return [
        //             { id: "stop", label: "Stop" },
        //             { id: "overrun", label: "Overrun" }
        //         ];
        //     },
        //     Storage: ClockStorage
        // },
        // {
        //     type: ConfigurableType.Options,
        //     category: "clock",
        //     displayName: "Direction",
        //     group: "settings",
        //     key: "direction",
        //     Enabled: (builder: ConfigBuilder) => {
        //         return builder.get("settings.direction")?.get() !== undefined;
        //     },
        //     Options: () => {
        //         return [
        //             { id: "countup", label: "Count Up" },
        //             { id: "countdown", label: "Count Down" }
        //         ];
        //     },
        //     Storage: ClockStorage
        // },
        // {
        //     type: ConfigurableType.Time,
        //     category: "clock",
        //     displayName: "Time",
        //     group: "settings",
        //     key: "time",
        //     Enabled: (config: ConfigBuilder) => {
        //         return config.get("settings.time")?.get() !== undefined;
        //     },
        //     Storage: ClockStorage
        // },
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
        //                     clock.clock.type !== "offset" &&
        //                     clock.clock.type !== "tod:offset" &&
        //                     clock.clock.type !== "sync"
        //             )
        //             .forEach((clock) =>
        //                 ret.push({
        //                     label: clock.clock.settings.displayName,
        //                     id: `${clock.clock.show}:${clock.clock.id}`
        //                 })
        //             );
        //         return ret;
        //     },
        //     Storage: ClockStorage
        // }
    ]
};

export default WidgetClock;
