import {
    createTheme,
    ThemeProvider,
    experimentalStyled as styled,
    Box
} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark"
    }
});

const Background = styled(Box)`
    width: 100%;
    height: 100vh;
    background-color: ${({ theme }) => theme.palette.background.paper};
    position: fixed;
    overflow-x: hidden;
`;

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Background>
              
            </Background>
        </ThemeProvider>
    );
}

export default App;
