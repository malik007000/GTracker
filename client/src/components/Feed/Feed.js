import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../Auth/AuthContext';
import CreatePost from './CreatePost';
import Post from './Post';
import Loading from '../common/Loading';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const canPost = () => {
    if (!userProfile?.goals) return false;
    
    // Check if user has active streaks or completed challenges
    const hasActiveStreaks = userProfile.goals.some(goal => 
      (goal.currentStreak || 0) >= 7
    );
    
    return hasActiveStreaks;
  };

  if (loading) return <Loading />;

  return (
    <div className="feed">
      <div className="feed-header">
        <h1>Community Feed</h1>
        <p>Share your progress and inspire others</p>
      </div>

      {canPost() && <CreatePost />}
      
      {!canPost() && (
        <div className="posting-requirement">
          <p>🔥 Achieve a 7-day streak on any goal to start posting!</p>
        </div>
      )}

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to share your progress!</p>
          </div>
        ) : (
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
