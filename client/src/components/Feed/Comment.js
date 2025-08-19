import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiUser } from 'react-icons/fi';

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-author">
        <FiUser className="comment-avatar" />
        <span className="comment-author-name">{comment.authorName}</span>
        <span className="comment-time">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </span>
      </div>
      <p className="comment-content">{comment.content}</p>
    </div>
  );
};

export default Comment;
