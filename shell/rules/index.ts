import mainLandmark from './mainLandmark';
import type { Diagnostic, PageRule } from './types';

export type { Diagnostic, PageRule } from './types';

const pageRules: PageRule[] = [
  mainLandmark,
];

export function runPageRules(document: Document, rules: PageRule[] = pageRules): Diagnostic[] {
  return rules.map((rule) => rule(document)).filter((diagnostic) => diagnostic !== undefined);
}

export default pageRules;
