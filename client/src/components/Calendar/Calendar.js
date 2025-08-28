import React, { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameDay
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Calendar = ({ goals, completedGoals, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Ensure all date comparisons use local midnight to avoid TZ drift
  const startOfDay = (d) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  // Stable key for a date (yyyy-mm-dd) without using toISOString (which is UTC)
  const keyForDate = (d) => format(startOfDay(d), 'yyyy-MM-dd');

  // Month boundaries (local)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Build a full calendar grid from week start to week end to keep weekday alignment correct
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const daysInGrid = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd]
  );

  const previousMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  const getDateCompletionStatus = (date) => {
    const dateString = startOfDay(date).toDateString();
    const completedCount = completedGoals[dateString] || 0;
    const totalGoals = goals.length;

    if (totalGoals === 0) return 'no-progress';
    if (completedCount === 0) return 'no-progress';
    if (completedCount === totalGoals) return 'complete';
    return 'partial';
  };

  const getCompletionPercentage = (date) => {
    const dateString = startOfDay(date).toDateString();
    const completedCount = completedGoals[dateString] || 0;
    const totalGoals = goals.length;
    return totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;
  };

  const handleDateClick = (date) => {
    onDateSelect(startOfDay(date));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav">
          <FiChevronLeft />
        </button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={nextMonth} className="calendar-nav">
          <FiChevronRight />
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {daysInGrid.map((date) => {
          const completionStatus = getDateCompletionStatus(date);
          const percentage = getCompletionPercentage(date);

          const isSelected =
            selectedDate &&
            isSameDay(startOfDay(date), startOfDay(selectedDate));

          return (
            <div
              key={keyForDate(date)}
              className={`calendar-day ${completionStatus} ${
                isToday(date) ? 'today' : ''
              } ${isSelected ? 'selected' : ''} ${
                !isSameMonth(date, currentMonth) ? 'other-month' : ''
              }`}
              onClick={() => handleDateClick(date)}
              style={{ cursor: 'pointer' }}
            >
              <span className="day-number">{format(date, 'd')}</span>
              {percentage > 0 && (
                <div className="completion-indicator">
                  <div
                    className="completion-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
