import Runsheet from "./components/client/Runsheet";
import { createTheme, ThemeProvider } from "@material-ui/core";
//import styled from "@emotion/styled";
import SyncState from "./components/client/SyncState";
import init from "./components/common/Init";

import { experimentalStyled as styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ViewRunsheet from "./views/Runsheet";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Background = styled(Box)`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.paper};
  position: fixed;
  overflow-x: hidden;
`;

function App() {
  init();
  return (
    <ThemeProvider theme={theme}>
      <Background>
        <SyncState>
          <ViewRunsheet />
        </SyncState>
      </Background>
    </ThemeProvider>
  );
}

export default App;
