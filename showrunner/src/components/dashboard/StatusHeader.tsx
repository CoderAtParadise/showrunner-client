import styled from "@emotion/styled";
import { Settings } from "@mui/icons-material";
import { Tooltip, TooltipContent, TooltipHoverable } from "../tooltip";

const Header = styled.div`
    position: absolute;
    width: 15em;
    height: 5em;
    z-index: 1;
    right: 0%;
    border: solid;
    border-radius: 3px 3px 3px 18px;
    background-color: rgb(100, 100, 100);
`;

const SettingsTooltip = styled(Tooltip)`
    width: 10%;
    position: absolute;
    right: 0.5px;
`;

const SettingsButton = styled(Settings)`
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
    bottom: -150%;
    left: -125%;
`;

export const StatusHeader = (props: { className?: string }) => {
    return (
        <Header className={props.className}>
            <SettingsTooltip>
                <TooltipHoverable>
                    <SettingsButton onClick={() => {}} />
                </TooltipHoverable>
                <CloseButtonTooltipContent>Settings</CloseButtonTooltipContent>
            </SettingsTooltip>
        </Header>
    );
};
