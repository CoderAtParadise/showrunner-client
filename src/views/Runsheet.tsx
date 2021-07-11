
import Current from "../components/client/Current";
import Menu from "../components/client/Menu";
import { useContext, Fragment } from "react";
import {SyncContext} from "../components/client/SyncState";
import Runsheet from "../components/client/Runsheet";
import ClientRunsheet from "../components/client/ClientRunsheetHandler";
import { experimentalStyled as styled } from "@material-ui/core/styles";

const Container = styled(Fragment)`
  overflow:hidden;
  width:100%
  background-color: white;
  max-height: 80%;
`

const ViewRunsheet = (props: any) => {
    const handler = new ClientRunsheet(useContext(SyncContext));
    return (
      <Fragment>
        <Current handler={handler} />
        <Container>
        <Runsheet handler={handler} />
        </Container>
        <Menu handler={handler} />
      </Fragment>
    );
  };

  export default ViewRunsheet;