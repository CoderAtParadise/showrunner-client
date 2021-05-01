import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import { CurrentContext, RunsheetContext, TrackingContext } from "./SyncSource";
import {
  stringify,
  subtract,
  Point,
  INVALID as INVALID_POINT,
} from "../common/Time";
import {
  get,
  Nested,
  Storage,
  Type,
  INVALID as INVALID_STORAGE,
} from "../common/Storage";
import { ClockContext } from "./ClockSource";
import { useContext } from "react";
import TimePoint from "./TimePoint";

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

  const tracking_session = tracking_list.get(current.session);
  const item = tracking_session?.trackers.get(current.active);
  const bracket = tracking_session?.trackers.get(item?.parent || "");
  const nitem = tracking_session?.trackers.get(current.next);

  let bs: Storage = INVALID_STORAGE;
  let is: Storage = INVALID_STORAGE;
  let nis: Storage = INVALID_STORAGE;
  if (tracking_session) {
    const ss = get(runsheet, tracking_session?.tracking_id || "");
    if (ss.type !== Type.INVALID) {
      const nbs = get((ss as unknown) as Nested, nitem?.parent || "");
      if (nbs.type !== Type.INVALID)
        nis = get((nbs as unknown) as Nested, current.next);
      bs = get((ss as unknown) as Nested, bracket?.tracking_id || "");
      if (bs.type !== Type.INVALID)
        is = get((bs as unknown) as Nested, current.active);
    }
  }
  if (bracket && item) {
    return (
      <Grid container className={classes.root}>
        <Grid container justify={"center"}>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <b>Total Run Time</b>
              <br />
              {stringify(
                subtract(clock, tracking_session?.timer.start || INVALID_POINT)
              )}
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              <b>Service</b>
              <br />
              {get(runsheet, tracking_session?.tracking_id || "").display}
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <b>Start Time</b> <br />
              {stringify(tracking_session?.timer.start || INVALID_POINT)}
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <b>Projected End Time</b>
              <br />
              {stringify(tracking_session?.timer.end || INVALID_POINT)}
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <b>Time</b>
              <br />
              {stringify(clock)}
            </Paper>
          </Grid>
        </Grid>
        <Grid container justify={"center"}>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              Bracket Duration:{" "}
              {stringify(bracket?.settings.duration || INVALID_POINT)} <br />
              <b>
                Item Duration:{" "}
                {stringify(item?.settings.duration || INVALID_POINT)}
              </b>
              <Button>Hide</Button>
            </Paper>
          </Grid>
          <Grid item xs={4} sm={4}>
            <Paper className={classes.paper}>
              Current Bracket: {bs?.display}
              <br />
              <b>Current Item: {is?.display}</b>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              Bracket Timer: <TimePoint tracker={bracket} clock={clock} />
              <br />
              <b>
                Item Timer: <TimePoint tracker={item} clock={clock} />
              </b>
              <Button>Show</Button>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper className={classes.paper}>
              <Button>Go</Button> <br />
              <b>Next: {nis.display}</b>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  } else return <div></div>;
};

export default Current;
