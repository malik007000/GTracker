import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../utils/firebase';
import { useAuth } from '../Auth/AuthContext';
import { FiImage, FiSend } from 'react-icons/fi';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      toast.error('Please add some content or an image');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      
      if (image) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const postData = {
        content: content.trim(),
        imageUrl,
        authorId: user.uid,
        authorName: userProfile.displayName,
        authorReligion: userProfile.religion,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };

      await addDoc(collection(db, 'posts'), postData);
      
      setContent('');
      setImage(null);
      toast.success('Post shared successfully! 🎉');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to share post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="post-input-container">
          <textarea
            placeholder="Share your progress, motivation, or achievements..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="post-textarea"
            rows={3}
          />
          
          {image && (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(image)} 
                alt="Preview" 
                className="preview-image"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="remove-image"
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="post-actions">
          <label className="image-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="image-upload-input"
            />
            <FiImage /> Add Image
          </label>
          
          <Button 
            type="submit" 
            loading={loading}
            disabled={!content.trim() && !image}
            className="post-button"
          >
            <FiSend /> Share Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
