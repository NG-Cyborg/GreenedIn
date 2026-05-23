import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Comment = {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  author: string;
  role: string;
  question: string;
  createdAt: string;
  comments: Comment[];
  upvotes: number;
  downvotes: number;
  bookmarked: boolean;
  userVote: "up" | "down" | null;
};

type CommunityContextType = {
  posts: CommunityPost[];
  addPost: (question: string, author: string, role: string) => Promise<void>;
  addComment: (postId: string, text: string, author: string, role: string) => Promise<void>;
  vote: (postId: string, direction: "up" | "down") => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
};

const CommunityContext = createContext<CommunityContextType | null>(null);
const STORAGE_KEY = "@greenedin_community";

const SEED_POSTS: CommunityPost[] = [
  {
    id: "seed1",
    author: "Adewale F.",
    role: "Farmer · Ogun State",
    question: "What is the best organic fertilizer for maize during the early growth stage?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "seed1c1",
        author: "Prof. Ngozi Eze",
        role: "Agronomist · Enugu",
        text: "Compost from kitchen waste mixed with poultry manure at a 2:1 ratio works excellently during the vegetative stage. Apply 2–3 weeks after germination.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    upvotes: 32,
    downvotes: 2,
    bookmarked: false,
    userVote: null,
  },
  {
    id: "seed2",
    author: "Ngozi E.",
    role: "Agronomist · Enugu",
    question: "Has anyone tried companion planting tomatoes with basil for pest management in the southwest zone?",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    comments: [],
    upvotes: 19,
    downvotes: 1,
    bookmarked: false,
    userVote: null,
  },
  {
    id: "seed3",
    author: "Musa A.",
    role: "Student · Zaria",
    question: "I need advice on managing a Newcastle disease outbreak in my 500-bird layer flock. Mortality is at 8 birds per day.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: "seed3c1",
        author: "Dr. Emmanuel Obi",
        role: "Veterinarian · Kaduna",
        text: "Immediate action required: isolate sick birds, apply LaSota emergency vaccination to remaining healthy flock, and contact your state veterinary officer. Newcastle is notifiable.",
        createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "seed3c2",
        author: "Fatima B.",
        role: "Farmer · Kano",
        text: "We had a similar situation last season. The key is acting within 24 hours. Also check biosecurity — footbath, equipment sharing between houses.",
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ],
    upvotes: 41,
    downvotes: 0,
    bookmarked: false,
    userVote: null,
  },
  {
    id: "seed4",
    author: "Chidinma O.",
    role: "Farmer · Imo State",
    question: "What is the ideal stocking density for broilers in an open-sided shed during rainy season? I have 500 sqm of floor space.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
    upvotes: 15,
    downvotes: 0,
    bookmarked: false,
    userVote: null,
  },
];

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        setPosts(JSON.parse(data));
      } else {
        setPosts(SEED_POSTS);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
      }
    });
  }, []);

  const persist = useCallback(async (list: CommunityPost[]) => {
    setPosts(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addPost = useCallback(
    async (question: string, author: string, role: string) => {
      const newPost: CommunityPost = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        author,
        role,
        question,
        createdAt: new Date().toISOString(),
        comments: [],
        upvotes: 0,
        downvotes: 0,
        bookmarked: false,
        userVote: null,
      };
      await persist([newPost, ...posts]);
    },
    [posts, persist]
  );

  const addComment = useCallback(
    async (postId: string, text: string, author: string, role: string) => {
      const newComment: Comment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        author,
        role,
        text,
        createdAt: new Date().toISOString(),
      };
      const updated = posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      );
      await persist(updated);
    },
    [posts, persist]
  );

  const vote = useCallback(
    async (postId: string, direction: "up" | "down") => {
      const updated = posts.map((p) => {
        if (p.id !== postId) return p;
        if (p.userVote === direction) {
          return {
            ...p,
            upvotes: direction === "up" ? p.upvotes - 1 : p.upvotes,
            downvotes: direction === "down" ? p.downvotes - 1 : p.downvotes,
            userVote: null,
          };
        }
        return {
          ...p,
          upvotes: direction === "up" ? p.upvotes + 1 : p.userVote === "up" ? p.upvotes - 1 : p.upvotes,
          downvotes: direction === "down" ? p.downvotes + 1 : p.userVote === "down" ? p.downvotes - 1 : p.downvotes,
          userVote: direction,
        };
      });
      await persist(updated);
    },
    [posts, persist]
  );

  const toggleBookmark = useCallback(
    async (postId: string) => {
      const updated = posts.map((p) =>
        p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
      );
      await persist(updated);
    },
    [posts, persist]
  );

  return (
    <CommunityContext.Provider value={{ posts, addPost, addComment, vote, toggleBookmark }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
