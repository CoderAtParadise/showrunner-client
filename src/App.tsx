import ClockSource from "./components/client/ClockSource";
import SyncSource from "./components/client/SyncSource";
import Current from "./components/client/Current";
import Runsheet from "./components/client/Runsheet";
import Menu from "./components/client/Menu";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{width:"100%", height:"100vh",backgroundColor:"#121212", position:"fixed", overflowX:"hidden",}}>
        <SyncSource>
          <ClockSource>
            <Current/>
            <br />
            <Runsheet/>
            <Menu/>
          </ClockSource>
        </SyncSource>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
