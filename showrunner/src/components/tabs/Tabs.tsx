import styled from "@emotion/styled";
import { ReactNode } from "react";

const TabGroup = styled.div`
    width: 80%;
    height: 1em;
    padding: 2rem 1rem;
`;

export const Tabs = (props: { className?: string; children: ReactNode }) => {
    return <TabGroup className={props.className}>{props.children}</TabGroup>;
};
