import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { useState, Fragment } from "react";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"


const NewDialog = (props: { parent?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <Tooltip title="New">
            <IconButton onClick={() => setOpen(true)}>
                <AddIcon />
            </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => { setOpen(false) }}>
                <DialogTitle id="form-edit">New</DialogTitle>
                <DialogContent>

                </DialogContent>
            </Dialog>
        </Fragment>)
}

export default NewDialog;