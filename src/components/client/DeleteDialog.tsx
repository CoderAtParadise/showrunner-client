import {Dialog, DialogContent, DialogTitle ,DialogContentText, DialogActions } from "@material-ui/core";
import { useState, Fragment,useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import sendCommand from "./SendCommand";
import {RunsheetContext} from "./SyncSource";


const DeleteDialog = (props:{session:string,delete:string}) => 
{
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <Tooltip title="Delete">
            <IconButton onClick={() => setOpen(true)}>
                <DeleteIcon />
            </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => { setOpen(false) }}>
                <DialogTitle id="form-edit">Delete {props.delete}</DialogTitle>
                <DialogContent>
                <DialogContentText>Are you sure you want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() =>setOpen(false)}>Cancel</Button>
                <Button onClick={() => {sendCommand("delete",props.session,props.delete); setOpen(false)}}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Fragment>)
}

export default DeleteDialog;