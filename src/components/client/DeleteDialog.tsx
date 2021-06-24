import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { useState, Fragment } from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { Delete } from "./Commands";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import RunsheetHandler from "../common/RunsheetHandler";
import { getProperty } from "../common/Storage";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";

const SButton = styled(Button)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Text = styled(DialogContentText)`
  color: ${({ theme }) => theme.palette.text.primary};
`;

const DText = styled(Grid)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const DeleteDialog = (props: {
  handler: RunsheetHandler;
  show: string;
  delete: string;
}) => {
  const [open, setOpen] = useState(false);
  const [global, setGlobal] = useState(false);
  const show = props.handler.getShow(props.show);
  const session = props.handler.getStorage(show!.session);
  const storage = props.handler.getStorage(props.delete);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobal(event.target.checked);
  };
  return (
    <Fragment>
      <Tooltip title="Delete">
        <IconButton onClick={() => setOpen(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle id="form-edit">
          Delete {getProperty(storage!, show!, "display")?.value || ""}
        </DialogTitle>
        <DialogContent>
          <Text>
            Are you sure you want to delete{" "}
            {getProperty(storage!, show!, "display")!.value} from{" "}
            {getProperty(session!, show!, "display")!.value}?
          </Text>
          <DText>
            <Checkbox
              checked={global}
              onChange={handleChange}
              name="Delete Everywhere"
            />
            Delete Everywhere
          </DText>
        </DialogContent>
        <DialogActions>
          <SButton
            onClick={() => {
              setGlobal(false);
              setOpen(false);
            }}
          >
            Cancel
          </SButton>
          <SButton
            onClick={() => {
              Delete(props.show, props.delete, global);
              setGlobal(false);
              setOpen(false);
            }}
          >
            Delete
          </SButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DeleteDialog;
