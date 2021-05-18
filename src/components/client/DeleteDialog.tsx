import {Dialog, DialogContent, DialogTitle ,DialogContentText, DialogActions } from "@material-ui/core";
import { useState, Fragment } from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import sendCommand from "./SendCommand";
import GetStorage from "./GetStorage";
import {experimentalStyled as styled} from "@material-ui/core/styles";

const SButton = styled(Button)`
    color: ${({theme}) => theme.palette.text.secondary};
`

const DeleteDialog = (props:{session:string,delete:string}) => 
{
    const [open, setOpen] = useState(false);
    const storage = GetStorage(props.session,props.delete);
    return (
        <Fragment>
            <Tooltip title="Delete">
            <IconButton onClick={() => setOpen(true)}>
                <DeleteIcon />
            </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => { setOpen(false) }}>
                <DialogTitle id="form-edit">Delete {storage.display}</DialogTitle>
                <DialogContent>
                <DialogContentText>Are you sure you want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                <SButton onClick={() =>setOpen(false)}>Cancel</SButton>
                <SButton onClick={() => {sendCommand("delete",props.session,props.delete); setOpen(false)}}>Delete</SButton>
                </DialogActions>
            </Dialog>
        </Fragment>)
}

export default DeleteDialog;