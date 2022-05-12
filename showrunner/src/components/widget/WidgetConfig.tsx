import { useState } from "react";
import { Settings } from "@mui/icons-material";
import styled from "@emotion/styled";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { Tooltip, TooltipContent, TooltipHoverable } from "../tooltip";
import { ConfigMenu } from "../menu/ConfigMenu";

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

const SettingsTooltip = styled(Tooltip)`
    width: 10%;
    position: absolute;
    right: 0.5px;
`;

const ButtonTooltipContent = styled(TooltipContent)`
    left: 100%;
    top: -100%;
`;

export const WidgetConfig = (props: {
    className?: string;
    config: ConfigBuilder;
}) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <SettingsTooltip>
                <TooltipHoverable>
                    <SettingsButton onClick={() => setOpen(!isOpen)} />
                </TooltipHoverable>
                <ButtonTooltipContent>Configure</ButtonTooltipContent>
            </SettingsTooltip>
            <ConfigMenu
                isOpen={isOpen}
                setOpen={setOpen}
                config={props.config}
                menuTitle={props.config.get("widget.displayName")?.get() || ""}
            />
        </>
    );
};