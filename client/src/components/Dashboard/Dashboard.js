import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  FiZap,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiTarget,
  FiAlertCircle,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../Auth/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import GoalCard from './GoalCard';
import StreakCounter from './StreakCounter';
import Calendar from '../Calendar/Calendar';
import PrayerGroup from '../Goals/PrayerGroup';
import toast from 'react-hot-toast';
import GoalManager from '../Goals/GoalManager';
import UserDebug from '../Debug/UserDebug';

const Dashboard = () => {
  const { userProfile, user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateProgress, setDateProgress] = useState({});
  const [completedGoals, setCompletedGoals] = useState({});
  const [completedPrayers, setCompletedPrayers] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [dailyStreaks, setDailyStreaks] = useState({ current: 0, longest: 0 });
  const [showGoalManager, setShowGoalManager] = useState(false);

  useEffect(() => {
    if (userProfile?.goals) {
      setGoals(userProfile.goals);
      calculateCompletedGoals(userProfile.goals);
      calculateDailyStreaks(userProfile.goals);
    }
    if (userProfile?.completedPrayers) {
      setCompletedPrayers(userProfile.completedPrayers);
    }
  }, [userProfile]);

  const calculateCompletedGoals = (goals) => {
    const completed = {};
    
    goals.forEach(goal => {
      goal.completedDates?.forEach(dateString => {
        if (!completed[dateString]) completed[dateString] = 0;
        completed[dateString]++;
      });
    });
    
    setCompletedGoals(completed);
  };

  const calculateDailyStreaks = (goals) => {
    // Calculate overall daily streaks (when ALL daily goals are completed)
    const allDates = new Set();
    const goalsPerDate = {};
    const completedPerDate = {};

    // Get all dates and count goals per date
    goals.forEach(goal => {
      goal.completedDates?.forEach(dateString => {
        allDates.add(dateString);
        if (!completedPerDate[dateString]) completedPerDate[dateString] = 0;
        completedPerDate[dateString]++;
      });
    });

    // Calculate which dates had ALL goals completed
    const perfectDays = [];
    allDates.forEach(dateString => {
      const date = new Date(dateString);
      const dailyGoals = getTodaysGoalsForDate(goals, date);
      const completed = completedPerDate[dateString] || 0;
      
      if (completed === dailyGoals.length && dailyGoals.length > 0) {
        perfectDays.push(dateString);
      }
    });

    // Calculate current streak
    const sortedPerfectDays = perfectDays.sort((a, b) => new Date(b) - new Date(a));
    let currentStreak = 0;
    const today = new Date().toDateString();
    
    if (sortedPerfectDays.includes(today)) {
      for (let i = 0; i < sortedPerfectDays.length; i++) {
        const daysDiff = Math.floor((new Date() - new Date(sortedPerfectDays[i])) / (1000 * 60 * 60 * 24));
        if (daysDiff === i) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allDatesArray = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
    
    for (let i = 0; i < allDatesArray.length; i++) {
      const date = allDatesArray[i];
      const dailyGoals = getTodaysGoalsForDate(goals, new Date(date));
      const completed = completedPerDate[date] || 0;
      
      if (completed === dailyGoals.length && dailyGoals.length > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    setDailyStreaks({ current: currentStreak, longest: longestStreak });
  };

  const isRestDay = (goal, date) => {
    if (goal.id === 'gym' && goal.restDay && goal.restDay === format(date, 'EEEE')) {
      return true;
    }
    return false;
  };

  const getTodaysGoalsForDate = (goals, date) => {
    return goals.filter(goal => {
      // Only exclude gym/workout on its rest day
      if (isRestDay(goal, date)) return false;
      return goal.isActive;
    });
  };

  const getTodaysGoals = () => {
    return getTodaysGoalsForDate(goals, selectedDate);
  };

  const markGoalComplete = async (goalId, date = selectedDate) => {
    const dateString = date.toDateString();
    
    // Check if already completed
    const goal = goals.find(g => g.id === goalId);
    if (goal?.completedDates?.includes(dateString)) {
      toast.error('Goal already completed for this date!');
      return;
    }

    try {
      const updatedGoals = goals.map(goal => {
        if (goal.id === goalId) {
          const newCompletedDates = [...(goal.completedDates || []), dateString];
          const newCurrentStreak = calculateIndividualStreak(newCompletedDates);
          const newLongestStreak = Math.max(goal.longestStreak || 0, newCurrentStreak);
          
          return {
            ...goal,
            completedDates: newCompletedDates,
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak
          };
        }
        return goal;
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        goals: updatedGoals
      });

      setGoals(updatedGoals);
      calculateCompletedGoals(updatedGoals);
      calculateDailyStreaks(updatedGoals);
      toast.success('Goal completed! 🎉');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const markGoalIncomplete = async (goalId, date = selectedDate) => {
    const dateString = date.toDateString();
    
    try {
      const updatedGoals = goals.map(goal => {
        if (goal.id === goalId) {
          const newCompletedDates = (goal.completedDates || []).filter(d => d !== dateString);
          const newCurrentStreak = calculateIndividualStreak(newCompletedDates);
          
          return {
            ...goal,
            completedDates: newCompletedDates,
            currentStreak: newCurrentStreak
          };
        }
        return goal;
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        goals: updatedGoals
      });

      setGoals(updatedGoals);
      calculateCompletedGoals(updatedGoals);
      calculateDailyStreaks(updatedGoals);
      toast.success('Goal marked as incomplete');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const markPrayerComplete = async (prayerId) => {
    const selectedDateString = selectedDate.toDateString();
    const prayerKey = `${prayerId}_${selectedDateString}`;
    
    try {
      const newCompletedPrayers = [...(completedPrayers[selectedDateString] || []), prayerKey];
      
      const updatedPrayers = {
        ...completedPrayers,
        [selectedDateString]: newCompletedPrayers
      };
      
      // Update user profile with prayer completions
      await updateDoc(doc(db, 'users', user.uid), {
        completedPrayers: updatedPrayers
      });
      
      setCompletedPrayers(updatedPrayers);
      toast.success('Prayer completed! 🤲');
    } catch (error) {
      console.error('Error updating prayer:', error);
      toast.error('Failed to update prayer');
    }
  };

  const markPrayerIncomplete = async (prayerId) => {
    const selectedDateString = selectedDate.toDateString();
    const prayerKey = `${prayerId}_${selectedDateString}`;
    
    try {
      const newCompletedPrayers = (completedPrayers[selectedDateString] || []).filter(p => p !== prayerKey);
      
      const updatedPrayers = {
        ...completedPrayers,
        [selectedDateString]: newCompletedPrayers
      };
      
      await updateDoc(doc(db, 'users', user.uid), {
        completedPrayers: updatedPrayers
      });
      
      setCompletedPrayers(updatedPrayers);
      toast.success('Prayer marked incomplete');
    } catch (error) {
      console.error('Error updating prayer:', error);
      toast.error('Failed to update prayer');
    }
  };

  const calculateIndividualStreak = (completedDates) => {
    if (!completedDates.length) return 0;
    
    const today = new Date();
    const sortedDates = completedDates
      .map(date => new Date(date))
      .sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const completedDate = sortedDates[i];
      const dayDiff = Math.floor((currentDate - completedDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (dayDiff === 1) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getTodayStats = () => {
    const todaysGoals = getTodaysGoals();
    const selectedDateString = selectedDate.toDateString();
    
    let completed = 0;
    let total = 0;
    
    todaysGoals.forEach(goal => {
      if (goal.type === 'prayer_group') {
        // For prayer groups, count individual prayers
        const prayersSelected = completedPrayers[selectedDateString] || [];
        const selectedPrayers = goal.prayers?.filter(prayer => 
          prayersSelected.includes(`${prayer.id}_${selectedDateString}`)
        ).length || 0;
        completed += selectedPrayers;
        total += goal.prayers?.length || 0;
      } else {
        // For regular goals
        if (goal.completedDates?.includes(selectedDateString)) {
          completed++;
        }
        total++;
      }
    });
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const getTotalCompletedCount = () => {
    let totalCompleted = 0;
    
    // Count regular goals
    totalCompleted += goals.reduce((sum, goal) => sum + (goal.completedDates?.length || 0), 0);
    
    // Count prayers
    Object.values(completedPrayers).forEach(dayPrayers => {
      totalCompleted += dayPrayers.length;
    });
    
    return totalCompleted;
  };

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Check if selected date is today
  const isSelectedDateToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  // Check if selected date is in the past
  const isSelectedDatePast = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected < today;
  };

  const stats = getTodayStats();
  const todaysGoals = getTodaysGoals();
  const totalCompleted = getTotalCompletedCount();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {userProfile?.displayName}! 👋</h1>
        <div className="header-actions">
          <button 
            className="manage-goals-button"
            onClick={() => setShowGoalManager(true)}
          >
            <FiTarget style={{marginRight: '8px'}} />
            Manage Goals
          </button>
          <button 
            className="calendar-toggle"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <FiCalendar style={{marginRight: '8px'}} />
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>
      </div>

      <div className="daily-progress-card">
        <div className="progress-circle">
          <div className="progress-ring">
            <svg className="progress-svg" width="100" height="100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#333"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#4ecdc4"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.percentage / 100)}`}
                className="progress-ring-fill"
              />
            </svg>
            <div className="progress-text">
              <span className="percentage">{stats.percentage}%</span>
              <span className="label">
                {isSelectedDateToday() ? 'Today' : format(selectedDate, 'MMM d')}
              </span>
            </div>
          </div>
        </div>
        <div className="progress-info">
          <p>{stats.completed} of {stats.total} goals completed</p>
          <p className="progress-subtext">
            {stats.percentage === 100 ? (
              <>
                <FiAward style={{color: '#ffe66d', marginRight: '5px'}} />
                {isSelectedDateToday() ? 'Perfect day!' : 'Perfect day achieved!'}
              </>
            ) : (
              isSelectedDateToday() ? 'Keep going!' : `${stats.percentage}% completed`
            )}
          </p>
        </div>
      </div>

      <div className="streak-counter">
        <div className="streak-cards">
          <div className="streak-card primary">
            <div className="streak-icon">
              <FiZap />
            </div>
            <div className="streak-info">
              <span className="streak-number">{dailyStreaks.current}</span>
              <span className="streak-label">Current Streak</span>
              <span className="streak-subtext">Perfect days in a row</span>
            </div>
          </div>
          
          <div className="streak-card">
            <div className="streak-icon">
              <FiTrendingUp />
            </div>
            <div className="streak-info">
              <span className="streak-number">{dailyStreaks.longest}</span>
              <span className="streak-label">Longest Streak</span>
              <span className="streak-subtext">Best performance</span>
            </div>
          </div>
          
          <div className="streak-card">
            <div className="streak-icon">
              <FiCalendar />
            </div>
            <div className="streak-info">
              <span className="streak-number">{totalCompleted}</span>
              <span className="streak-label">Total Completed</span>
              <span className="streak-subtext">All time goals</span>
            </div>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div className="calendar-section">
          <h2>
            <FiCalendar style={{marginRight: '5px'}} />
            Goal Calendar
          </h2>
          <Calendar 
            goals={goals}
            completedGoals={completedGoals}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      )}

      <div className="goals-section">
        <h2>
          <FiTarget style={{marginRight: '5px'}} />
          {isSelectedDateToday() ? "Today's Goals" : "Goals for"} ({format(selectedDate, 'MMMM d, yyyy')})
          {isSelectedDatePast() && (
            <span style={{color: '#ffc107', fontSize: '0.8em', marginLeft: '10px'}}>
              (Historical View - Read Only)
            </span>
          )}
        </h2>
        {todaysGoals.length === 0 ? (
          <div className="no-goals">
            <p>
              <FiAlertCircle style={{color: '#ff6b6b', marginRight: '5px'}} />
              No active goals set up yet!
            </p>
          </div>
        ) : (
          <div className="goals-grid">
            {todaysGoals.map(goal => (
              goal.type === 'prayer_group' ? (
                <PrayerGroup
                  key={goal.id}
                  goal={goal}
                  completedPrayers={completedPrayers[selectedDate.toDateString()] || []}
                  onPrayerComplete={markPrayerComplete}
                  onPrayerIncomplete={markPrayerIncomplete}
                  selectedDate={selectedDate}
                  readOnly={isSelectedDatePast()}
                />
              ) : (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  completed={goal.completedDates?.includes(selectedDate.toDateString())}
                  onComplete={() => markGoalComplete(goal.id)}
                  onIncomplete={() => markGoalIncomplete(goal.id)}
                  selectedDate={selectedDate}
                  readOnly={isSelectedDatePast()}
                />
              )
            ))}
          </div>
        )}
      </div>

      {userProfile?.gender && (
        <div className="user-info-badge">
          <span>
            <FiUser style={{marginRight: '5px'}} />
            {userProfile.gender} • {userProfile.religion}
          </span>
        </div>
      )}
      
      {showGoalManager && (
        <GoalManager onClose={() => setShowGoalManager(false)} />
      )}
    </div>
  );
};

export default Dashboard;
