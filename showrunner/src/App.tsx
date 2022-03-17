import {
    createTheme,
    ThemeProvider,
    experimentalStyled as styled,
    Box
} from "@mui/material";
import ClockSyncState from "./components/Sync/Clocks";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { Widget } from "./components/widget/Widget";
import { RenderMode } from "./components/widget/IWidgetLayout";

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
                    <RecoilNexus />
                    <ClockSyncState show="system">
                        <Widget
                            edit
                            layout={{
                                id: "testing",
                                widget: "TestWidget",
                                renderMode: RenderMode.COMPACT,
                                position: { x: 0, y: 0, z: 0 },
                                config: {
                                    widget: {
                                        displayName: "Testing",
                                        header: true
                                    }
                                }
                            }}
                        />
                        <Widget
                            edit
                            layout={{
                                id: "amptesting",
                                widget: "WidgetClock",
                                renderMode: RenderMode.COMPACT,
                                position: { x: 0, y: 0, z: 0 },
                                config: {
                                    widget: {
                                        displayName: "Amp Testing",
                                        header: true
                                    },
                                    display: {
                                        source: "system:fallback",
                                        overrunColor: "#cf352e",
                                        color: "#FFC354",
                                        fontSize: "36px"
                                    },
                                    controlBar: {
                                        display: true
                                    }
                                }
                            }}
                        />
                        <Widget
                            edit
                            layout={{
                                id: "clocktesting",
                                widget: "WidgetClock",
                                renderMode: RenderMode.COMPACT,
                                position: { x: 0, y: 0, z: 0 },
                                config: {
                                    widget: {
                                        displayName: "Clock Testing",
                                        header: true
                                    },
                                    display: {
                                        source: "system:ampctrl",
                                        overrunColor: "#cf352e",
                                        color: "#FFC354",
                                        fontSize: "36px"
                                    }
                                }
                            }}
                        />
                        {/* <ClockList show="system" /> */}
                    </ClockSyncState>
                </RecoilRoot>
            </Background>
        </ThemeProvider>
    );
}

export default App;
