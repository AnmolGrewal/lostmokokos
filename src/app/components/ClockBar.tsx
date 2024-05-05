import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const ClockBar = () => {
  const [times, setTimes] = useState({
    nextUpdate: '',
    dailyReset: '',
    weeklyReset: ''
  });

  const calculateCountdowns = () => {
    const now = moment().tz("America/Los_Angeles"); // Convert to PDT time

    // Next Update (Ladon Release at 3:00 AM on June 13th)
    const nextUpdateDate = moment.tz("2024-06-13 03:00", "America/Los_Angeles");
    const daysUntilUpdate = nextUpdateDate.diff(now, 'days');
    const hoursUntilUpdate = nextUpdateDate.subtract(daysUntilUpdate, 'days').diff(now, 'hours');
    const nextUpdate = `${daysUntilUpdate}d ${hoursUntilUpdate}h`;

    // Daily Reset at 3:00 AM PDT
    const nextDailyReset = moment().tz("America/Los_Angeles").startOf('day').add(3, 'hours');
    if (now.hour() >= 3) nextDailyReset.add(1, 'days'); // Move to the next day if past 3 AM
    const dailyReset = nextDailyReset.diff(now, 'hours') + 'h ' + (nextDailyReset.diff(now, 'minutes') % 60) + 'm';

    // Weekly Reset at 12:00 AM PDT Wednesday
    const nextWeeklyReset = moment().tz("America/Los_Angeles").startOf('week').add(3, 'days'); // Starts on Sunday, add 3 days to get to Wednesday
    if (now.isAfter(nextWeeklyReset)) nextWeeklyReset.add(1, 'week'); // Move to the next week if we're past this week's Wednesday
    const weeklyReset = nextWeeklyReset.diff(now, 'hours') + 'h ' + (nextWeeklyReset.diff(now, 'minutes') % 60) + 'm';

    setTimes({ nextUpdate, dailyReset, weeklyReset });
  };

  useEffect(() => {
    console.log("ClockBar is mounted");
    calculateCountdowns(); // Initial calculation
    const intervalId = setInterval(calculateCountdowns, 60000); // Update every minute
    return () => {
      console.log("Cleaning up ClockBar");
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, []);

  return (
    <div className="grid grid-cols-3 h-7 items-center justify-center gap-3 transition bg-primary-background-color">
      {/* First Column */}
      <div className="text-center">
        <span className='text-primary-text-label-color'>Ladon Release Date: <span className="font-semibold text-primary-text-label-color">{times.nextUpdate}</span></span>
      </div>

      {/* Second Column */}
      <div className="text-center">
        <span className='text-primary-text-label-color'>Daily Reset: <span className="font-semibold text-primary-text-label-color">{times.dailyReset}</span></span>
      </div>

      {/* Third Column */}
      <div className="text-center">
        <span className='text-primary-text-label-color'>Weekly Reset: <span className="font-semibold text-primary-text-label-color">{times.weeklyReset}</span></span>
      </div>
    </div>
  );
};

export default ClockBar;
