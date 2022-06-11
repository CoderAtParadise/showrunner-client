import ClockSyncState from "./components/Sync/Clocks";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { createDir, BaseDirectory } from "@tauri-apps/api/fs";
import { CreateClockMenu } from "./components/menu/CreateMenu";
import styled from "@emotion/styled";
import { FetchedState } from "./components/fetcher/Fetcher";
import { ClockList } from "./components/ClockList";
import { ServerConfigMenu } from "./components/ServerConfigMenu";
import { ClientSettings } from "./components/ClientConfig";
import { Dashboard } from "./components/dashboard/Dashboard";

function App(props: { className?: string }) {
  createDir("showrunner", {
    dir: BaseDirectory.LocalData,
    recursive: true,
  });
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <RecoilNexus />
        <ClientSettings>
          <ClockSyncState show="system" session="system">
            <FetchedState show="system" session="system">
              <Dashboard edit id="" />
            </FetchedState>
          </ClockSyncState>
        </ClientSettings>
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default App;
