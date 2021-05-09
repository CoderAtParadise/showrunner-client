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
      <div style={{width:"100hw", height:"100vh",backgroundColor:"#121212", position:"fixed", overflowY:"hidden",overflowX:"hidden",}}>
        <SyncSource>
          <ClockSource>
            <Current></Current>
            <br />
            <Runsheet></Runsheet>
          </ClockSource>
        </SyncSource>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
