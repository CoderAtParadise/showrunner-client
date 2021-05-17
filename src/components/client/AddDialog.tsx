import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { useState, Fragment } from "react";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"


const AddDialog = (props: { parent?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <Tooltip title="Add">
            <IconButton onClick={() => setOpen(true)}>
                <AddIcon />
            </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={() => { setOpen(false) }}>
                <DialogTitle id="form-edit">Add</DialogTitle>
                <DialogContent>

                </DialogContent>
            </Dialog>
        </Fragment>)
}

export default AddDialog;