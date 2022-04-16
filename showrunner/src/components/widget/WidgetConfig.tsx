import { useState } from "react";
import { Tooltip } from "@mui/material";
import { Settings, CloseRounded } from "@mui/icons-material";
import styled from "@emotion/styled";
import { Scrollable } from "../Scrollable";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { ConfigValue } from "../config/ConfigValue";
import { capitalizeFirstLetter } from "../../util/StringUtil";

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
    width: 60em;
    height: 40em;
    background-color: rgb(54, 54, 54);
    border: solid;
    border-radius: 3px;
    border-color: rgb(150, 150, 150);
`;

const Header = styled.div`
    width: 100%;
    height: 5%;
    /* font-size: 1.8em; */
    border-bottom: solid;
    border-color: rgb(150, 150, 150);
    align-items: center;
    display: inline-block;
    flex-direction: row;
`;

const ConfigContent = styled.div`
    display: flex;
    flex-direction: row;
    height: 95%;
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
    margin: 5px;
    font-size: 1.2em;
`;

const Title = styled.div`
    margin-top: 0.5em;
    font-weight: bold;
    width: 50%;
`;

const CloseButton = styled(CloseRounded)`
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

const FilterCategory = styled.div`
    font-size: 1.3em;
    border-bottom: solid;
    background-color: ${(props: { active: boolean }) =>
        props.active ? "rgb(100, 100, 100)" : ""};
    &:hover {
        color: rgb(200, 200, 200);
        cursor: pointer;
    }
`;

const FilterGroup = styled(FilterCategory)`
    margin-left: 20px;
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
                <Background onClick={() => setOpen(false)}>
                    <Menu onClick={(e) => e.stopPropagation()}>
                        <Header>
                            <CloseButton onClick={() => setOpen(false)} />
                            <Title>
                                {props.config
                                    .get("widget.displayName")
                                    ?.get() || ""}
                            </Title>
                        </Header>
                        <ConfigContent>
                            <Nav>
                                <Scrollable>
                                    {props.config.filters.map(
                                        (value: {
                                            display: string;
                                            filter: string;
                                            groups: {
                                                display: string;
                                                filter: string;
                                            }[];
                                        }) => {
                                            return (
                                                <div key={value.filter}>
                                                    <FilterCategory
                                                        active={
                                                            filter ===
                                                            value.filter
                                                        }
                                                        onClick={() =>
                                                            setFilter(
                                                                value.filter
                                                            )
                                                        }
                                                    >
                                                        {capitalizeFirstLetter(
                                                            value.display
                                                        )}
                                                    </FilterCategory>
                                                    {value.groups.map(
                                                        (v: {
                                                            display: string;
                                                            filter: string;
                                                        }) => (
                                                            <FilterGroup
                                                                active={
                                                                    filter ===
                                                                    v.filter
                                                                }
                                                                key={v.filter}
                                                                onClick={() =>
                                                                    setFilter(
                                                                        v.filter
                                                                    )
                                                                }
                                                            >
                                                                {capitalizeFirstLetter(
                                                                    v.display
                                                                )}
                                                            </FilterGroup>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </Scrollable>
                            </Nav>
                            <Configure>
                                <Scrollable>
                                    {props.config
                                        .filter(filter)
                                        /* eslint-disable indent */
                                        .map((value: ConfigValue<any>) => {
                                            if (value.configurable.Enabled) {
                                                return value.configurable.Enabled(
                                                    props.config
                                                ) ? (
                                                    <>
                                                        {value.render()}
                                                        <br />
                                                    </>
                                                ) : null;
                                            } else {
                                                return (
                                                    <>
                                                        {value.render()}
                                                        <br />
                                                    </>
                                                );
                                            }
                                        })}
                                    {/* eslint-enable indent */}
                                </Scrollable>
                            </Configure>
                        </ConfigContent>
                    </Menu>
                </Background>
            ) : null}
        </>
    );
};
