export interface Diagnostic {
  level: 'error' | 'warning';
  message: string;
}

export type PageRule = (document: Document) => Diagnostic | undefined;
