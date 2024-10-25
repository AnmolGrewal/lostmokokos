import React from 'react';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek, faSun } from '@fortawesome/free-solid-svg-icons';
import {useClockBar} from './useClockBar';

const ClockBar = () => {
  const { dailyResetTime, weeklyResetTime } = useClockBar();

  const calculateCountdowns = () => {
    const now = moment().tz('America/Los_Angeles');

    const nextUpdateDate = moment.tz('2024-11-27 03:00', 'America/Los_Angeles');
    const daysUntilUpdate = nextUpdateDate.diff(now, 'days');
    const hoursUntilUpdate = nextUpdateDate.subtract(daysUntilUpdate, 'days').diff(now, 'hours');
    const nextUpdate = `${daysUntilUpdate > 0 ? daysUntilUpdate + 'd ' : ''}${hoursUntilUpdate > 0 ? hoursUntilUpdate + 'h' : ''}`;

    const dailyReset = moment(dailyResetTime).tz('America/Los_Angeles');
    const dailyResetCountdown = `${dailyReset.diff(now, 'hours')}h ${dailyReset.diff(now, 'minutes') % 60}m`;

    const weeklyReset = moment(weeklyResetTime).tz('America/Los_Angeles');
    const daysUntilWeeklyReset = weeklyReset.diff(now, 'days');
    const hoursUntilWeeklyReset = weeklyReset.subtract(daysUntilWeeklyReset, 'days').diff(now, 'hours');
    const minutesUntilWeeklyReset = weeklyReset.subtract(hoursUntilWeeklyReset, 'hours').diff(now, 'minutes');
    const weeklyResetCountdown = `${daysUntilWeeklyReset > 0 ? daysUntilWeeklyReset + 'd ' : ''}${hoursUntilWeeklyReset > 0 ? hoursUntilWeeklyReset + 'h ' : ''}${minutesUntilWeeklyReset}m`;

    return { nextUpdate, dailyResetCountdown, weeklyResetCountdown };
  };

  const { nextUpdate, dailyResetCountdown, weeklyResetCountdown } = calculateCountdowns();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-7 items-center justify-center transition bg-primary-background-color">
      {/* Seasonal */}
      <div className="text-center text-sm md:text-base hidden md:block">
        <span className="text-primary-text-label-color">
          Ignited Server Ending: <span className="font-semibold text-primary-text-label-color">{nextUpdate}</span>
        </span>
      </div>

      {/* Daily Reset */}
      <div className="text-center text-sm md:text-base">
        <FontAwesomeIcon icon={faSun} className="text-image-sun-color text-xs md:text-sm mr-1" />
        <span className="text-primary-text-label-color">
          Daily Reset: <span className="font-semibold text-primary-text-label-color">{dailyResetCountdown}</span>
        </span>
      </div>

      {/* Weekly Reset */}
      <div className="text-center text-sm md:text-base hidden md:block">
        <FontAwesomeIcon icon={faCalendarWeek} className="text-image-calendar-color text-xs md:text-sm mr-1" />
        <span className="text-primary-text-label-color">
          Weekly Reset: <span className="font-semibold text-primary-text-label-color">{weeklyResetCountdown}</span>
        </span>
      </div>
    </div>
  );
};

export default ClockBar;