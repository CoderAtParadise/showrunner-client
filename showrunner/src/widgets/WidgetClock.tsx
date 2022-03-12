import { IWidget, IWidgetRenderer } from "../components/widget/IWidget";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { IWidgetLayout } from "../components/widget/IWidgetLayout";
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

interface WidgetClockConfig {
    display: {
        source: string;
        displayPause: boolean;
        overrunColor: string;
        color: string;
        fontSize: string;
    };
    controlBar: {
        show?: boolean;
    };
}

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

const ClockDisplayContainer = (props: {
    layout: IWidgetLayout<WidgetClockConfig>;
}) => {
    const clock = useClock(props.layout.config.display.source);
    return (
        <Container>
            <DisplayTime
                paused={clock?.clock.state === ClockState.PAUSED}
                overrun={clock?.clock.overrun || false}
                widgetStyle={props.layout.config.display}
                clock={clock?.clock || null}
            />
            {props.layout.config.controlBar?.show ? (
                <ControlBar
                    widgetStyle={props.layout.config.controlBar}
                    clock={clock?.clock || null}
                />
            ) : null}
        </Container>
    );
};

const WidgetClockCompactRenderer: IWidgetRenderer<WidgetClockConfig> = {
    render: (props: {
        layout: IWidgetLayout<WidgetClockConfig>;
    }): ReactNode => {
        // Wrap because of hook constrains
        return <ClockDisplayContainer layout={props.layout} />;
    }
};

const WidgetClock: IWidget<WidgetClockConfig> = {
    renderMode: {
        compact: WidgetClockCompactRenderer,
        default: WidgetClockCompactRenderer
    },
    config: [
        {
            type: ConfigurableType.Options,
            category: "clock",
            displayName: "Source",
            group: "clock",
            key: "source",
            Options: (show: string) => {
                const clocks = useRecoilValue(clocksState(show));
                const ret: { label: string; id: string }[] = [];
                Array.from(clocks.values())
                    .filter(
                        (clock) =>
                            clock.clock.type !== "offset" &&
                            clock.clock.type !== "tod:offset" &&
                            clock.clock.type !== "sync"
                    )
                    .forEach((clock) =>
                        ret.push({
                            label: clock.clock.settings.displayName,
                            id: clock.clock.id
                        })
                    );
                return ret;
            }
        },
        {
            type: ConfigurableType.Swatch,
            category: "clock",
            displayName: "Overrun Colour",
            group: "display",
            key: "overrunColor"
        },
        {
            type: ConfigurableType.Swatch,
            category: "clock",
            displayName: "Colour",
            group: "display",
            key: "color"
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
            key: "displayPaused"
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
            displayName: "Clock Behaviour",
            group: "settings",
            key: "behaviour",
            Enabled: (config: ConfigBuilder) => {
                return config.get("settings.behaviour")?.get() !== undefined;
            },
            Options: () => {
                return [
                    { id: "stop", label: "Stop" },
                    { id: "overrun", label: "Overrun" }
                ];
            },
            Storage: (config: ConfigBuilder) => {
                const source = config.get("display.source");
                return {
                    settings: {}
                };
            }
        },
        {
            type: ConfigurableType.Options,
            category: "clock",
            displayName: "Clock Behaviour",
            group: "settings",
            key: "direction",
            Enabled: (config: ConfigBuilder) => {
                return config.get("settings.direction")?.get() !== undefined;
            },
            Options: () => {
                return [
                    { id: "countup", label: "Count Up" },
                    { id: "countdown", label: "Count Down" }
                ];
            },
            Storage: (config: ConfigBuilder) => {
                const source = config.get("display.source");
                return {
                    settings: {}
                };
            }
        }
    ]
};

export default WidgetClock;
