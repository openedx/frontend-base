// Guards docs/how_tos/add-a-slot-version.md against drifting from the fixtures that howToExamples.test.tsx runs.
// Every ts or tsx block under an example heading in the how-to, and both sides of every diff block, must appear in one of that example's fixtures.
// A block whose fence the guard does not read, such as "typescript" or an indented one, would drop out silently, so every fence opener is checked too.
import fs from 'fs';
import path from 'path';

const HOW_TO = path.resolve(__dirname, '../../docs/how_tos/add-a-slot-version.md');
const FIXTURES = path.resolve(__dirname, 'testMocks');

// Example heading in the how-to, exactly as written after "## Example: ", mapped to its fixture files.
const EXAMPLES: Record<string, string[]> = {
  'renaming a prop': [
    'GreetingSlotV1.tsx',
    'GreetingSlotV1V2.tsx',
    'GreetingSlotV2.tsx',
    'GreetingSlotRenamedInPlace.tsx',
    'GreetingSlotBumpedInPlace.tsx',
    'greetingWidgets.tsx',
  ],
  "changing a prop's type": ['BannerSlotV1.tsx', 'BannerSlotV1V2.tsx', 'BannerSlotV2.tsx'],
  'a slot whose default widget takes options': [
    'TreeListSlotV1.tsx',
    'TreeListSlotV1V2.tsx',
    'TreeListSlotV2.tsx',
    'treeListOptions.ts',
    'TreeListPageV1.tsx',
    'TreeListPageV2.tsx',
  ],
  'a prop that becomes a list': [
    'TaggableItemSlotV1.tsx',
    'TaggableItemSlotV1V2FirstTagOnly.tsx',
    'TaggableItemSlotV1V2.tsx',
    'TaggableItemSlotV2.tsx',
  ],
};

// Import lines differ by necessity: the how-to imports from the package, the fixtures from the repo.
// Comments are checked separately, line by line, because the how-to shows the interfaces both with and without their doc comments.
function normalize(code: string) {
  return code
    .split('\n')
    .filter(line => !line.startsWith('import ') && !line.trim().startsWith('/**') && !line.trim().startsWith('//'))
    .join('\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function commentLines(code: string) {
  return code.split('\n').map(line => line.trim()).filter(line => line.startsWith('/**') || line.startsWith('//'));
}

interface Section {
  text: string;
  // The 1-based line of the heading in the how-to, so a block's label can say where it is.
  startLine: number;
}

function sectionsByExample(markdown: string) {
  const sections: Record<string, Section> = {};
  let startLine = 1;
  for (const text of markdown.split(/^(?=## )/m)) {
    const match = /^## Example: (.+)\n/.exec(text);
    if (match) {
      sections[match[1].trim()] = { text, startLine };
    }
    startLine += text.split('\n').length - 1;
  }
  return sections;
}

const EMPTY_SECTION: Section = { text: '', startLine: 0 };

function lineOf(section: Section, index: number) {
  return section.startLine + section.text.slice(0, index).split('\n').length - 1;
}

// The fences the guard reads, plus "markdown" for the README excerpt and "text" for commit messages, which are prose.
const KNOWN_FENCES = ['ts', 'tsx', 'diff', 'markdown', 'text'];

function fenceOpeners(section: Section) {
  const openers: string[] = [];
  let open = false;
  for (const line of section.text.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      if (!open) {
        openers.push(line);
      }
      open = !open;
    }
  }
  return openers;
}

interface CodeBlock {
  label: string;
  code: string;
}

function tsBlocks(section: Section): CodeBlock[] {
  return [...section.text.matchAll(/^```(tsx?)\n([\s\S]*?)^```/gm)].map(m => ({
    label: `line ${lineOf(section, m.index)} ${m[1]} "${m[2].split('\n')[0]}"`,
    code: m[2],
  }));
}

// A diff block's before state is its context and "-" lines; its after state is its context and "+" lines.
function diffBlocks(section: Section): CodeBlock[] {
  return [...section.text.matchAll(/^```diff\n([\s\S]*?)^```/gm)].flatMap((m) => {
    const lines = m[1].split('\n');
    const side = (dropped: string) => lines.filter(line => !line.startsWith(dropped)).map(line => line.slice(1)).join('\n');
    const first = lines.find(line => line.trim() !== '')?.slice(1) ?? '';
    const label = `line ${lineOf(section, m.index)} diff "${first}"`;
    return [
      { label: `${label} before`, code: side('+') },
      { label: `${label} after`, code: side('-') },
    ];
  });
}

function codeBlocks(section: Section) {
  return [...tsBlocks(section), ...diffBlocks(section)];
}

describe('the slot version how-to', () => {
  const markdown = fs.readFileSync(HOW_TO, 'utf8');
  const sections = sectionsByExample(markdown);

  it('has a fixture mapping for every example, and an example for every mapping', () => {
    const headings = Object.keys(sections).filter(name => codeBlocks(sections[name]).length > 0);
    expect(headings.sort()).toEqual(Object.keys(EXAMPLES).sort());
  });

  describe.each(Object.entries(EXAMPLES))('example "%s"', (name, fixtureFiles) => {
    const fixtures = fixtureFiles.map(file => fs.readFileSync(path.join(FIXTURES, file), 'utf8'));
    const normalizedFixtures = fixtures.map(normalize);
    const section = sections[name] ?? EMPTY_SECTION;
    const blocks = codeBlocks(section);
    // One comment can appear in several blocks; it is checked once.
    const comments = [...new Set(blocks.flatMap(block => commentLines(block.code)))];

    it('has at least one code block', () => {
      expect(blocks.length).toBeGreaterThan(0);
    });

    it('opens every code block with a fence the guard reads', () => {
      expect(fenceOpeners(section).filter(line => !KNOWN_FENCES.includes(line.slice(3)))).toEqual([]);
    });

    it('writes every doc comment on one line', () => {
      expect(comments.filter(line => line.startsWith('/**') && !line.endsWith('*/'))).toEqual([]);
    });

    // it.each throws on an empty table; the two tests above report those cases.
    if (blocks.length > 0) {
      it.each(blocks.map(block => [block.label, block.code]))('%s appears in a fixture', (_label, code) => {
        expect(normalizedFixtures).toContainEqual(expect.stringContaining(normalize(code)));
      });
    }

    if (comments.length > 0) {
      it.each(comments.map(line => [line]))('comment %s appears in a fixture', (line) => {
        expect(fixtures).toContainEqual(expect.stringContaining(line));
      });
    }
  });
});
