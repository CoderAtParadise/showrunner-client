import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import { SyncContext} from "./SyncSource";
import { stringify, subtract, INVALID as INVALID_POINT } from "../common/Time";
import {
  get,
  Nested,
  Storage,
} from "../common/Storage";
import { ClockContext } from "./ClockSource";
import { useContext } from "react";
import TimePoint from "./TimePoint";
import sendCommand from "./SendCommand";
import { INVALID_SESSION, INVALID_TRACKER, TrackingSession } from "../common/Tracking";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "200",
      padding: theme.spacing(1),
      position: "fixed",
      zIndex: 5,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: "80%",
    },
    go: {
      height: "70px",
      width: "70px",
      border: "solid",
      borderColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary,
    },
  })
);

function GetTSession(id: string): TrackingSession {
  const sync = useContext(SyncContext);
  return sync.tracking.get(id) || INVALID_SESSION;
}

function GetInSession(session:TrackingSession,id:string)
{
  return session.trackers.get(id) || INVALID_TRACKER;
}

const Current = () => {
  const classes = useStyles();
  const sync = useContext(SyncContext);
  const clock = useContext(ClockContext);


  const tsession = GetTSession(sync.current.session);
  const titem = GetInSession(tsession,sync.current.active);
  const tbracket = GetInSession(tsession,titem.parent);
  const session = get(sync.runsheet,tsession.tracking_id) as Storage & Nested;
  const bracket = get(session,tbracket.tracking_id) as Storage & Nested;
  const item = get(bracket,titem.tracking_id);

  const ntitem = GetInSession(tsession,sync.current.next);
  const ntbracket = GetInSession(tsession,ntitem.parent);
  const nbracket = get(session,ntbracket.tracking_id) as Storage & Nested;
  const nitem = get(nbracket,ntitem.tracking_id);

  return (
    <Grid container className={classes.root}>
      <Grid container justify={"center"}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <b>Total Run Time</b>
            <br />
            {stringify(subtract(clock, tsession.timer.start))}
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <b>Service</b>
            <br />
            {get(sync.runsheet, tsession.tracking_id).display}
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <b>Start Time</b>
            <br />
            {stringify(tsession.timer.start)}
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <b>Projected End Time</b>
            <br />
            {stringify(tsession.timer.end)}
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
      <Grid container justify={"center"} alignItems={"stretch"}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            Bracket Duration: {stringify(tbracket.settings.duration) }
              <br />
            <b>Item Duration: {stringify(titem.settings.duration)} </b>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            Current Bracket: {bracket.display}
            <br />
            <b>Current Item: {item.display}</b>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            Bracket Timer: <TimePoint tracker={tbracket} clock={clock} />
            <br />
            <b>Item Timer: <TimePoint tracker={titem} clock={clock} /></b>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Button
              className={classes.go}
              onClick={() => {
                sendCommand("goto", sync.current.session, sync.current.next);
              }}
            >
              Go
            </Button>
            <br />
            <b>Next: {nitem.display}</b>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Current;
