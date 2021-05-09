import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { useState, Fragment } from "react";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"


const EditDialog = (props: { edit: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <Tooltip title="Edit">
            <IconButton onClick={() => setOpen(true)}>
                <EditIcon />
            </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => { setOpen(false) }}>
                <DialogTitle id="form-edit">Edit</DialogTitle>
                <DialogContent>

                </DialogContent>
            </Dialog>
        </Fragment>)
}

export default EditDialog;