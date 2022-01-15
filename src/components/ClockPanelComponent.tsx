import {
    ClockIdentifier,
    ClockState
} from "@coderatparadise/showrunner-common";
import { Box, Button, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import ClockSourceComponent from "./ClockSourceComponent";
import TuneIcon from "@mui/icons-material/Tune";

const Panel = styled(Box)`
    height: 8em;
    background-color: rgb(160, 160, 160);
    background-image: linear-gradient(rgb(80, 80, 80), rgb(180, 180, 180));
    border-style: solid;
    border-radius: 1em;
    border-width: 0.2em;
    width: 15em;
    padding: 1em;

    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 2em;
    position: relative;
`;

const Title = styled(Box)`
    font-weight: bold;
`;

const Time = styled(ClockSourceComponent)`
    font-weight: bold;
    font-size: 1.5em;
    font-variant-numeric: tabular-nums;
    color: ${(props) => (props.overrun ? "#cf352e" : "")};
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
`;

const DisplayButton = styled(Button)`
    background-image: linear-gradient(
        0deg,
        hsla(0, 0%, 40%, 1) 0%,
        hsla(0, 0%, 30%, 1) 50.5%,
        rgb(87, 86, 86) 50.7%,
        hsla(0, 0%, 50%, 1) 100%
    ); /* Standards Compliant */
    border: 1px solid rgb(87, 87, 87);
    border-radius: 5px 5px 5px 5px; /* Opera 10.5, IE9, Saf5, Chrome, FF4, iOS 4, Android 2.1+ */
    padding: 0.7em 1em;

    /*  Shadow & Inner Shadow */
    box-shadow: 0px 1px 2px hsla(0, 0%, 0%, 0.5),
        inset 0px 1px 0px hsla(0, 0%, 100%, 0.15);

    color: lightgrey;
    font-weight: bold;
    text-shadow: 0em 0em 0.5em rgba(0, 0, 0, 0.2);

    transition-duration: 0.2s;
    &:hover {
        color: rgb(200, 200, 200);
        background-image: linear-gradient(
            0deg,
            hsla(0, 0%, 30%, 1) 0%,
            hsla(0, 0%, 20%, 1) 50.5%,
            rgb(87, 86, 86) 50.7%,
            hsla(0, 0%, 40%, 1) 100%
        ); /* Standards Compliant */
    }
`;

const ClockPanel = (props: { className?: string; clock: ClockIdentifier }) => {
    return (
        <Panel className={props.className}>
            <SettingsButton>
                <TuneIcon />
            </SettingsButton>
            <Title>{props.clock.clock.displayName}</Title>
            <Time
                clock={props.clock.clock}
                overrun={props.clock.clock.state === ClockState.OVERRUN}
            />
            <DisplayButton>Display Off</DisplayButton>
        </Panel>
    );
};

export default ClockPanel;
