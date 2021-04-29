import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import { TrackingSession } from "../common/Tracking";
import { CurrentContext, RunsheetContext, TrackingContext } from "./SyncSource";
import { stringify, subtract, INVALID as INVALID_POINT } from "../common/Time";
import { get, Nested, Storage } from "../common/Storage";
import { ClockContext } from "./ClockSource";
import { useContext } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  })
);

const Current = (props: any) => {
  const classes = useStyles();
  const current = useContext(CurrentContext);
  const clock = useContext(ClockContext);
  const tracking_list = useContext(TrackingContext);
  const runsheet = useContext(RunsheetContext);
  const session = tracking_list.get(current.session);
  const item = session?.trackers.get(current.active);
  const bracket = session?.trackers.get(item?.parent || "");
  let bs: Storage;
  let is: Storage;
  if (session) {
    bs = get(runsheet, session?.tracking_id || "");
    if (bs) is = get((bs as unknown) as Nested, current.active);
  }

  return (
    <Grid container className={classes.root}>
      <Grid container justify={"center"}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <b>Total Run Time</b>
            <br />
            {stringify(subtract(clock, session?.timer.start || INVALID_POINT))}
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <b>Service</b>
            <br />
            {get(runsheet, session?.tracking_id || "").display}
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <b>Start Time</b> <br />
            {stringify(
              tracking_list.get(current.session)?.timer.start || INVALID_POINT
            )}
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <b>Projected End Time</b>
            <br />
            {stringify(
              tracking_list.get(current.session)?.timer.end || INVALID_POINT
            )}
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            Time
            <br />
            <b>{stringify(clock)}</b>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify={"center"}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            Bracket Duration:{" "}
            {stringify(bracket?.settings.duration || INVALID_POINT)} <br />
            <b>
              Duration: {stringify(item?.settings.duration || INVALID_POINT)}
            </b>
            <Button>Hide</Button>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={5}>
          <Paper className={classes.paper}>
            Bracket: <br />
            <b>Current Item: {current.active}</b>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            Bracket Remaining:{" "}
            {stringify(
              subtract(
                bracket?.timers[bracket.index].end || INVALID_POINT,
                clock
              )
            )}
            <br />
            <b>
              Remaining:{" "}
              {stringify(
                subtract(item?.timers[item.index].end || INVALID_POINT, clock)
              )}{" "}
            </b>
            <Button>Show</Button>
            <br />
            Stage 2 Countdown: {stringify(INVALID_POINT)}
            <Button>Hide</Button>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Button>Go</Button> <br />
            Next: {current.next}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Current;
