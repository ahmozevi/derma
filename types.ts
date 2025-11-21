export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface Doctor {
  title: string;
  address: string;
  uri?: string;
  rating?: number;
  snippet?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface AppState {
  view: 'home' | 'analysis' | 'profile';
  image: string | null; // Base64
  messages: Message[];
  isLoading: boolean;
  disclaimerAccepted: boolean;
}

export enum AnalysisStage {
  IDLE,
  ANALYZING,
  COMPLETE,
}
