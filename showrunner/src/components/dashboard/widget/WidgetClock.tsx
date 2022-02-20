import { IWidget, IWidgetConfigMenu, IWidgetRenderer } from "./IWidget";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { IWidgetLayout } from "./IWidgetLayout";
import { ReactNode } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
    PlayArrow,
    Pause as PauseIcon,
    Stop as StopIcon,
    RestartAlt,
    AccessTime
} from "@mui/icons-material";
import { Start, Stop, Pause, Reset } from "../../../commands/Clock";
import { SMPTE } from "@coderatparadise/showrunner-common";

interface WidgetClockStyle {
    time: {
        overrunColor: string;
        color: string;
        fontSize: string;
    };
    controlBar: {};
}
interface WidgetClockConfig {
    clock: {
        source: string;
        controlbar: boolean;
        displayPause: boolean;
    };
}

const blink = keyframes`
    50% {
        opacity:0;
    }
`;

const Container = styled.div``;
const DisplayTime = styled.div<{
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

const renderControlBar = (props: { className?: string }) => {
    return (
        <div className={props.className}>
            <Tooltip title="Play">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        // Start(props.clock.clock.show, props.clock.clock.id);
                    }}
                >
                    <PlayArrow />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Pause">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        // Pause(props.clock.clock.show, props.clock.clock.id);
                    }}
                >
                    <PauseIcon />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Stop">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        // Stop(props.clock.clock.show, props.clock.clock.id);
                    }}
                >
                    <StopIcon />
                </ControlBarButton>
            </Tooltip>
            <Tooltip title="Reset">
                <ControlBarButton
                    disableRipple
                    onClick={() => {
                        // Reset(props.clock.clock.show, props.clock.clock.id);
                    }}
                >
                    <RestartAlt />
                </ControlBarButton>
            </Tooltip>
        </div>
    );
};

const ControlBar = styled(renderControlBar)<{ widgetStyle: {} }>``;

const WidgetClockCompactRenderer: IWidgetRenderer<
    WidgetClockStyle,
    WidgetClockConfig
> = {
    render: (props: {
        layout: IWidgetLayout<WidgetClockStyle, WidgetClockConfig>;
    }): ReactNode => {
        return (
            <Container>
                <DisplayTime
                    paused={true}
                    overrun={true}
                    widgetStyle={props.layout.style.time}
                >
                    {new SMPTE().toString()}
                </DisplayTime>
                {props.layout.config.clock.controlbar ? (
                    <ControlBar widgetStyle={props.layout.style.controlBar} />
                ) : null}
            </Container>
        );
    }
};

const WidgetClock: IWidget<WidgetClockStyle, WidgetClockConfig> = {
    renderMode: {
        compact: WidgetClockCompactRenderer,
        default: WidgetClockCompactRenderer
    },
    config: [
        {
            menu: "test",
            icon: (
                <AccessTime
                    style={{
                        width: "0.8em",
                        height: "0.8em"
                    }}
                />
            ),
            tooltip: "Clock",
            render: () => {
                return (
                    <>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                        <div>Test Menu</div>
                    </>
                );
            }
        }
    ]
};

export default WidgetClock;
