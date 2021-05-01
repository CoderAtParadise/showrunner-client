import { makeStyles } from "@material-ui/core";
import {
  Point,
  subtract,
  stringify,
  greaterThan,
  INVALID as INVALID_POINT,
  Mutable_Point,
} from "../common/Time";
import { Behaviour, Display } from "../common/Timer";
import { Tracker } from "../common/Tracking";

const useStyles = makeStyles({
  root: {
    color: (props: { overrun: boolean }) => (props.overrun ? "red" : "grey"),
  },
});

const TimePoint = (props: { tracker: Tracker; clock: Point }) => {
  const timer = props.tracker.timers[props.tracker.index];
  const stop = greaterThan(props.clock, timer.end);
  let classes = useStyles({
    overrun: timer.overrun,
  });
  switch (props.tracker.settings.display) {
    case Display.ELAPSED:
      if (!timer.show)
        return <span className={classes.root}>{stringify(INVALID_POINT)}</span>;
      else if (stop && props.tracker.settings.behaviour === Behaviour.STOP)
        return (
          <span className={classes.root}>
            {stringify(subtract(timer.start, timer.end))}
          </span>
        );
      else
        return (
          <span className={classes.root}>
            {timer.overrun ? "+" : ""}
            {stringify(subtract(props.clock, timer.start))}
          </span>
        );
    case Display.COUNTDOWN:
      if (!timer.show)
        return <span className={classes.root}>{stringify(INVALID_POINT)}</span>;
      else if (stop && props.tracker.settings.behaviour === Behaviour.STOP)
        return (
          <span className={classes.root}>
            {stringify(subtract(timer.end, timer.start))}
          </span>
        );
      else
        return (
          <span className={classes.root}>
            {timer.overrun ? "-" : ""}
            {stringify(subtract(timer.end, props.clock))}
          </span>
        );
  }
};

export default TimePoint;
