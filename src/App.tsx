import Runsheet from "./components/client/Runsheet";
import { createTheme, ThemeProvider } from "@material-ui/core";
import ClientRunsheet from "./components/client/ClientRunsheetHandler";
//import styled from "@emotion/styled";
import { useContext,Fragment} from "react";
import SyncState, { SyncContext } from "./components/client/SyncState";
import init from "./components/common/Init";
import Current from "./components/client/Current";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

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

const Wrapper = (props: any) => {
  const handler = new ClientRunsheet(useContext(SyncContext));
  return (<Fragment><Current handler = {handler} show={"3c8735e6-b536-419c-8950-9284116e50a2"}/><Runsheet handler={handler} /></Fragment>)
}

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
function App() {
  // eslint-disable-line no-unused-expressions
  init();
  return (
    <ThemeProvider theme={theme}>
      <Background>
        <SyncState>
          <Wrapper/>
        </SyncState>
      </Background>
    </ThemeProvider>
  );
}

export default App;
