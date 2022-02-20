import {
    createTheme,
    ThemeProvider,
    experimentalStyled as styled,
    Box
} from "@mui/material";
import ClockSyncState from "./components/Sync/Clocks";
import ClockList from "./components/clock/ClockListComponent";
import { RecoilRoot } from "recoil";
import { Widget } from "./components/dashboard/widget/Widget";
import { RenderMode } from "./components/dashboard/widget/IWidgetLayout";

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
                <Widget
                    edit
                    layout={{
                        id: "testing",
                        widget: "TestWidget",
                        renderMode: RenderMode.COMPACT,
                        style: {
                            widget: {
                                header: true
                            }
                        },
                        position: { x: 0, y: 0, z: 0 },
                        config: {
                            widget: {
                                displayName: "Testing"
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
                        style: {
                            time: {
                                overrunColor: "#cf352e",
                                color: "#FFC354",
                                fontSize: "48px"
                            }
                        },
                        position: { x: 0, y: 0, z: 0 },
                        config: {
                            widget: {
                                displayName: "Clock Testing"
                            },
                            clock: {
                                source: "",
                                controlBar: true
                            }
                        }
                    }}
                />
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
