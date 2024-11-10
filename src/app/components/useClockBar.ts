import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

export const useClockBar = () => {
  const [dailyResetTime, setDailyResetTime] = useState(0);
  const [weeklyResetTime, setWeeklyResetTime] = useState(0);

  useEffect(() => {
    const calculateResetTimes = () => {
      const now = moment().utc();

      const nextDailyReset = moment().utc().startOf('day').add(10, 'hours');
      if (now.hour() >= 10) {
        nextDailyReset.add(1, 'days');
      }
      setDailyResetTime(nextDailyReset.valueOf());

      const nextWeeklyReset = moment().utc().startOf('week').add(3, 'days').add(10, 'hours');
      if (now.isSameOrAfter(nextWeeklyReset)) {
        nextWeeklyReset.add(1, 'week');
      }
      setWeeklyResetTime(nextWeeklyReset.valueOf());
    };

    calculateResetTimes();
    const intervalId = setInterval(calculateResetTimes, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return { dailyResetTime, weeklyResetTime };
};