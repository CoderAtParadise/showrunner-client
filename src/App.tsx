import { createTheme, ThemeProvider } from "@mui/material";
import ClockSyncState from "./components/Sync/Clocks";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CreateClockMenu } from "./components/menu/CreateMenu";
import styled from "@emotion/styled";
import { FetchedState } from "./components/fetcher/Fetcher";
import { ClockList } from "./components/ClockList";
import { ServerConfigMenu } from "./components/ServerConfigMenu";
import { ClientSettings } from "./components/ClientConfig";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Background = styled.div`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 0.8em;
  color: white;
  width: 100%;
  height: 100vh;
  background-color: rgb(54, 54, 54);
  text-align: center;
  overflow-x: hidden;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

function App(props: { className?: string }) {
  createDir("showrunner", {
    dir: BaseDirectory.LocalData,
    recursive: true,
  });
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Background className={props.className}>
          <RecoilRoot>
            <RecoilNexus />
            <ClientSettings>
              <Content>
                <ClockSyncState show="system" session="system">
                  <FetchedState show="system" session="system">
                    <ServerConfigMenu />
                    <CreateClockMenu show="system" session="system" />
                    <ClockList show="system" session="system" />
                  </FetchedState>
                </ClockSyncState>
              </Content>
            </ClientSettings>
          </RecoilRoot>
        </Background>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
