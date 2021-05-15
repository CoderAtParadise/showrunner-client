import SpeedDial from "@material-ui/lab/SpeedDial";
import AddIcon from "@material-ui/icons/Add";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import { SpeedDialAction } from "@material-ui/lab";
import MenuIcon from "@material-ui/icons/Menu";
import FolderIcon from "@material-ui/icons/Folder";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@material-ui/core";
import { Fragment } from "react";
import { List,ListItem } from "@material-ui/core";
import { useEffect } from "react";
import LoadDialog from "./LoadDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
  })
);
const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const Menu = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [load,setLoad] = useState(false);
    
  return (
    <Fragment>
      <SpeedDial
        ariaLabel="speeddial"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        icon={<MenuIcon />}
        className={classes.fab}
        direction={"up"}
        open={open}
      >
        <SpeedDialAction
          key="delete"
          icon={<DeleteIcon />}
          tooltipTitle="Delete Runsheet"
        />
        <SpeedDialAction
          key="save"
          icon={<SaveIcon />}
          tooltipTitle="Save Runsheet"
        />
        <SpeedDialAction
          key="load"
          icon={<FolderIcon />}
          tooltipTitle="Load Runsheet"
          onClick={() => setLoad(true)}
        />
        <SpeedDialAction
          key="new"
          icon={<AddIcon />}
          tooltipTitle="New Runsheet"
        />
      </SpeedDial>
      <Dialog
        open={load}
        onClose={() => {
          setLoad(false);
        }}
      >
        <DialogTitle id="form-edit">Load Runsheet</DialogTitle>
        <DialogContent>
            <LoadDialog/>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Menu;
