import React, { useState } from 'react';
import { FiHeart, FiCheck, FiX, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import IconRenderer from '../common/IconRenderer';

const PrayerGroup = ({ goal, completedPrayers = [], onPrayerComplete, onPrayerIncomplete }) => {
  const [expandedView, setExpandedView] = useState(true); // Changed to true by default
  
  // Debug logs
  console.log('PrayerGroup goal:', goal);
  console.log('Prayers array:', goal.prayers);
  console.log('Completed prayers:', completedPrayers);
  
  const completedCount = completedPrayers.filter(p => {
    const today = new Date().toDateString();
    return goal.prayers?.some(prayer => p === `${prayer.id}_${today}`);
  }).length;
  
  const totalPrayers = goal.prayers?.length || 0;
  const completionPercentage = totalPrayers > 0 ? Math.round((completedCount / totalPrayers) * 100) : 0;
  
  const isPrayerCompleted = (prayerId) => {
    const today = new Date().toDateString();
    return completedPrayers.includes(`${prayerId}_${today}`);
  };

  return (
    <div className={`prayer-group-card ${completionPercentage === 100 ? 'completed' : 'pending'}`}>
      <div className="prayer-group-header" onClick={() => setExpandedView(!expandedView)}>
        <div className="prayer-group-info">
          <span className="prayer-group-icon">
            <IconRenderer 
              iconType={goal.iconType || 'spiritual'} 
              style={{ color: completionPercentage === 100 ? '#27ae60' : '#e74c3c' }}
              size={24}
            />
          </span>
          <div>
            <h3>{goal.name}</h3>
            <p className="prayer-description">{goal.description}</p>
          </div>
        </div>
        
        <div className="prayer-controls">
          <div className="prayer-progress">
            <div className="progress-circle-small">
              <svg width="40" height="40">
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  stroke="#333"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  stroke="#4ecdc4"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  strokeDashoffset={`${2 * Math.PI * 15 * (1 - completionPercentage / 100)}`}
                  className="progress-ring-fill"
                />
              </svg>
              <div className="progress-text-small">
                <span>{completedCount}/{totalPrayers}</span>
              </div>
            </div>
          </div>
          <div className="expand-icon">
            {expandedView ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>

      {expandedView && (
        <div className="prayer-list">
          <h4>Prayer Times</h4>
          {(!goal.prayers || goal.prayers.length === 0) ? (
            <p className="no-prayers">No prayers configured for this goal.</p>
          ) : (
            goal.prayers.map(prayer => (
              <div key={prayer.id} className={`prayer-item ${isPrayerCompleted(prayer.id) ? 'completed' : 'pending'}`}>
                <div className="prayer-info">
                  <span className="prayer-icon">
                    <IconRenderer 
                      iconType={prayer.iconType || 'sunrise'}
                      size={20}
                      style={{ 
                        color: isPrayerCompleted(prayer.id) ? '#27ae60' : '#f39c12' 
                      }}
                    />
                  </span>
                  <div>
                    <span className="prayer-name">{prayer.name}</span>
                    <span className="prayer-time">{prayer.time}</span>
                  </div>
                </div>
                
                <div className="prayer-actions">
                  {isPrayerCompleted(prayer.id) ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrayerIncomplete(prayer.id);
                      }}
                      className="prayer-button completed"
                    >
                      <FiCheck /> Done
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrayerComplete(prayer.id);
                      }}
                      className="prayer-button pending"
                    >
                      <FiClock /> Mark
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PrayerGroup;
