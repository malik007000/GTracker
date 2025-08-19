import React from 'react';
import { FaFire } from 'react-icons/fa';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';


const StreakCounter = ({ goals }) => {
  const getOverallStats = () => {
    if (!goals.length) return { currentStreak: 0, longestStreak: 0, totalCompleted: 0 };
    
    const totalCompleted = goals.reduce((sum, goal) => 
      sum + (goal.completedDates?.length || 0), 0
    );
    
    const avgCurrentStreak = Math.round(
      goals.reduce((sum, goal) => sum + (goal.currentStreak || 0), 0) / goals.length
    );
    
    const maxLongestStreak = Math.max(
      ...goals.map(goal => goal.longestStreak || 0)
    );
    
    return {
      currentStreak: avgCurrentStreak,
      longestStreak: maxLongestStreak,
      totalCompleted
    };
  };

  const stats = getOverallStats();

  return (
    <div className="streak-counter">
      <div className="streak-cards">
        <div className="streak-card primary">
          <div className="streak-icon">
            <FaFire />
          </div>
          <div className="streak-info">
            <span className="streak-number">{stats.currentStreak}</span>
            <span className="streak-label">Current Streak</span>
          </div>
        </div>
        
        <div className="streak-card">
          <div className="streak-icon">
            <FiTrendingUp />
          </div>
          <div className="streak-info">
            <span className="streak-number">{stats.longestStreak}</span>
            <span className="streak-label">Longest Streak</span>
          </div>
        </div>
        
        <div className="streak-card">
          <div className="streak-icon">
            <FiCalendar />
          </div>
          <div className="streak-info">
            <span className="streak-number">{stats.totalCompleted}</span>
            <span className="streak-label">Total Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
