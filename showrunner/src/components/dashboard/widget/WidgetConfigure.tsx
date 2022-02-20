import { useState, SyntheticEvent, ReactNode, Children } from "react";
import {
    IconButton,
    Tooltip,
    Popper,
    ClickAwayListener,
    Tabs,
    Tab
} from "@mui/material";
import { Settings, StyleRounded, Build } from "@mui/icons-material";
import { IWidgetLayout } from "./IWidgetLayout";
import { Scrollable } from "../../Scrollable";
import styled from "@emotion/styled";
import { IWidgetConfigMenu } from "./IWidget";

const ConfigContainer = styled.div`
    height: fit-content;
    width: 15em;
    max-height: 16.5em;
    min-height: 5em;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    border-style: solid;
    border-radius: 1em;
    border-width: 0.2em;
    padding: 0.4em;
`;

const Content = styled(Scrollable)`
    overflow: auto;
    height: fit-content;
    max-height: 14em;
    min-height: 5em;
`;

const SettingsButton = styled(IconButton)`
    width: 0.8em;
    height: 0.8em;
    float: right;
    /* right: 0.2em;
    top: 0.2em; */
    position: relative;
    &:hover {
        color: rgb(200, 200, 200);
    }
`;

const SettingsIcon = styled(Settings)`
    width: 0.8em;
    height: 0.8em; ;
`;

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
    menu: string;
}

const TabPanel = (props: TabPanelProps) => {
    return (
        <div
            role="tabpanel"
            hidden={props.value !== props.index}
            id={props.menu}
            style={{ width: "100%" }}
        >
            {props.value === props.index && <Content>{props.children}</Content>}
        </div>
    );
};

export const WidgetConfigure = (props: {
    className?: string;
    configMenus: IWidgetConfigMenu<any>[];
    layout: IWidgetLayout<any, any>;
    edit?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [tab, setTab] = useState(0);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const handleClickAway = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
    return (
        <div className={props.className}>
            <Tooltip title="Configure">
                <SettingsButton
                    disableRipple
                    onClick={(event) => handleClick(event)}
                >
                    <SettingsIcon />
                </SettingsButton>
            </Tooltip>
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="right-start"
                modifiers={[
                    {
                        name: "offset",
                        options: {
                            offset: [0, 15]
                        }
                    }
                ]}
            >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <ConfigContainer>
                        <Tabs
                            value={tab}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab
                                icon={
                                    <StyleRounded
                                        style={{
                                            width: "0.8em",
                                            height: "0.8em"
                                        }}
                                    />
                                }
                            />
                            <Tab
                                icon={
                                    <Build
                                        style={{
                                            width: "0.8em",
                                            height: "0.8em"
                                        }}
                                    />
                                }
                            />
                            {props.configMenus.map(
                                (value: IWidgetConfigMenu<any>) => (
                                    <Tab key={value.menu} icon={value.icon} />
                                )
                            )}
                        </Tabs>
                        {props.configMenus.map(
                            (value: IWidgetConfigMenu<any>, index: number) => (
                                <TabPanel
                                    key={value.menu}
                                    value={tab}
                                    index={index + 2}
                                    menu={value.menu}
                                >
                                    {value.render(
                                        props.layout.config[value.menu]
                                    )}
                                </TabPanel>
                            )
                        )}
                    </ConfigContainer>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};
