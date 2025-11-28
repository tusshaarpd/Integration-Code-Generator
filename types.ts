export interface GeneratorState {
  apiDoc: string;
  language: string;
  generatedCode: string;
  isGenerating: boolean;
}

export interface GenerationRequest {
  apiDoc: string;
  language: string;
}

export interface Attachment {
  mimeType: string;
  data: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  attachments?: Attachment[];
}

export enum AppMode {
  STANDARD = 'STANDARD',
  REASONING = 'REASONING',
}