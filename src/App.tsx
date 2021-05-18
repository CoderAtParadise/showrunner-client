import ClockSource from "./components/client/ClockSource";
import SyncSource from "./components/client/SyncSource";
import Current from "./components/client/Current";
import Runsheet from "./components/client/Runsheet";
import Menu from "./components/client/Menu";
import { createTheme, ThemeProvider } from "@material-ui/core";
import styled from '@emotion/styled'

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #121212;
  position: fixed;
  overflowX: hidden;
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Background>
        <SyncSource>
          <ClockSource>
            <Current/>
            <br />
            <Runsheet/>
            <Menu/>
          </ClockSource>
        </SyncSource>
      </Background>
    </ThemeProvider>
  );
}

export default App;
