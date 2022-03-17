import { useState } from "react";
import { Tooltip } from "@mui/material";
import { Settings } from "@mui/icons-material";
import styled from "@emotion/styled";
import { Scrollable } from "../Scrollable";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { ConfigValue } from "../config/ConfigValue";

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

const Background = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgb(200, 200, 200);
    z-index: 2;
    justify-content: center;
    display: flex;
    align-items: center;
`;
const Menu = styled.div`
    width: 40em;
    height: 30em;
    background-color: rgb(54, 54, 54);
`;

const Header = styled.div`
    width: 100%;
    height: 10%;
    background-color: rgb(255, 255, 255);
`;

const ConfigContent = styled.div`
    display: flex;
    flex-direction: row;
    height: 90%;
    width: 100%;
`;

const Nav = styled.div`
    width: 30%;
    height: 100%;
    border-right: solid;
    border-color: rgb(150, 150, 150);
    flex-direction: column;
`;

const Configure = styled.div`
    width: 70%;
    height: 100%;
`;

export const WidgetConfig = (props: {
    className?: string;
    config: ConfigBuilder;
}) => {
    const [isOpen, setOpen] = useState(false);
    const [filter, setFilter] = useState("");
    return (
        <>
            <div className={props.className}>
                <Tooltip title="Configure">
                    <SettingsButton onClick={() => setOpen(!isOpen)} />
                </Tooltip>
            </div>
            {isOpen ? (
                <Background>
                    <Menu>
                        <Header onClick={() => setOpen(false)} />
                        <ConfigContent>
                            <Nav>
                                <Scrollable></Scrollable>
                            </Nav>
                            <Configure>
                                <Scrollable>
                                    {props.config
                                        .filter(filter)
                                        .map((value: ConfigValue<any>) => {
                                            if (value.configurable.Enabled) {
                                                return value.configurable.Enabled(
                                                    props.config
                                                )
                                                    ? value.render()
                                                    : null;
                                            } else return value.render();
                                        })}
                                </Scrollable>
                            </Configure>
                        </ConfigContent>
                    </Menu>
                </Background>
            ) : null}
        </>
    );
};
