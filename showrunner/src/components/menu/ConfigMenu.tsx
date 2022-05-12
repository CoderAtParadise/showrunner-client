import styled from "@emotion/styled";
import { CloseRounded } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import { capitalizeFirstLetter } from "../../util/StringUtil";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { ConfigValue } from "../config/ConfigValue";
import { Scrollable } from "../Scrollable";
import { TooltipContent, TooltipHoverable, Tooltip } from "../tooltip";

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
    position: relative;
    border-radius: 3px;
    border-color: rgb(150, 150, 150);
`;

const Header = styled.div`
    width: 100%;
    height: 5%;
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

const SettingsTooltip = styled(Tooltip)`
    width: 10%;
    position: absolute;
    right: 0.5px;
`;

const CloseButton = styled(CloseRounded)`
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
    top: -100%;
    left: 125%;
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

const Br = styled.p`
    font-size: 50%;
`;

export const ConfigMenu = (props: {
    className?: string;
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    menuTitle: string;
    config: ConfigBuilder;
}) => {
    const [filter, setFilter] = useState("");
    return props.isOpen ? (
        <Background className={props.className} onClick={() => props.setOpen(false)}>
            <Menu onClick={(e) => e.stopPropagation()}>
                <Header>
                    <SettingsTooltip>
                        <TooltipHoverable>
                            <CloseButton onClick={() => props.setOpen(false)} />
                        </TooltipHoverable>
                        <CloseButtonTooltipContent>
                            Close
                        </CloseButtonTooltipContent>
                    </SettingsTooltip>
                    <Title>{props.menuTitle}</Title>
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
                                                active={filter === value.filter}
                                                onClick={() =>
                                                    setFilter(value.filter)
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
                                                            filter === v.filter
                                                        }
                                                        key={v.filter}
                                                        onClick={() =>
                                                            setFilter(v.filter)
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
                                                {value.render(`${value.configurable.group}.${value.configurable.key}`)}
                                                <Br />
                                            </>
                                        ) : null;
                                    } else {
                                        return (
                                            <>
                                                {value.render(`${value.configurable.group}.${value.configurable.key}`)}
                                                <Br />
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
    ) : null;
};
