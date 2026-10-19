export type CategoryType = 'school' | 'family' | 'social';

export interface AdviceResult {
  empathy: string;
  psychologicalInsight: string;
  actionSteps: string[];
  soothingQuote: string;
  breathingReminder?: string;
}

export interface CounselorReply {
  content: string;
  repliedAt: string;
  counselorName: string;
  counselorTitle: string;
}

export interface AnonymousLetter {
  id: string;
  code: string;
  penName: string;
  category: CategoryType;
  urgency: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  createdAt: string;
  isPublic: boolean;
  reply?: CounselorReply;
  hearts: number;
  hugs: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface SavedAdviceItem {
  id: string;
  date: string;
  category: CategoryType;
  title: string;
  advice: AdviceResult;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    points: number;
  }[];
}
