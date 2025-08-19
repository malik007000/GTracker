import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../Auth/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi';
import Comment from './Comment';
import toast from 'react-hot-toast';

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();

  const isLiked = post.likes?.includes(user?.uid);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const handleLike = async () => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', post.id);
      
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        authorId: user.uid,
        authorName: userProfile.displayName,
        createdAt: new Date().toISOString()
      };

      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const getReligionEmoji = (religion) => {
    switch (religion) {
      case 'Muslim': return '☪️';
      case 'Christian': return '✝️';
      case 'Hindu': return '🕉️';
      default: return '🙏';
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            <FiUser />
          </div>
          <div className="author-info">
            <h4>{post.authorName}</h4>
            <span className="author-religion">
              {getReligionEmoji(post.authorReligion)} {post.authorReligion}
            </span>
          </div>
        </div>
        <span className="post-time">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="post-content">
        {post.content && <p>{post.content}</p>}
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="post-image"
          />
        )}
      </div>

      <div className="post-actions">
        <button 
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <FiHeart fill={isLiked ? '#ff4757' : 'none'} />
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </button>
        
        <button 
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageCircle />
          {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments?.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
          
          {user && (
            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button 
                type="submit" 
                disabled={!newComment.trim() || loading}
                className="comment-submit"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
