import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek, faSun } from '@fortawesome/free-solid-svg-icons';

/**
 * Renders a clock bar component that displays the time until the next Echidna release, the daily reset, and the weekly reset.
 * The component updates the countdown timers every minute using a setInterval.
 */
const ClockBar = () => {
  const [times, setTimes] = useState({
    nextUpdate: '',
    dailyReset: '',
    weeklyReset: '',
  });

  const calculateCountdowns = () => {
    const now = moment().tz('America/Los_Angeles');

    const nextUpdateDate = moment.tz('2024-06-13 03:00', 'America/Los_Angeles');
    const daysUntilUpdate = nextUpdateDate.diff(now, 'days');
    const hoursUntilUpdate = nextUpdateDate.subtract(daysUntilUpdate, 'days').diff(now, 'hours');
    const nextUpdate = `${daysUntilUpdate > 0 ? daysUntilUpdate + 'd ' : ''}${hoursUntilUpdate > 0 ? hoursUntilUpdate + 'h' : ''}`;

    const nextDailyReset = moment().tz('America/Los_Angeles').startOf('day').add(3, 'hours');
    if (now.hour() >= 3) nextDailyReset.add(1, 'days');
    const dailyReset = `${nextDailyReset.diff(now, 'hours')}h ${nextDailyReset.diff(now, 'minutes') % 60}m`;

    const nextWeeklyReset = moment().tz('America/Los_Angeles').startOf('week').add(3, 'days');
    if (now.isAfter(nextWeeklyReset)) nextWeeklyReset.add(1, 'week');
    const daysUntilWeeklyReset = nextWeeklyReset.diff(now, 'days');
    const hoursUntilWeeklyReset = nextWeeklyReset.subtract(daysUntilWeeklyReset, 'days').diff(now, 'hours');
    const minutesUntilWeeklyReset = nextWeeklyReset.subtract(hoursUntilWeeklyReset, 'hours').diff(now, 'minutes');
    const weeklyReset = `${daysUntilWeeklyReset > 0 ? daysUntilWeeklyReset + 'd ' : ''}${hoursUntilWeeklyReset > 0 ? hoursUntilWeeklyReset + 'h ' : ''}${minutesUntilWeeklyReset}m`;

    setTimes({ nextUpdate, dailyReset, weeklyReset });
  };

  useEffect(() => {
    calculateCountdowns();
    const intervalId = setInterval(calculateCountdowns, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-7 items-center justify-center transition bg-primary-background-color">
      {/* Echidna Release Date */}
      <div className="text-center text-sm md:text-base hidden md:block">
        <span className="text-primary-text-label-color">
          Echidna Release Date: <span className="font-semibold text-primary-text-label-color">{times.nextUpdate}</span>
        </span>
      </div>

      {/* Daily Reset */}
      <div className="text-center text-sm md:text-base">
        <FontAwesomeIcon icon={faSun} className="text-image-sun-color text-xs md:text-sm mr-1" />
        <span className="text-primary-text-label-color">
          Daily Reset: <span className="font-semibold text-primary-text-label-color">{times.dailyReset}</span>
        </span>
      </div>

      {/* Weekly Reset */}
      <div className="text-center text-sm md:text-base hidden md:block">
        <FontAwesomeIcon icon={faCalendarWeek} className="text-image-calendar-color text-xs md:text-sm mr-1" />
        <span className="text-primary-text-label-color">
          Weekly Reset: <span className="font-semibold text-primary-text-label-color">{times.weeklyReset}</span>
        </span>
      </div>
    </div>
  );
};

export default ClockBar;
