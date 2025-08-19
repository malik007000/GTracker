import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { religiousGoals, commonGoals } from '../../utils/goalTemplates';
import Button from '../common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    religion: 'Muslim',
    gender: 'Male',
    challengePeriod: 30,
    skillLearningHours: 2
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create user goals based on religion and gender
      const religionGoals = religiousGoals[formData.religion] || [];
      
      // Filter common goals based on gender
      const filteredCommonGoals = commonGoals.filter(goal => {
        // Only include lust control for male users
        if (goal.genderSpecific === 'Male' && formData.gender === 'Female') {
          return false;
        }
        return true;
      });
      
      // Combine and initialize all goals
      const allGoals = [...religionGoals, ...filteredCommonGoals].map(goal => ({
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
  customHours: goal.id === 'skill_learning' ? parseInt(formData.skillLearningHours) : null,
  genderSpecific: goal.genderSpecific || null,
  prayers: goal.prayers || null, 
  createdAt: new Date().toISOString()
}));

      console.log('Creating user with goals:', allGoals); // Debug log
      
      const userDetails = {
        displayName: formData.displayName,
        religion: formData.religion,
        gender: formData.gender,
        challengePeriod: parseInt(formData.challengePeriod),
        skillLearningHours: parseInt(formData.skillLearningHours),
        goals: allGoals,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      await signup(formData.email, formData.password, userDetails);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component remains the same...
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Join Our Community</h1>
        <p>Start your goal-tracking journey today</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Form fields remain the same */}
          <div className="form-group">
            <input
              type="text"
              name="displayName"
              placeholder="Full Name"
              value={formData.displayName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Hindu">Hindu</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <select
                name="challengePeriod"
                value={formData.challengePeriod}
                onChange={handleChange}
                className="form-select"
              >
                <option value={7}>7 Days Challenge</option>
                <option value={30}>30 Days Challenge</option>
                <option value={60}>60 Days Challenge</option>
                <option value={90}>90 Days Challenge</option>
              </select>
            </div>
            
            <div className="form-group">
              <select
                name="skillLearningHours"
                value={formData.skillLearningHours}
                onChange={handleChange}
                className="form-select"
              >
                <option value={1}>1 Hour/Day Learning</option>
                <option value={2}>2 Hours/Day Learning</option>
                <option value={3}>3 Hours/Day Learning</option>
                <option value={4}>4 Hours/Day Learning</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          
          <Button 
            type="submit" 
            loading={loading}
            className="auth-button"
          >
            Create Account
          </Button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
