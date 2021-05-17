import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useContext } from "react";
import { SyncContext} from "./SyncSource";
import { get } from "../common/Storage";
import Session from "./Session";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { TrackingSession } from "../common/Tracking";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "100%",
      padding: theme.spacing(1),
      paddingTop: "180px",
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: "80%",
    },
  })
);

const Runsheet = () => {
  const classes = useStyles();
  const sync = useContext(SyncContext);
  return (
    <Grid container justify="center">
      <Grid item className={classes.root} xs={11}>
        <TableContainer component={Paper}>
          <Table stickyHeader size="small" aria-label="runsheet">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: "5%" }}></TableCell>
                <TableCell align="center" style={{ width: "5%" }}>
                  <b>Start</b>
                </TableCell>
                <TableCell align="center" style={{ width: "5%" }}>
                  <b>End</b>
                </TableCell>
                <TableCell align="center" style={{ width: "5%" }}>
                  <b>Duration</b>
                </TableCell>
                <TableCell align="center" style={{ width: "35%" }}>
                  <b>Display</b>
                </TableCell>
                <TableCell align="center" style={{ width: "5%" }}>
                  <b>Notes</b>
                </TableCell>
                <TableCell align="center" style={{ width: "5%" }}>
                  <b>Clock Type</b>
                </TableCell>
                <TableCell align="center" style={{ width: "5%" }}>
                  <b>Clock Behaviour</b>
                </TableCell>
                <TableCell align="center" style={{ width: "15%" }}>
                  <b>Control</b>
                </TableCell>
                <TableCell align="center" style={{ width: "15%" }}>
                  <b>Edit</b>
                </TableCell>
                <TableCell align="center" style={{ width: "5%" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(sync.tracking.values()).map((value:TrackingSession) => {
                  return <Session key={`${value.session_id}`} session={value} storage ={get(sync.runsheet,value.tracking_id)} active={sync.current.session === value.session_id}></Session>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Runsheet;
