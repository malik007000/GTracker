import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../Auth/AuthContext';
import { religiousGoals, commonGoals } from '../../utils/goalTemplates';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiClock,
  FiUser,
  FiRepeat,
  FiMoon,
  FiHeart,
  FiTarget,
  FiStar
} from 'react-icons/fi';
import Button from '../common/Button';
import toast from 'react-hot-toast';

// Helper component for goal type icons
const GoalIcon = ({ goal }) => {
  switch (goal.type) {
    case 'prayer':
      return <FiHeart style={{ color: '#e74c3c' }} />;
    case 'health':
      return <FiTarget style={{ color: '#27ae60' }} />;
    case 'education':
      return <FiClock style={{ color: '#3498db' }} />;
    case 'discipline':
      return <FiRepeat style={{ color: '#9b59b6' }} />;
    default:
      return <FiStar style={{ color: '#f39c12' }} />;
  }
};

const GoalManager = ({ onClose }) => {
  const { user, userProfile } = useAuth();
  const [goals, setGoals] = useState(userProfile?.goals || []);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateGoalsFromTemplates = () => {
  const religionGoals = religiousGoals[userProfile.religion] || [];
  const filteredCommonGoals = commonGoals.filter(goal => {
    if (goal.genderSpecific === 'Male' && userProfile.gender === 'Female') {
      return false;
    }
    return true;
  });

  return [...religionGoals, ...filteredCommonGoals].map(goal => ({
    id: goal.id,
    name: goal.name,
    type: goal.type,
    category: goal.category || 'general',
    iconType: goal.iconType || 'star', 
    description: goal.description || '',
    required: goal.required || false,
    currentStreak: 0,
    longestStreak: 0,
    completedDates: [],
    isActive: true,
    restDay: goal.restDay || null,
    customHours: goal.id === 'skill_learning' ? userProfile.skillLearningHours || 2 : null,
    genderSpecific: goal.genderSpecific || null,
    prayers: goal.prayers || null, 
    createdAt: new Date().toISOString()
  }));
  };

  const initializeDefaultGoals = async () => {
    setLoading(true);
    try {
      const defaultGoals = generateGoalsFromTemplates();
      await updateDoc(doc(db, 'users', user.uid), {
        goals: defaultGoals
      });

      setGoals(defaultGoals);
      toast.success('Default goals added successfully!');
    } catch (error) {
      console.error('Error adding default goals:', error);
      toast.error('Failed to add default goals');
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalActive = async (goalId) => {
    try {
      const updatedGoals = goals.map(goal =>
        goal.id === goalId ? { ...goal, isActive: !goal.isActive } : goal
      );
      await updateDoc(doc(db, 'users', user.uid), {
        goals: updatedGoals
      });
      setGoals(updatedGoals);
      toast.success('Goal updated successfully!');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const deleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const updatedGoals = goals.filter(goal => goal.id !== goalId);
        await updateDoc(doc(db, 'users', user.uid), {
          goals: updatedGoals
        });
        setGoals(updatedGoals);
        toast.success('Goal deleted successfully!');
      } catch (error) {
        console.error('Error deleting goal:', error);
        toast.error('Failed to delete goal');
      }
    }
  };

  return (
    <div className="goal-manager-overlay">
      <div className="goal-manager">
        <div className="goal-manager-header">
          <h2>Manage Your Goals</h2>
          <button onClick={onClose} className="close-button">
            <FiX />
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="no-goals-setup">
            <h3><FiTarget style={{marginRight: '6px'}} /> No Goals Set Up Yet</h3>
            <p>Let's get you started with some default goals based on your profile!</p>
            <Button 
              onClick={initializeDefaultGoals}
              loading={loading}
              className="setup-goals-button"
            >
              <FiPlus /> Set Up Default Goals
            </Button>
          </div>
        ) : (
          <div className="goals-list">
            <div className="goals-header">
              <h3>Your Goals ({goals.filter(g => g.isActive).length} active)</h3>
              <Button 
                onClick={initializeDefaultGoals}
                size="small"
                variant="secondary"
              >
                <FiPlus /> Reset to Defaults
              </Button>
            </div>
            {goals.map(goal => (
              <div key={goal.id} className={`goal-item ${goal.isActive ? 'active' : 'inactive'}`}>
                <div className="goal-info">
                  <span className="goal-icon"><GoalIcon goal={goal} /></span>
                  <div className="goal-details">
                    <h4>{goal.name}</h4>
                    <p>{goal.type} • {goal.category}</p>
                    {goal.customHours && <p><FiClock style={{marginRight: '4px'}} /> {goal.customHours} hours/day</p>}
                    {goal.restDay && <p><FiMoon style={{marginRight: '4px'}} /> Rest on {goal.restDay}</p>}
                    {goal.genderSpecific && <p><FiUser style={{marginRight: '4px'}} /> {goal.genderSpecific} only</p>}
                  </div>
                </div>
                <div className="goal-stats">
                  <span>Current: {goal.currentStreak || 0}</span>
                  <span>Best: {goal.longestStreak || 0}</span>
                  <span>Total: {goal.completedDates?.length || 0}</span>
                </div>
                <div className="goal-actions">
                  <button
                    onClick={() => toggleGoalActive(goal.id)}
                    className={`toggle-button ${goal.isActive ? 'active' : 'inactive'}`}
                  >
                    {goal.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="delete-button"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="goal-manager-footer">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalManager;
