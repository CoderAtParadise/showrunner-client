import { makeStyles } from "@material-ui/core";
import {
  Point,
  subtract,
  stringify,
  INVALID as INVALID_POINT,
} from "../common/Time";
import { Behaviour, Display, TimerState,Timer } from "../common/Timer";
import { Tracker } from "../common/Tracking";

const useStyles = makeStyles({
  root: {
    color: (props: { overrun: boolean }) => (props.overrun ? "red" : "grey"),
  },
});

const TimePoint = (props: { tracker: Tracker; clock: Point }) => {
  let timer: Timer;
  if(props.tracker.index > -1)
  timer = props.tracker.timers[props.tracker.index];
  else 
  timer = {start:INVALID_POINT,end:INVALID_POINT,state:TimerState.HIDDEN};
  let classes = useStyles({
    overrun: timer.state === TimerState.OVERRUN,
  });
  switch (props.tracker.settings.display) {
    case Display.ELAPSED:
      if (timer.state === TimerState.HIDDEN)
        return <span className={classes.root}>{stringify(INVALID_POINT)}</span>;
      else if (timer.state === TimerState.STOPPED && props.tracker.settings.behaviour === Behaviour.STOP)
        return (
          <span className={classes.root}>
            {stringify(subtract(timer.start, timer.end))}
          </span>
        );
      else
        return (
          <span className={classes.root}>
            {timer.state === TimerState.OVERRUN ? "+" : ""}
            {stringify(subtract(props.clock, timer.start))}
          </span>
        );
    case Display.COUNTDOWN:
      if (timer.state === TimerState.HIDDEN)
        return <span className={classes.root}>{stringify(INVALID_POINT)}</span>;
      else if (timer.state === TimerState.STOPPED && props.tracker.settings.behaviour === Behaviour.STOP)
        return (
          <span className={classes.root}>
            {stringify(subtract(timer.end, timer.start))}
          </span>
        );
      else
        return (
          <span className={classes.root}>
            {timer.state === TimerState.OVERRUN ? "-" : ""}
            {stringify(subtract(timer.end, props.clock))}
          </span>
        );
  }
};

export default TimePoint;
