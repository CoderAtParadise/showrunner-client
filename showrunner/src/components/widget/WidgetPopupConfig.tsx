import { useState } from "react";
import { Tooltip } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { IWidgetLayout } from "./IWidgetLayout";
import styled from "@emotion/styled";

const SettingsButton = styled(Settings)`
    width: 0.8em;
    height: 0.8em;
    float: right;
    position: relative;
    top: 0.2em;
    right: 0.2em;
    color: rgb(255, 255, 255);
    &:hover {
        color: rgb(200, 200, 200);
    }
`;

export const WidgetConfigure = (props: {
    className?: string;
    layout: IWidgetLayout<any>;
    edit?: boolean;
}) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <div className={props.className}>
            <Tooltip title="Configure">
                <SettingsButton onClick={() => setOpen(!isOpen)} />
            </Tooltip>
        </div>
    );
};
