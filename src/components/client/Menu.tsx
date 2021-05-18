import SpeedDial from "@material-ui/core/SpeedDial";
import AddIcon from "@material-ui/icons/Add";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import SpeedDialAction from "@material-ui/core/SpeedDialAction";
import MenuIcon from "@material-ui/icons/Menu";
import FolderIcon from "@material-ui/icons/Folder";
import { Fragment } from "react";
import LoadDialog from "./LoadDialog";
import DeleteRunsheetDialog from "./DeleteRunsheetDialog"

const SPD = styled(SpeedDial)`
position: fixed;
bottom: ${({theme}) => theme.spacing(4)};
right: ${({theme}) => theme.spacing(4)};
`
const Menu = () => {
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [deleteR, setDelete] = useState(false);

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
          key="delete"
          icon={<DeleteIcon />}
          onClick={() => setDelete(true)}
          tooltipTitle = "Delete Runsheet"
        />
        <SpeedDialAction
          key="load"
          icon={<FolderIcon />}
          onClick={() => setLoad(true)}
          tooltipTitle = "Load Runsheet"
        />
        <SpeedDialAction
          key="new"
          icon={<AddIcon />}
          tooltipTitle = "New Runsheet"
        />
      </SPD>
      <LoadDialog open={load} cb={setLoad}/>
      <DeleteRunsheetDialog open={deleteR} cb={setDelete}/>
    </Fragment>
  );
};

export default Menu;
