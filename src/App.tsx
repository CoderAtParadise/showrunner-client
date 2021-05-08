import "./App.css";
import ClockSource from "./components/client/ClockSource";
import SyncSource from "./components/client/SyncSource";
import Current from "./components/client/Current";
import Runsheet from "./components/client/Runsheet";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <SyncSource>
        <ClockSource>
          <Current></Current>
          <br />
          <Runsheet></Runsheet>
        </ClockSource>
      </SyncSource>
    </MuiThemeProvider>
  );
}

export default App;
