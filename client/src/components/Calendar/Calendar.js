import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Calendar = ({ goals, completedGoals, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDateCompletionStatus = (date) => {
    const dateString = date.toDateString();
    const completedCount = completedGoals[dateString] || 0;
    const totalGoals = goals.length;
    
    if (completedCount === 0) return 'no-progress';
    if (completedCount === totalGoals) return 'complete';
    return 'partial';
  };

  const getCompletionPercentage = (date) => {
    const dateString = date.toDateString();
    const completedCount = completedGoals[dateString] || 0;
    const totalGoals = goals.length;
    return totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;
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
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {daysInMonth.map(date => {
          const completionStatus = getDateCompletionStatus(date);
          const percentage = getCompletionPercentage(date);
          
          return (
            <div
              key={date.toISOString()}
              className={`calendar-day ${completionStatus} ${
                isToday(date) ? 'today' : ''
              } ${
                selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''
              } ${
                !isSameMonth(date, currentMonth) ? 'other-month' : ''
              }`}
              onClick={() => onDateSelect(date)}
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
