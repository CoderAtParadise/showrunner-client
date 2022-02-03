import {
    ClockIdentifier,
    ClockState
} from "@coderatparadise/showrunner-common";
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled, keyframes, css } from "@mui/material/styles";
import ClockSourceComponent from "./ClockSourceComponent";
import {
    Tune,
    DisplaySettings,
    PlayArrow,
    Pause as PauseIcon,
    Stop as StopIcon,
    RestartAlt
} from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";
import { Start, Stop, Pause, Reset } from "../../commands/Clock";

const Panel = styled(Box)`
    height: 8em;
    width: 15em;
    padding: 1em;

    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 2.5em;
    position: relative;
`;

const Title = styled(Box)`
    margin-top: 0.5em;
    font-weight: bold;
`;

const blink = keyframes`
    50% {
        opacity:0;
    }
`;

const Time = styled(ClockSourceComponent)`
    font-weight: bold;
    font-size: 1.5em;
    font-variant-numeric: tabular-nums;
    color: ${(props) => (props.overrun ? "#cf352e" : "")};
    animation: ${(props) =>
        props.paused &&
        css`
            ${blink} 1s linear infinite
        `};
`;

const SettingsButton = styled(IconButton)`
    padding: 10px;
    width: 20px;
    height: 20px;
    float: right;
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 5;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;

const DisplaySettingsButton = styled(IconButton)`
    padding: 10px;
    width: 20px;
    height: 20px;
    float: right;
    position: absolute;
    right: 30px;
    top: 5px;
    z-index: 5;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;

const ControlBarButton = styled(IconButton)`
    padding: 20px;
    width: 20px;
    height: 20px;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;

const ControlBar = styled(Box)``;

const ClockPanel = (props: {
    className?: string;
    clock: ClockIdentifier;
    settignsOpen: boolean;
    displaySettings: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <Panel className={props.className}>
            <Tooltip title="Config">
                <SettingsButton
                    disabled={!props.clock.configurable}
                    onClick={() => props.displaySettings(!props.settignsOpen)}
                >
                    <Tune />
                </SettingsButton>
            </Tooltip>
            <Tooltip title="Display">
                <DisplaySettingsButton>
                    <DisplaySettings />
                </DisplaySettingsButton>
            </Tooltip>
            <Title>{props.clock.clock.displayName}</Title>
            <Time
                clock={props.clock.clock}
                overrun={props.clock.clock.overrun}
                paused={props.clock.clock.state === ClockState.PAUSED}
            />
            <ControlBar>
                <Tooltip title="Play">
                    <ControlBarButton
                        disableRipple
                        onClick={() => {
                            Start(props.clock.clock.show, props.clock.clock.id);
                        }}
                    >
                        <PlayArrow />
                    </ControlBarButton>
                </Tooltip>
                <Tooltip title="Pause">
                    <ControlBarButton
                        disableRipple
                        onClick={() => {
                            Pause(props.clock.clock.show, props.clock.clock.id);
                        }}
                    >
                        <PauseIcon />
                    </ControlBarButton>
                </Tooltip>
                <Tooltip title="Stop">
                    <ControlBarButton
                        disableRipple
                        onClick={() => {
                            Stop(props.clock.clock.show, props.clock.clock.id);
                        }}
                    >
                        <StopIcon />
                    </ControlBarButton>
                </Tooltip>
                <Tooltip title="Reset">
                    <ControlBarButton
                        disableRipple
                        onClick={() => {
                            Reset(props.clock.clock.show, props.clock.clock.id);
                        }}
                    >
                        <RestartAlt />
                    </ControlBarButton>
                </Tooltip>
            </ControlBar>
        </Panel>
    );
};

export default ClockPanel;
