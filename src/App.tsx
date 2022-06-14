import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ClientSettings } from "./components/ClientConfig";
import { Dashboard } from "./components/dashboard/Dashboard";

function App(props: { className?: string }) {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <RecoilNexus />
        <ClientSettings>
          <Dashboard edit id="" />
        </ClientSettings>
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default App;
