import React from 'react';
import { FaFire } from 'react-icons/fa';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';


const Achievements = ({ userProfile }) => {
  const calculateAchievements = () => {
    if (!userProfile?.goals) return [];

    const achievements = [];
    const goals = userProfile.goals;

    // Streak achievements
    const maxCurrentStreak = Math.max(...goals.map(g => g.currentStreak || 0));
    const maxLongestStreak = Math.max(...goals.map(g => g.longestStreak || 0));

    if (maxCurrentStreak >= 3) achievements.push({
      id: 'streak_3',
      title: '3-Day Warrior',
      description: 'Maintained a 3-day streak',
      icon: <FaFire />,
      type: 'streak',
      unlocked: true
    });

    if (maxCurrentStreak >= 7) achievements.push({
      id: 'streak_7',
      title: '7-Day Champion',
      description: 'Achieved a 7-day streak',
      icon: <FaFire />,
      type: 'streak',
      unlocked: true
    });

    if (maxCurrentStreak >= 30) achievements.push({
      id: 'streak_30',
      title: '30-Day Legend',
      description: 'Completed a 30-day streak',
      icon: <FaFire />,
      type: 'streak',
      unlocked: true
    });

    if (maxLongestStreak >= 90) achievements.push({
      id: 'streak_90',
      title: '90-Day Master',
      description: 'Achieved a 90-day streak',
      icon: <FaFire />,
      type: 'streak',
      unlocked: true
    });

    // Goal completion achievements
    const totalCompleted = goals.reduce((sum, goal) => sum + (goal.completedDates?.length || 0), 0);

    if (totalCompleted >= 50) achievements.push({
      id: 'completed_50',
      title: 'Goal Crusher',
      description: 'Completed 50 goals',
      icon: <FiTarget />,
      type: 'completion',
      unlocked: true
    });

    if (totalCompleted >= 100) achievements.push({
      id: 'completed_100',
      title: 'Century Achiever',
      description: 'Completed 100 goals',
      icon: <FiTarget />,
      type: 'completion',
      unlocked: true
    });

    // Perfect day achievements
    const today = new Date().toDateString();
    const completedToday = goals.filter(goal => 
      goal.completedDates?.includes(today)
    ).length;

    if (completedToday === goals.length && goals.length > 0) {
      achievements.push({
        id: 'perfect_day',
        title: 'Perfect Day',
        description: 'Completed all goals in one day',
        icon: <FaStar />,
        type: 'special',
        unlocked: true
      });
    }

    // Consistency achievements
    const consistentGoals = goals.filter(goal => {
      const streak = goal.currentStreak || 0;
      return streak >= 14; // 2 weeks
    });

    if (consistentGoals.length >= 3) {
      achievements.push({
        id: 'consistency_master',
        title: 'Consistency Master',
        description: 'Maintained 2-week streaks on 3+ goals',
        icon: <FiCalendar />,
        type: 'consistency',
        unlocked: true
      });
    }

    // Add locked achievements for motivation
    const lockedAchievements = [
      {
        id: 'streak_180',
        title: '180-Day Legendary',
        description: 'Achieve a 180-day streak',
        icon: <FaFire />,
        type: 'streak',
        unlocked: maxLongestStreak >= 180
      },
      {
        id: 'completed_365',
        title: 'Year of Excellence',
        description: 'Complete 365 goals',
        icon: <FiTrendingUp />,
        type: 'completion',
        unlocked: totalCompleted >= 365
      },
      {
        id: 'social_star',
        title: 'Social Star',
        description: 'Get 100 likes on posts',
        icon: <FaStar />,
        type: 'social',
        unlocked: false // Would need to track likes
      }
    ];

    return [...achievements, ...lockedAchievements];
  };

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const getAchievementColor = (type) => {
    switch (type) {
      case 'streak': return '#ff6b6b';
      case 'completion': return '#4ecdc4';
      case 'special': return '#ffe66d';
      case 'consistency': return '#a8e6cf';
      case 'social': return '#ff8b94';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="achievements">
      <div className="achievements-header">
        <h3>Achievements</h3>
        <p>{unlockedCount} of {achievements.length} unlocked</p>
      </div>

      <div className="achievements-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            style={{
              borderColor: achievement.unlocked ? getAchievementColor(achievement.type) : '#666'
            }}
          >
            <div 
              className="achievement-icon"
              style={{
                color: achievement.unlocked ? getAchievementColor(achievement.type) : '#666'
              }}
            >
              {achievement.icon}
            </div>
            <div className="achievement-info">
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
            </div>
            {achievement.unlocked && (
              <div className="achievement-badge">
                <FaStar />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
