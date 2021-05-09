import SpeedDial from "@material-ui/lab/SpeedDial"
import AddIcon from "@material-ui/icons/Add";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useState } from "react";
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from '@material-ui/icons/Folder';
import { SpeedDialAction } from "@material-ui/lab";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            position: "fixed",
            bottom: theme.spacing(4),
            right: theme.spacing(4),
        },
    })
);

const Menu = (props: any) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    return (
        <SpeedDial ariaLabel="speeddial" onOpen={() => setOpen(true)} onClose={() => setOpen(false)} icon={<MenuIcon/>} className={classes.fab} direction={"up"} open={open}>
            <SpeedDialAction key="delete" icon={<DeleteIcon/>} tooltipTitle="Delete Runsheet"/>
            <SpeedDialAction key="save" icon={<SaveIcon/>} tooltipTitle="Save Runsheet"/>
            <SpeedDialAction key="load" icon={<FolderIcon/>} tooltipTitle="Load Runsheet"/>
            <SpeedDialAction key="new" icon={<AddIcon/>} tooltipTitle="New Runsheet"/>
        </SpeedDial>
    )
}

export default Menu;