import React from 'react';
import { format } from 'date-fns';
import { 
  FiCheck, 
  FiTarget, 
  FiClock, 
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import Button from '../common/Button';
import IconRenderer from '../common/IconRenderer';

const GoalCard = ({ goal, completed, onComplete, onIncomplete, selectedDate }) => {
  const getGoalIcon = (goal) => {
    return (
      <IconRenderer 
        iconType={goal.iconType || 'star'}
        style={{ color: getColorForGoalType(goal.type) }}
        size={24}
      />
    );
  };

  const getColorForGoalType = (type) => {
    switch (type) {
      case 'prayer':
      case 'spiritual': 
        return '#e74c3c';
      case 'health': 
        return '#27ae60';
      case 'education': 
        return '#3498db';
      case 'discipline': 
        return '#9b59b6';
      default: 
        return '#f39c12';
    }
  };

  const getGoalDescription = (goal) => {
    if (goal.id === 'skill_learning' && goal.customHours) {
      return `${goal.customHours} hours of focused learning`;
    }
    if (goal.id === 'gym') {
      return 'Physical exercise and fitness (Rest on Sundays)';
    }
    return goal.description || 'Complete this daily goal';
  };

  const isRestDay = (goal) => {
    const today = new Date();
    return goal.restDay && goal.restDay === format(today, 'EEEE');
  };

  // Handle rest day display
  if (isRestDay(goal)) {
    return (
      <div className="goal-card rest-day">
        <div className="goal-header">
          <span className="goal-icon">
            <IconRenderer 
              iconType="moon"
              style={{ color: '#666' }}
              size={24}
            />
          </span>
          <div className="goal-title-section">
            <h3>{goal.name}</h3>
          </div>
        </div>
        <p className="rest-day-message">Rest Day - Take a break today!</p>
      </div>
    );
  }

  return (
    <div className={`goal-card ${completed ? 'completed' : 'pending'}`}>
      <div className="goal-header">
        <span className="goal-icon">{getGoalIcon(goal)}</span>
        <div className="goal-title-section">
          <h3>{goal.name}</h3>
          {goal.genderSpecific && (
            <span className="gender-specific">({goal.genderSpecific} only)</span>
          )}
        </div>
        <div className="completion-status">
          {completed ? (
            <div className="status-badge completed-badge">
              <FiCheckCircle style={{marginRight: '5px', color: '#27ae60'}} />
              Done
            </div>
          ) : (
            <div className="status-badge pending-badge">
              <FiClock style={{marginRight: '5px', color: '#f39c12'}} />
              Pending
            </div>
          )}
        </div>
      </div>
      
      <p className="goal-description">{getGoalDescription(goal)}</p>
      
      <div className="goal-stats">
        <div className="stat">
          <FiTarget className="stat-icon" />
          <div>
            <span className="stat-value">{goal.currentStreak || 0}</span>
            <span className="stat-label">Current</span>
          </div>
        </div>
        <div className="stat">
          <FiClock className="stat-icon" />
          <div>
            <span className="stat-value">{goal.longestStreak || 0}</span>
            <span className="stat-label">Best</span>
          </div>
        </div>
      </div>
      
      <div className="goal-actions">
        {completed ? (
          <div className="action-buttons">
            <Button 
              onClick={onIncomplete}
              className="incomplete-button"
              size="small"
              variant="secondary"
            >
              <FiX /> Mark Incomplete
            </Button>
          </div>
        ) : (
          <div className="action-buttons">
            <Button 
              onClick={onComplete}
              className="complete-button"
              size="small"
            >
              <FiCheck /> Mark Complete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
