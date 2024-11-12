import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { cn } from '../../utils/cn';
import NewSuggestionModal from './NewSuggestionModal';
import SuggestionComments from './SuggestionComments';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  department: string;
  status: 'new' | 'under-review' | 'planned' | 'in-progress' | 'completed' | 'declined';
  tags: string[];
}

const ITEMS_PER_PAGE = 10;

const mockFetchSuggestions = async (page: number, sortBy: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const suggestions: Suggestion[] = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
    id: page * ITEMS_PER_PAGE + i,
    title: `Suggestion ${page * ITEMS_PER_PAGE + i + 1}`,
    description: 'This is a mock suggestion description that demonstrates how the content would look in the card.',
    author: {
      name: 'John Doe',
      avatar: `https://ui-avatars.com/api/?name=John+Doe&background=500000&color=fff`,
    },
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    upvotes: Math.floor(Math.random() * 100),
    downvotes: Math.floor(Math.random() * 20),
    commentCount: Math.floor(Math.random() * 50),
    department: 'HR Operations',
    status: ['new', 'under-review', 'planned', 'in-progress', 'completed', 'declined'][
      Math.floor(Math.random() * 6)
    ] as Suggestion['status'],
    tags: ['Policy', 'Benefits', 'Training'].sort(() => Math.random() - 0.5).slice(0, 2),
  }));

  return {
    suggestions,
    nextPage: page < 5 ? page + 1 : null,
  };
};

const SuggestionsPage: React.FC = () => {
  const [showNewSuggestion, setShowNewSuggestion] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent');
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['suggestions', sortBy],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => mockFetchSuggestions(pageParam, sortBy),
    getNextPageParam: (lastPage: { nextPage: number | null }, pages: Array<any>) => lastPage.nextPage,
    initialPageParam: 0,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleVote = async (id: number, type: 'up' | 'down') => {
    // Optimistic update
    queryClient.setQueryData(['suggestions', sortBy], (oldData: any) => ({
      pages: oldData.pages.map((page: any) => ({
        ...page,
        suggestions: page.suggestions.map((suggestion: Suggestion) =>
          suggestion.id === id
            ? {
                ...suggestion,
                upvotes: type === 'up' ? suggestion.upvotes + 1 : suggestion.upvotes,
                downvotes: type === 'down' ? suggestion.downvotes + 1 : suggestion.downvotes,
              }
            : suggestion
        ),
      })),
      pageParams: oldData.pageParams,
    }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const statusColors = {
    'new': 'bg-blue-100 text-blue-700',
    'under-review': 'bg-yellow-100 text-yellow-700',
    'planned': 'bg-purple-100 text-purple-700',
    'in-progress': 'bg-green-100 text-green-700',
    'completed': 'bg-gray-100 text-gray-700',
    'declined': 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Suggestions</h1>
          <div className="flex gap-4">
            <div className="flex rounded-lg border bg-white">
              <button
                onClick={() => setSortBy('recent')}
                className={cn(
                  'px-4 py-2 flex items-center gap-2',
                  sortBy === 'recent' ? 'bg-[#500000] text-white' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Clock size={16} />
                Recent
              </button>
              <button
                onClick={() => setSortBy('top')}
                className={cn(
                  'px-4 py-2 flex items-center gap-2',
                  sortBy === 'top' ? 'bg-[#500000] text-white' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <TrendingUp size={16} />
                Top
              </button>
            </div>
            <button
              onClick={() => setShowNewSuggestion(true)}
              className="px-4 py-2 bg-[#500000] text-white rounded-lg hover:bg-[#400000] transition"
            >
              New Suggestion
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.suggestions.map((suggestion: Suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => handleVote(suggestion.id, 'up')}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#500000] transition"
                          >
                            <ArrowUp size={20} />
                          </button>
                          <span className="font-medium">
                            {suggestion.upvotes - suggestion.downvotes}
                          </span>
                          <button
                            onClick={() => handleVote(suggestion.id, 'down')}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#500000] transition"
                          >
                            <ArrowDown size={20} />
                          </button>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900">
                                {suggestion.title}
                              </h2>
                              <div className="flex items-center gap-2 mt-1">
                                <img
                                  src={suggestion.author.avatar}
                                  alt={suggestion.author.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm text-gray-600">
                                  {suggestion.author.name}
                                </span>
                                <span className="text-sm text-gray-400">
                                  {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            <div className={cn(
                              'px-3 py-1 rounded-full text-sm',
                              statusColors[suggestion.status]
                            )}>
                              {suggestion.status.replace('-', ' ')}
                            </div>
                          </div>
                          <p className="mt-4 text-gray-600">{suggestion.description}</p>
                          <div className="mt-4 flex items-center gap-4">
                            <div className="flex gap-2">
                              {suggestion.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => setSelectedSuggestion(
                                selectedSuggestion === suggestion.id ? null : suggestion.id
                              )}
                              className="flex items-center gap-2 text-gray-600 hover:text-[#500000]"
                            >
                              <MessageSquare size={16} />
                              {suggestion.commentCount} Comments
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedSuggestion === suggestion.id && (
                      <div className="border-t">
                        <SuggestionComments suggestionId={suggestion.id} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>

        {isFetchingNextPage && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#500000] border-r-transparent"></div>
          </div>
        )}

        <div ref={ref} className="h-10" />
      </div>

      {showNewSuggestion && (
        <NewSuggestionModal onClose={() => setShowNewSuggestion(false)} />
      )}
    </div>
  );
};

export default SuggestionsPage;