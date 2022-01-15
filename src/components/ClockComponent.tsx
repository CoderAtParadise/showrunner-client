import { ClockIdentifier } from "@coderatparadise/showrunner-common";
import { Box, experimentalStyled as styled } from "@mui/material";
import ClockPanel from "./ClockPanelComponent";

const Container = styled(Box)`
    background-color: rgb(54, 54, 54);
    width: fit-content;
    border: 2px;
    border: solid;
    border-radius: 1.3em;
    margin: 1em 1em;
`;

const ClockComponent = (props: { className?: string, clock: ClockIdentifier }) => {
    return (
        <Container className={props.className}>
            <ClockPanel clock={props.clock} />
        </Container>
    );
};

export default ClockComponent;
