import { Box, Button, experimentalStyled as styled } from "@mui/material";

const Container = styled(Box)`
    display: inline-block;
    text-align: center;
    padding-top: 1em;
    padding-bottom: 1em;
`;

const FlatButton = styled(Button)`
    background-color: rgb(126, 126, 126);
    border: 0px;
    border-radius: 0.5em;
    color: lightgrey;
    box-shadow: 0em 0em 0.5em rgb(0, 0, 0, 0.2);
    height: 0.5em;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-transform: none;
    font-size: 0.8em;
    transition-duration: 0.2s;
    &:hover {
        color: white;
        background-color: rgb(160, 160, 160);
    }
`;

const Menu = (props: { className?: string }) => {
    return (
        <Container className={props.className}>
            <FlatButton>Up</FlatButton>
            <FlatButton>Down</FlatButton>
            <FlatButton>Time</FlatButton>
        </Container>
    );
};

export default Menu;
