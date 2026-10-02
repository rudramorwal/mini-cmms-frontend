import React, { useState, useEffect } from 'react';
import { getComments, createComment } from '../api/client';
import toast from 'react-hot-toast';

function CommentThread({ workOrderId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await getComments(workOrderId);
      setComments(data);
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [workOrderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.author || !newComment.body) return;

    setSubmitting(true);
    try {
      await createComment(workOrderId, newComment);
      setNewComment({ author: '', body: '' });
      fetchComments();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-thread">
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <strong>{c.author}</strong>
                <span className="comment-time">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <div className="comment-body">{c.body}</div>
            </div>
          ))
        )}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Your Name"
          value={newComment.author}
          onChange={e => setNewComment({...newComment, author: e.target.value})}
          required
        />
        <textarea 
          placeholder="Add a comment..."
          value={newComment.body}
          onChange={e => setNewComment({...newComment, body: e.target.value})}
          required
          rows="2"
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default CommentThread;
