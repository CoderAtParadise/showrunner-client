import styled from "@emotion/styled";
import { ReactNode } from "react";

const TabGroup = styled.div`
    width: 90%;
    height: 1em;
    padding: 2rem 1rem;
    align-content: center;
    align-items: center;
    text-align: center;
    flex-direction: row;
    display:flex;
`;

export const Tabs = (props: { className?: string; children: ReactNode }) => {
    return <TabGroup className={props.className}>{props.children}</TabGroup>;
};
