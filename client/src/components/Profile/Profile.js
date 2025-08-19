import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../Auth/AuthContext';
import Achievements from './Achievements';
import { 
  FiSettings, 
  FiTrendingUp, 
  FiClipboard, 
  FiUser, 
  FiCalendar, 
  FiHeart 
} from 'react-icons/fi';

const Profile = () => {
  const { userProfile } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!userProfile?.uid) return;
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', userProfile.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserPosts(posts);
    });
    return unsubscribe;
  }, [userProfile]);

  const getProfileStats = () => {
    if (!userProfile?.goals) return { 
      activeGoals: 0, 
      completedToday: 0, 
      totalCompleted: 0 
    };

    // Count active goals
    const activeGoals = userProfile.goals.filter(goal => goal.isActive).length;
    
    // Count completed today (excluding rest days)
    const today = new Date().toDateString();
    const todayIsRestDay = (goal) => {
      if (goal.id === 'gym' && goal.restDay) {
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        return goal.restDay === todayName;
      }
      return false;
    };
    
    const completedToday = userProfile.goals.filter(goal => 
      goal.completedDates?.includes(today) && !todayIsRestDay(goal)
    ).length;
    
    // Count total completed across all goals
    const totalCompleted = userProfile.goals.reduce((sum, goal) => 
      sum + (goal.completedDates?.length || 0), 0
    );

    return { activeGoals, completedToday, totalCompleted };
  };

  const stats = getProfileStats();

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {userProfile.displayName?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h1>{userProfile.displayName}</h1>
            <p className="profile-religion">
              <FiCalendar style={{marginRight: '5px'}} /> {userProfile.religion}
            </p>
            <p className="profile-gender">
              <FiUser style={{marginRight: '5px'}} /> {userProfile.gender}
            </p>
            <p className="profile-member-since">
              <FiHeart style={{marginRight: '5px'}} /> Member since {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <button className="profile-settings">
          <FiSettings />
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.activeGoals}</div>
          <div className="stat-label">Active Goals</div>
          <div className="stat-description"><FiClipboard style={{verticalAlign: 'middle', marginRight: '4px'}} /> Daily objectives</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completedToday}</div>
          <div className="stat-label">Completed Today</div>
          <div className="stat-description">Today's progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCompleted}</div>
          <div className="stat-label">Total Completed</div>
          <div className="stat-description">All time achievements</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{userPosts.length}</div>
          <div className="stat-label">Posts Shared</div>
          <div className="stat-description">Community contributions</div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({userPosts.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="goals-progress">
              <h3><FiClipboard style={{marginRight: '6px'}} /> Active Goals Progress</h3>
              <div className="goals-list">
                {userProfile.goals?.filter(goal => goal.isActive).map(goal => (
                  <div key={goal.id} className="goal-progress-item">
                    <div className="goal-info">
                      <span className="goal-emoji">{goal.emoji || '⭐'}</span>
                      <div>
                        <span className="goal-name">{goal.name}</span>
                        <span className="goal-type">{goal.type}</span>
                      </div>
                    </div>
                    <div className="goal-streaks">
                      <div className="streak-info">
                        <FiTrendingUp style={{marginRight: '4px'}} />
                        <span>{goal.currentStreak || 0} current</span>
                        <span>{goal.longestStreak || 0} best</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'achievements' && (
          <Achievements userProfile={userProfile} />
        )}
        {activeTab === 'posts' && (
          <div className="posts-tab">
            {userPosts.length === 0 ? (
              <p>No posts yet. Share your first achievement!</p>
            ) : (
              <div className="user-posts">
                {userPosts.map(post => (
                  <div key={post.id} className="user-post">
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="Post" className="post-thumbnail" />
                    )}
                    <div className="post-info">
                      <p className="post-content">{post.content}</p>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
