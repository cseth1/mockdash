import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { useQuery } from '@tanstack/react-query';

interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
}

interface SuggestionCommentsProps {
  suggestionId: number;
}

const mockFetchComments = async (suggestionId: number): Promise<Comment[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const generateComment = (depth = 0): Comment => ({
    id: Math.random(),
    content: 'This is a mock comment that demonstrates how nested comments would look in the thread.',
    author: {
      name: 'Jane Smith',
      avatar: `https://ui-avatars.com/api/?name=Jane+Smith&background=500000&color=fff`,
    },
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    likes: Math.floor(Math.random() * 50),
    dislikes: Math.floor(Math.random() * 10),
    replies: depth < 2 ? Array.from({ length: Math.floor(Math.random() * 3) }, () => generateComment(depth + 1)) : [],
  });

  return Array.from({ length: 5 }, () => generateComment());
};

const CommentComponent: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsReplying(false);
    setReplyContent('');
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 pt-4' : 'pt-6'} ${depth > 0 ? 'border-l-2 pl-4' : ''}`}>
      <div className="flex gap-4">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-gray-600">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-gray-500 hover:text-[#500000]">
              <ThumbsUp size={14} />
              {comment.likes}
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-[#500000]">
              <ThumbsDown size={14} />
              {comment.dislikes}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-gray-500 hover:text-[#500000]"
            >
              <MessageSquare size={14} />
              Reply
            </button>
          </div>

          {isReplying && (
            <form onSubmit={handleReply} className="mt-4">
              <TextareaAutosize
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] resize-none"
                minRows={2}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#500000] text-white rounded-lg hover:bg-[#400000]"
                >
                  Reply
                </button>
              </div>
            </form>
          )}

          {comment.replies.map(reply => (
            <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SuggestionComments: React.FC<SuggestionCommentsProps> = ({ suggestionId }) => {
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', suggestionId],
    queryFn: () => mockFetchComments(suggestionId),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewComment('');
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#500000] border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <TextareaAutosize
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] resize-none"
          minRows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#500000] text-white rounded-lg hover:bg-[#400000]"
          >
            Post Comment
          </button>
        </div>
      </form>

      <div className="divide-y">
        {comments?.map(comment => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default SuggestionComments;