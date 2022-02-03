import {
    createTheme,
    ThemeProvider,
    experimentalStyled as styled,
    Box
} from "@mui/material";
import ClockSyncState from "./components/Sync/Clocks";
import ClockList from "./components/clock/ClockListComponent";
import { RecoilRoot } from "recoil";

const theme = createTheme({
    palette: {
        mode: "dark"
    }
});

const Background = styled(Box)`
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 0.8em;
    color: white;
    width: 100%;
    height: 100vh;
    background-color: rgb(54, 54, 54);
    text-align: center;
    overflow-x: hidden;
`;

function App(props: { className?: string }) {
    return (
        <ThemeProvider theme={theme}>
            <Background className={props.className}>
                <RecoilRoot>
                    <ClockSyncState show="system">
                        <ClockList show="system" />
                    </ClockSyncState>
                </RecoilRoot>
            </Background>
        </ThemeProvider>
    );
}

export default App;
