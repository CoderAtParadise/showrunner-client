import SpeedDial from "@material-ui/core/SpeedDial";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { useState } from "react";
import {
  Delete,
  Folder,
  Add,
  InsertDriveFileOutlined,
} from "@material-ui/icons";
import SpeedDialAction from "@material-ui/core/SpeedDialAction";
import MenuIcon from "@material-ui/icons/Menu";
import { Fragment } from "react";
import MenuRunsheetDialog, { StorageKey } from "./MenuRunsheetDialog";
import { LoadRunsheet, DeleteRunsheet } from "./Commands";
import RunsheetHandler from "../common/RunsheetHandler";
//import NewRunsheet from "./NewRunsheet";

const SPD = styled(SpeedDial)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing(4)};
  right: ${({ theme }) => theme.spacing(4)};
`;
const Menu = (props: { handler: RunsheetHandler }) => {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [deleteR, setDelete] = useState(false);
  const [newR, setNew] = useState(false);
  const [add, setAdd] = useState(false);

  return (
    <Fragment>
      <SPD
        ariaLabel="speeddial"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        icon={<MenuIcon />}
        direction={"up"}
        open={open}
      >
        <SpeedDialAction
          key="add"
          icon={<Add />}
          tooltipTitle="Add..."
          onClick={() => setAdd(true)}
        />
        <SpeedDialAction
          key="delete"
          icon={<Delete />}
          onClick={() => setDelete(true)}
          tooltipTitle="Delete Runsheet"
        />
        <SpeedDialAction
          key="load"
          icon={<Folder />}
          onClick={() => setLoad(true)}
          tooltipTitle="Load Runsheet"
        />
        <SpeedDialAction
          key="new"
          icon={<InsertDriveFileOutlined />}
          tooltipTitle="New Runsheet"
          onClick={() => setNew(true)}
        />
      </SPD>
      <MenuRunsheetDialog
        handler={props.handler}
        display="Load"
        open={load}
        openCb={setLoad}
        cb={(runsheet: StorageKey) => LoadRunsheet(runsheet.id)}
      />
      <MenuRunsheetDialog
        handler={props.handler}
        display="Delete"
        open={deleteR}
        openCb={setDelete}
        cb={(runsheet: StorageKey) => DeleteRunsheet(runsheet.id)}
      />
    </Fragment>
  );
};

/**
 * 
      <NewRunsheet open={newR} cb={setNew}/>
 */

export default Menu;
