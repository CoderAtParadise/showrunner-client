import {Dialog, DialogContent, DialogTitle ,DialogContentText } from "@material-ui/core";
import { useState, Fragment } from "react";
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip"


const DeleteDialog = (props:{delete:string}) => 
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
                <DialogTitle id="form-edit">Delete</DialogTitle>
                <DialogContent>
                <DialogContentText>Are you sure you want to delete?</DialogContentText>
                </DialogContent>
            </Dialog>
        </Fragment>)
}

export default DeleteDialog;