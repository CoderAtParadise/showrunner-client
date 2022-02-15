import { useState, useEffect, ReactNode } from "react";
import {
    Box,
    styled,
    IconButton,
    Tooltip,
    Popper,
    ClickAwayListener,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { IWidgetLayout, RenderMode } from "./IWidgetLayout";

const Container = styled(Box)`
    background-color: none;
    margin: 1em 1em;
    padding: 10px;
    width: fit-content;
    height: fit-content;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    overflow: hidden;
    background-color: rgb(160, 160, 160);
    background-image: linear-gradient(rgb(80, 80, 80), rgb(180, 180, 180));
    border-style: solid;
    border-radius: 1em;
    border-width: 0.2em;
    border-color: rgb(204, 204, 204);
`;

const WidgettPopper = styled(Popper)``;

const SettingsButton = styled(IconButton)`
    padding: 10px;
    width: 15px;
    height: 15px;
    float: right;
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 5;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;
const SettingsIcon = styled(Settings)`
    width: 15px;
    height: 15px; ;
`;

export const WidgetConfigure = (props: {
    className?: string;
    configMenu: ReactNode;
    widgetLayout: IWidgetLayout;
}) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [renderMode, setRenderMode] = useState(props.widgetLayout.renderMode);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const handleClickAway = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    useEffect(() => {}, [renderMode]);

    return (
        <span className={props.className}>
            <Tooltip title="Configure">
                <SettingsButton
                    disableRipple
                    onClick={(event) => handleClick(event)}
                >
                    <SettingsIcon />
                </SettingsButton>
            </Tooltip>
            <WidgettPopper
                open={open}
                anchorEl={anchorEl}
                placement="right-start"
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Container>
                        <ToggleButtonGroup
                            color="primary"
                            value={renderMode}
                            exclusive
                            onChange={(_, newV: string) =>
                                setRenderMode(newV as RenderMode)
                            }
                        >
                            <ToggleButton value={RenderMode.COMPACT}>
                                {RenderMode.COMPACT}
                            </ToggleButton>
                            <ToggleButton value={RenderMode.EXPANDED}>
                                {RenderMode.EXPANDED}
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {props.configMenu}
                    </Container>
                </ClickAwayListener>
            </WidgettPopper>
        </span>
    );
};
