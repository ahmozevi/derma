export enum Sender {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isTyping?: boolean;
  groundingUrls?: { uri: string; title: string }[];
}

export interface CaseRecord {
  id: string;
  imageUrl: string; // Base64 or Blob URL
  summary: string;
  date: number;
  messages: Message[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
