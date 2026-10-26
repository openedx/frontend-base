import { runPageRules } from './index';
import type { Diagnostic, PageRule } from './types';

const diagnostic: Diagnostic = { level: 'error', message: 'the rule failed' };
const passing: PageRule = () => undefined;
const failing: PageRule = () => diagnostic;

describe('runPageRules', () => {
  it('runs each rule against the document', () => {
    const rule = jest.fn<Diagnostic | undefined, [Document]>(() => undefined);
    runPageRules(document, [rule]);
    expect(rule).toHaveBeenCalledWith(document);
  });

  it('returns nothing when every rule passes', () => {
    expect(runPageRules(document, [passing, passing])).toEqual([]);
  });

  it('returns the diagnostics of the rules that fail', () => {
    expect(runPageRules(document, [passing, failing])).toEqual([diagnostic]);
  });
});
