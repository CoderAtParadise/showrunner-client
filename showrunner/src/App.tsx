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
import { ErrorBoundary } from "./components/ErrorBoundary";
import { createDir, BaseDirectory } from "@tauri-apps/api/fs";
import { CreateClockMenu } from "./components/menu/CreateMenu";

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
    createDir("showrunner", {
        dir: BaseDirectory.LocalData,
        recursive: true
    });
    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <Background className={props.className}>
                    <RecoilRoot>
                        <RecoilNexus />
                        <ClockSyncState show="system" session="system">
                            <CreateClockMenu show="system" session="system" />
                            <Widget
                                edit
                                layout={{
                                    id: "testing",
                                    widget: "TestWidget",
                                    renderMode: RenderMode.COMPACT,
                                    position: { x: 0, y: 0, z: 0 },
                                    config: {
                                        widget: {
                                            displayName:
                                                "A really long name that is supper long",
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
                                            displayName: "Clock Testing",
                                            header: true
                                        },
                                        display: {
                                            source: "system:system:fallback",
                                            overrunColor: "#cf352e",
                                            color: "#FFC354",
                                            fontSize: "36px"
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
                                            displayName: "Amp Testing",
                                            header: true
                                        },
                                        display: {
                                            source: "system:system:PVS",
                                            overrunColor: "#cf352e",
                                            color: "#FFC354",
                                            fontSize: "36px",
                                            controlBar: true
                                        }
                                    }
                                }}
                            />
                        </ClockSyncState>
                    </RecoilRoot>
                </Background>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
