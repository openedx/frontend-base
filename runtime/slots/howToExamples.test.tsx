// Exercises the example slots from docs/how_tos/add-a-slot-version.md the ways an operator can use them.
// howToExamples.drift.test.ts checks that the fixtures still match the markdown.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ComponentType, ReactElement } from 'react';
import { getSiteConfig, setSiteConfig } from '../config';
import { LayoutOperationTypes, SlotOperation, useSlotContext, useWidgets, WidgetOperationTypes } from '.';
import { useWidgetOptions, useWidgetOptionsForId } from './widget/hooks';
import GreetingSlotV1 from './testMocks/GreetingSlotV1';
import GreetingSlotV1V2, { GreetingSlotProps, GreetingSlotV2Props } from './testMocks/GreetingSlotV1V2';
import GreetingSlotV2 from './testMocks/GreetingSlotV2';
import GreetingSlotRenamedInPlace, { GreetingSlotProps as RenamedInPlaceProps } from './testMocks/GreetingSlotRenamedInPlace';
import GreetingSlotBumpedInPlace from './testMocks/GreetingSlotBumpedInPlace';
import { customGreetingV1, customGreetingV2 } from './testMocks/greetingWidgets';
import BannerSlotV1 from './testMocks/BannerSlotV1';
import BannerSlotV1V2, { BannerSlotProps, BannerSlotV2Props, Notice } from './testMocks/BannerSlotV1V2';
import BannerSlotV2 from './testMocks/BannerSlotV2';
import TaggableItemSlotV1 from './testMocks/TaggableItemSlotV1';
import TaggableItemSlotV1V2, { TaggableItemSlotProps, TaggableItemSlotV2Props } from './testMocks/TaggableItemSlotV1V2';
import TaggableItemSlotV2 from './testMocks/TaggableItemSlotV2';
import TaggableItemSlotV1V2FirstTagOnly, { TaggableItemSlotProps as FirstTagOnlyProps } from './testMocks/TaggableItemSlotV1V2FirstTagOnly';
import TreeListSlotV1 from './testMocks/TreeListSlotV1';
import TreeListSlotV1V2, { Foliage, TreeListSlotProps, TreeListSlotV2Props, TreeV1, TreeV2 } from './testMocks/TreeListSlotV1V2';
import TreeListSlotV2 from './testMocks/TreeListSlotV2';
import { addQuinceV1 } from './testMocks/treeListOptions';
import TreeListPageV1 from './testMocks/TreeListPageV1';
import TreeListPageV2 from './testMocks/TreeListPageV2';
import SongControlsSlot, { SongControlsSlotProps } from './testMocks/SongControlsSlot';
import TrackControlsSlotNoAlias from './testMocks/TrackControlsSlotNoAlias';
import TrackControlsSlotAliased, { TrackControlsSlotProps } from './testMocks/TrackControlsSlotAliased';
import TrackControlsSlot from './testMocks/TrackControlsSlot';
import SongListSlot from './testMocks/SongListSlot';
import TrackListSlotWrappingSongList, { SongListSlotProps, Track, TrackListSlotProps } from './testMocks/TrackListSlotWrappingSongList';
import TrackListSlot from './testMocks/TrackListSlot';

interface ExampleSpec {
  v1Id: string;
  v2Id: string;
  // What the test names call the two slots. A new version is "v1" and "v2"; a renamed slot is its old and new identifier.
  names?: [string, string];
  // The slot rendered in each state the how-to shows.
  v1Only: ReactElement;
  both: ReactElement;
  v2Only: ReactElement;
  // What the default content prints for the value under test.
  defaultContentText: string | RegExp;
  // A component widget written against each version's props, and what it prints.
  v1Widget: ComponentType;
  v1WidgetText: string;
  v2Widget: ComponentType;
  v2WidgetText: string;
  // A replacement layout for each version that reads the slot's props through useSlotContext(), and what it prints.
  v1Layout: ComponentType;
  v1LayoutText: string;
  v2Layout: ComponentType;
  v2LayoutText: string;
}

function configureSlots(slots: SlotOperation[]) {
  setSiteConfig({ ...getSiteConfig(), apps: [{ appId: 'example-app', slots }] });
}

function renderSlot(element: ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

const replaceDefaultContent = (slotId: string, element: ReactElement): SlotOperation => ({
  slotId, id: 'replacement', op: WidgetOperationTypes.REPLACE, relatedId: 'defaultContent', element,
});

const appendWidget = (slotId: string, id: string, component: ComponentType): SlotOperation => ({
  slotId, id, op: WidgetOperationTypes.APPEND, component,
});

const replaceLayout = (slotId: string, component: ComponentType): SlotOperation => ({
  slotId, op: LayoutOperationTypes.REPLACE, component,
});

const setOptions = (slotId: string, options: Record<string, unknown>, widgetId = 'defaultContent'): SlotOperation => ({
  slotId, op: WidgetOperationTypes.OPTIONS, relatedId: widgetId, options,
});

function describeExample(name: string, spec: ExampleSpec) {
  const [v1, v2] = spec.names ?? ['v1', 'v2'];
  describe(name, () => {
    afterEach(() => {
      setSiteConfig({ ...getSiteConfig(), apps: [] });
    });

    describe.each([
      [`${v1} only`, spec.v1Only],
      [`${v2} wrapping ${v1}`, spec.both],
      [`${v2} only`, spec.v2Only],
    ])('%s', (_state, element) => {
      it('renders the default content with no operations', () => {
        renderSlot(element);
        expect(screen.getByText(spec.defaultContentText)).toBeInTheDocument();
      });
    });

    describe.each([
      [`${v1} only`, spec.v1Only],
      [`${v2} wrapping ${v1}`, spec.both],
    ])('%s', (_state, element) => {
      it(`passes the ${v1} props to a ${v1} component widget`, () => {
        configureSlots([appendWidget(spec.v1Id, 'v1Widget', spec.v1Widget)]);
        renderSlot(element);
        expect(screen.getByText(spec.v1WidgetText)).toBeInTheDocument();
      });

      it(`lets a ${v1} operation replace the default content`, () => {
        configureSlots([replaceDefaultContent(spec.v1Id, <p>{`${v1} replacement`}</p>)]);
        renderSlot(element);
        expect(screen.getByText(`${v1} replacement`)).toBeInTheDocument();
        expect(screen.queryByText(spec.defaultContentText)).not.toBeInTheDocument();
      });

      it(`gives a ${v1} layout the ${v1} props through useSlotContext()`, () => {
        configureSlots([replaceLayout(spec.v1Id, spec.v1Layout)]);
        renderSlot(element);
        expect(screen.getByText(spec.v1LayoutText)).toBeInTheDocument();
        expect(screen.getByText(spec.defaultContentText)).toBeInTheDocument();
      });
    });

    describe.each([
      [`${v2} wrapping ${v1}`, spec.both],
      [`${v2} only`, spec.v2Only],
    ])('%s', (_state, element) => {
      it(`passes the ${v2} props to a ${v2} component widget`, () => {
        configureSlots([appendWidget(spec.v2Id, 'v2Widget', spec.v2Widget)]);
        renderSlot(element);
        expect(screen.getByText(spec.v2WidgetText)).toBeInTheDocument();
      });

      it(`lets a ${v2} operation replace the default content`, () => {
        configureSlots([replaceDefaultContent(spec.v2Id, <p>{`${v2} replacement`}</p>)]);
        renderSlot(element);
        expect(screen.getByText(`${v2} replacement`)).toBeInTheDocument();
        expect(screen.queryByText(spec.defaultContentText)).not.toBeInTheDocument();
      });

      it(`gives a ${v2} layout the ${v2} props through useSlotContext()`, () => {
        configureSlots([replaceLayout(spec.v2Id, spec.v2Layout)]);
        renderSlot(element);
        expect(screen.getByText(spec.v2LayoutText)).toBeInTheDocument();
        expect(screen.getByText(spec.defaultContentText)).toBeInTheDocument();
      });
    });

    describe(`${v2} wrapping ${v1}`, () => {
      it(`renders widgets appended to ${v1} and to ${v2} together`, () => {
        configureSlots([
          appendWidget(spec.v1Id, 'v1Widget', spec.v1Widget),
          appendWidget(spec.v2Id, 'v2Widget', spec.v2Widget),
        ]);
        renderSlot(spec.both);
        expect(screen.getByText(spec.defaultContentText)).toBeInTheDocument();
        expect(screen.getByText(spec.v1WidgetText)).toBeInTheDocument();
        expect(screen.getByText(spec.v2WidgetText)).toBeInTheDocument();
      });

      it(`takes ${v1} and its widgets away when a ${v2} operation replaces the default content`, () => {
        configureSlots([
          appendWidget(spec.v1Id, 'v1Widget', spec.v1Widget),
          replaceDefaultContent(spec.v2Id, <p>{`${v2} replacement`}</p>),
        ]);
        renderSlot(spec.both);
        expect(screen.getByText(`${v2} replacement`)).toBeInTheDocument();
        expect(screen.queryByText(spec.defaultContentText)).not.toBeInTheDocument();
        expect(screen.queryByText(spec.v1WidgetText)).not.toBeInTheDocument();
      });

      it(`keeps ${v1} and its widgets inside a replaced ${v2} layout`, () => {
        configureSlots([
          appendWidget(spec.v1Id, 'v1Widget', spec.v1Widget),
          replaceLayout(spec.v2Id, spec.v2Layout),
        ]);
        renderSlot(spec.both);
        expect(screen.getByText(spec.v2LayoutText)).toBeInTheDocument();
        expect(screen.getByText(spec.defaultContentText)).toBeInTheDocument();
        expect(screen.getByText(spec.v1WidgetText)).toBeInTheDocument();
      });
    });

    describe(`${v2} only`, () => {
      it(`ignores a ${v1} operation`, () => {
        configureSlots([appendWidget(spec.v1Id, 'v1Widget', spec.v1Widget)]);
        renderSlot(spec.v2Only);
        expect(screen.getByText(spec.defaultContentText)).toBeInTheDocument();
        expect(screen.queryByText(spec.v1WidgetText)).not.toBeInTheDocument();
      });
    });
  });
}

// A layout reads the slot's props through SlotContext, whose type is its fixed members plus an index signature.
function useSlotProps<Props>() {
  return useSlotContext() as unknown as Props;
}

function LayoutPrinting({ text }: { text: string }) {
  const widgets = useWidgets();
  return (
    <div>
      <p>{text}</p>
      {widgets}
    </div>
  );
}

// Renaming a prop: userName becomes displayName.
const GreetingV1Widget = ({ userName }: GreetingSlotProps) => <p>v1 widget: {userName}</p>;
const GreetingV2Widget = ({ displayName }: GreetingSlotV2Props) => <p>v2 widget: {displayName}</p>;
const GreetingV1Layout = () => {
  const { userName } = useSlotProps<GreetingSlotProps>();
  return <LayoutPrinting text={`v1 layout: ${userName}`} />;
};
const GreetingV2Layout = () => {
  const { displayName } = useSlotProps<GreetingSlotV2Props>();
  return <LayoutPrinting text={`v2 layout: ${displayName}`} />;
};

const greetingV1Only = <GreetingSlotV1 userName="Ada" />;
const greetingBoth = <GreetingSlotV1V2 displayName="Ada" />;
const greetingV2Only = <GreetingSlotV2 displayName="Ada" />;

describeExample('renaming a prop', {
  v1Id: 'org.openedx.frontend.slot.example.greeting.v1',
  v2Id: 'org.openedx.frontend.slot.example.greeting.v2',
  v1Only: greetingV1Only,
  both: greetingBoth,
  v2Only: greetingV2Only,
  defaultContentText: 'Hello, Ada',
  v1Widget: GreetingV1Widget,
  v1WidgetText: 'v1 widget: Ada',
  v2Widget: GreetingV2Widget,
  v2WidgetText: 'v2 widget: Ada',
  v1Layout: GreetingV1Layout,
  v1LayoutText: 'v1 layout: Ada',
  v2Layout: GreetingV2Layout,
  v2LayoutText: 'v2 layout: Ada',
});

describe('renaming a prop', () => {
  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  describe("the operator's widget from the how-to", () => {
    it.each([
      ['v1 only', greetingV1Only],
      ['v2 wrapping v1', greetingBoth],
    ])('replaces the default content of %s before the move', (_state, element) => {
      configureSlots([customGreetingV1]);
      renderSlot(element);
      expect(screen.getByText('Welcome back, Ada')).toBeInTheDocument();
      expect(screen.queryByText('Hello, Ada')).not.toBeInTheDocument();
    });

    it.each([
      ['v2 wrapping v1', greetingBoth],
      ['v2 only', greetingV2Only],
    ])('replaces the default content of %s after the move', (_state, element) => {
      configureSlots([customGreetingV2]);
      renderSlot(element);
      expect(screen.getByText('Welcome back, Ada')).toBeInTheDocument();
      expect(screen.queryByText('Hello, Ada')).not.toBeInTheDocument();
    });

    it('does nothing to v2 only before the move', () => {
      configureSlots([customGreetingV1]);
      renderSlot(greetingV2Only);
      expect(screen.getByText('Hello, Ada')).toBeInTheDocument();
      expect(screen.queryByText('Welcome back, Ada')).not.toBeInTheDocument();
    });
  });

  describe('renamed in place', () => {
    it('gives a widget that reads userName undefined', () => {
      // @ts-expect-error The typecheck verifies the other half of the how-to's claim: userName is no longer a member of GreetingSlotProps.
      const ReadsUserName = ({ userName }: RenamedInPlaceProps) => <h1>Welcome back, {String(userName)}</h1>;
      configureSlots([appendWidget('org.openedx.frontend.slot.example.greeting.v1', 'readsUserName', ReadsUserName)]);
      renderSlot(<GreetingSlotRenamedInPlace displayName="Ada" />);
      expect(screen.getByText('Welcome back, undefined')).toBeInTheDocument();
    });
  });

  describe('bumped in place', () => {
    it('removes v1 from the app', () => {
      configureSlots([customGreetingV1]);
      renderSlot(<GreetingSlotBumpedInPlace displayName="Ada" />);
      expect(screen.getByText('Hello, Ada')).toBeInTheDocument();
      expect(screen.queryByText('Welcome back, Ada')).not.toBeInTheDocument();
    });
  });
});

// Changing a prop's type: message becomes a notice object.
const notice: Notice = { message: 'Maintenance tonight', severity: 'warning', onDismiss: () => {} };
const BannerV1Widget = ({ message }: BannerSlotProps) => <p>v1 widget: {message}</p>;
const BannerV2Widget = ({ notice: n }: BannerSlotV2Props) => <p>v2 widget: {n.severity} {n.message}</p>;
const BannerV1Layout = () => {
  const { message } = useSlotProps<BannerSlotProps>();
  return <LayoutPrinting text={`v1 layout: ${message}`} />;
};
const BannerV2Layout = () => {
  const { notice: n } = useSlotProps<BannerSlotV2Props>();
  return <LayoutPrinting text={`v2 layout: ${n.severity} ${n.message}`} />;
};

describeExample("changing a prop's type", {
  v1Id: 'org.openedx.frontend.slot.example.banner.v1',
  v2Id: 'org.openedx.frontend.slot.example.banner.v2',
  v1Only: <BannerSlotV1 message={notice.message} />,
  both: <BannerSlotV1V2 notice={notice} />,
  v2Only: <BannerSlotV2 notice={notice} />,
  defaultContentText: 'Maintenance tonight',
  v1Widget: BannerV1Widget,
  v1WidgetText: 'v1 widget: Maintenance tonight',
  v2Widget: BannerV2Widget,
  v2WidgetText: 'v2 widget: warning Maintenance tonight',
  v1Layout: BannerV1Layout,
  v1LayoutText: 'v1 layout: Maintenance tonight',
  v2Layout: BannerV2Layout,
  v2LayoutText: 'v2 layout: warning Maintenance tonight',
});

// A prop that becomes a list: selectedTag becomes selectedTags, and v1 gains the list too.
const TaggableItemV1Widget = ({ selectedTag }: TaggableItemSlotProps) => <p>v1 widget: {selectedTag}</p>;
const TaggableItemV2Widget = ({ selectedTags }: TaggableItemSlotV2Props) => <p>v2 widget: {selectedTags.join(', ')}</p>;
const TaggableItemV1Layout = () => {
  const { selectedTag } = useSlotProps<TaggableItemSlotProps>();
  return <LayoutPrinting text={`v1 layout: ${selectedTag}`} />;
};
const TaggableItemV2Layout = () => {
  const { selectedTags } = useSlotProps<TaggableItemSlotV2Props>();
  return <LayoutPrinting text={`v2 layout: ${selectedTags.join(', ')}`} />;
};

describeExample('a prop that becomes a list', {
  v1Id: 'org.openedx.frontend.slot.example.taggableItem.v1',
  v2Id: 'org.openedx.frontend.slot.example.taggableItem.v2',
  v1Only: <TaggableItemSlotV1 selectedTag="red" />,
  both: <TaggableItemSlotV1V2 selectedTags={['red']} />,
  v2Only: <TaggableItemSlotV2 selectedTags={['red']} />,
  defaultContentText: 'Tagged red',
  v1Widget: TaggableItemV1Widget,
  v1WidgetText: 'v1 widget: red',
  v2Widget: TaggableItemV2Widget,
  v2WidgetText: 'v2 widget: red',
  v1Layout: TaggableItemV1Layout,
  v1LayoutText: 'v1 layout: red',
  v2Layout: TaggableItemV2Layout,
  v2LayoutText: 'v2 layout: red',
});

describe('a prop that becomes a list', () => {
  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  it('gives a v1 widget only the first tag before the list is added to v1', () => {
    const PrintsProps = (props: FirstTagOnlyProps) => <p>v1 widget: {JSON.stringify(props)}</p>;
    configureSlots([appendWidget('org.openedx.frontend.slot.example.taggableItem.v1', 'printsProps', PrintsProps)]);
    renderSlot(<TaggableItemSlotV1V2FirstTagOnly selectedTags={['red', 'blue']} />);
    expect(screen.getByText('v1 widget: {"selectedTag":"red"}')).toBeInTheDocument();
  });

  it('gives a v1 widget an empty string when the list is empty', () => {
    const ReadsTagLiterally = ({ selectedTag }: TaggableItemSlotProps) => <p>v1 widget: {JSON.stringify(selectedTag)}</p>;
    configureSlots([appendWidget('org.openedx.frontend.slot.example.taggableItem.v1', 'readsTagLiterally', ReadsTagLiterally)]);
    renderSlot(<TaggableItemSlotV1V2 selectedTags={[]} />);
    expect(screen.getByText('v1 widget: ""')).toBeInTheDocument();
  });

  it('gives a v1 widget the first tag under the old name and the whole list under the new one', () => {
    const ReadsBoth = ({ selectedTag, selectedTags }: TaggableItemSlotProps) => <p>v1 widget: {selectedTag} of {selectedTags.join(', ')}</p>;
    configureSlots([appendWidget('org.openedx.frontend.slot.example.taggableItem.v1', 'readsBoth', ReadsBoth)]);
    renderSlot(<TaggableItemSlotV1V2 selectedTags={['red', 'blue']} />);
    expect(screen.getByText('v1 widget: red of red, blue')).toBeInTheDocument();
  });
});

// A slot whose default widget takes options: every tree gains a required foliage, shown as an icon.
const trees: TreeV2[] = [
  { id: 'teak', name: 'Teak', foliage: 'deciduous' },
  { id: 'sumac', name: 'Sumac', foliage: 'deciduous' },
  { id: 'redwood', name: 'Redwood', foliage: 'evergreen' },
];
const TreeListV1Widget = ({ trees: t }: TreeListSlotProps) => <p>v1 widget: {t.length}</p>;
const TreeListV2Widget = ({ trees: t }: TreeListSlotV2Props) => <p>v2 widget: {t.length}</p>;
const TreeListV1Layout = () => {
  const { trees: t } = useSlotProps<TreeListSlotProps>();
  return <LayoutPrinting text={`v1 layout: ${t.length}`} />;
};
const TreeListV2Layout = () => {
  const { trees: t } = useSlotProps<TreeListSlotV2Props>();
  return <LayoutPrinting text={`v2 layout: ${t.length}`} />;
};

const treeListV1Only = <TreeListSlotV1 trees={trees} />;
const treeListBoth = <TreeListSlotV1V2 trees={trees} />;
const treeListV2Only = <TreeListSlotV2 trees={trees} />;

describeExample('a slot whose default widget takes options', {
  v1Id: 'org.openedx.frontend.slot.example.treeList.v1',
  v2Id: 'org.openedx.frontend.slot.example.treeList.v2',
  v1Only: treeListV1Only,
  both: treeListBoth,
  v2Only: treeListV2Only,
  defaultContentText: /Redwood$/,
  v1Widget: TreeListV1Widget,
  v1WidgetText: 'v1 widget: 3',
  v2Widget: TreeListV2Widget,
  v2WidgetText: 'v2 widget: 3',
  v1Layout: TreeListV1Layout,
  v1LayoutText: 'v1 layout: 3',
  v2Layout: TreeListV2Layout,
  v2LayoutText: 'v2 layout: 3',
});

describe('a slot whose default widget takes options', () => {
  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  const v1Id = 'org.openedx.frontend.slot.example.treeList.v1';
  const v2Id = 'org.openedx.frontend.slot.example.treeList.v2';
  const quince: TreeV2 = { id: 'quince', name: 'Quince', foliage: 'deciduous' };

  it("renders the app's default list by name, before the change", () => {
    renderSlot(<TreeListPageV1 />);
    expect(screen.getByText('Redwood')).toBeInTheDocument();
    expect(screen.getByText('Sumac')).toBeInTheDocument();
    expect(screen.getByText('Teak')).toBeInTheDocument();
  });

  it("renders the app's default list with its foliage, after step 2", () => {
    renderSlot(<TreeListPageV2 />);
    expect(screen.getByText('🌲 Redwood')).toBeInTheDocument();
    expect(screen.getByText('🌳 Sumac')).toBeInTheDocument();
    expect(screen.getByText('🌳 Teak')).toBeInTheDocument();
  });

  it('gives a widget in v1 the options of v1 through useWidgetOptions() and of v2 through useWidgetOptionsForId(), on v2 wrapping v1', () => {
    const PrintsOptions = () => (
      <p>{JSON.stringify(useWidgetOptions())} {JSON.stringify(useWidgetOptionsForId(v2Id, 'printsOptions'))}</p>
    );
    configureSlots([
      appendWidget(v1Id, 'printsOptions', PrintsOptions),
      setOptions(v1Id, { from: 'v1' }, 'printsOptions'),
      setOptions(v2Id, { from: 'v2' }, 'printsOptions'),
    ]);
    renderSlot(treeListBoth);
    expect(screen.getByText('{"from":"v1"} {"from":"v2"}')).toBeInTheDocument();
  });

  it('gives a v1 widget trees without foliage, on v2 wrapping v1', () => {
    const PrintsFirstTree = ({ trees: t }: TreeListSlotProps) => <p>{JSON.stringify(t[0])}</p>;
    configureSlots([appendWidget(v1Id, 'printsFirstTree', PrintsFirstTree)]);
    renderSlot(treeListBoth);
    expect(screen.getByText('{"id":"teak","name":"Teak"}')).toBeInTheDocument();
  });

  it("lists a tree the operator's v1 option added, on v1 only", () => {
    configureSlots([addQuinceV1]);
    renderSlot(treeListV1Only);
    expect(screen.getByText('Quince')).toBeInTheDocument();
  });

  it("marks a tree the operator's v1 option added as unknown foliage, on v2 wrapping v1", () => {
    configureSlots([addQuinceV1]);
    renderSlot(treeListBoth);
    expect(screen.getByText('🪾 Quince')).toBeInTheDocument();
  });

  it("ignores the operator's v1 option on v2 only", () => {
    configureSlots([addQuinceV1]);
    renderSlot(treeListV2Only);
    expect(screen.getByText('🌲 Redwood')).toBeInTheDocument();
    expect(screen.queryByText(/Quince$/)).not.toBeInTheDocument();
  });

  it.each([
    ['v2 wrapping v1', treeListBoth],
    ['v2 only', treeListV2Only],
  ])('lists a tree a v2 option added with its foliage, on %s', (_state, element) => {
    configureSlots([setOptions(v2Id, { trees: (current: TreeV2[]) => [...current, quince] })]);
    renderSlot(element);
    expect(screen.getByText('🌳 Quince')).toBeInTheDocument();
  });

  it('keeps the foliage of a tree a v1 option renamed, on v2 wrapping v1', () => {
    const rename = (current: TreeV1[]) => current.map(tree => (tree.id === 'sumac' ? { ...tree, name: 'Staghorn Sumac' } : tree));
    configureSlots([setOptions(v1Id, { trees: rename })]);
    renderSlot(treeListBoth);
    expect(screen.getByText('🌳 Staghorn Sumac')).toBeInTheDocument();
  });

  it('never shows a v2 option a tree a v1 option added, on v2 wrapping v1', () => {
    let seen: Foliage[] = [];
    const record = (current: TreeV2[]) => {
      seen = current.map(tree => tree.foliage);
      return current;
    };
    configureSlots([addQuinceV1, setOptions(v2Id, { trees: record })]);
    renderSlot(treeListBoth);
    expect(seen).toEqual(['deciduous', 'deciduous', 'evergreen']);
  });
});

// Renaming a slot: songControls becomes trackControls, with the old id kept as an alias.
describe('renaming a slot', () => {
  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  const oldId = 'org.openedx.frontend.slot.example.songControls.v1';
  const newId = 'org.openedx.frontend.slot.example.trackControls.v1';
  const OldIdWidget = ({ onPlay }: SongControlsSlotProps) => <button type="button" onClick={onPlay}>old id widget</button>;
  const NewIdWidget = ({ onPlay }: TrackControlsSlotProps) => <button type="button" onClick={onPlay}>new id widget</button>;
  const onPlay = jest.fn();
  const onPause = jest.fn();

  beforeEach(() => {
    onPlay.mockClear();
  });

  it('passes the props to a widget under the old id, before the rename', async () => {
    configureSlots([appendWidget(oldId, 'oldIdWidget', OldIdWidget)]);
    renderSlot(<SongControlsSlot onPlay={onPlay} onPause={onPause} />);
    await userEvent.click(screen.getByText('old id widget'));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('ignores a widget under the old id, renamed without the alias', () => {
    configureSlots([appendWidget(oldId, 'oldIdWidget', OldIdWidget)]);
    renderSlot(<TrackControlsSlotNoAlias onPlay={onPlay} onPause={onPause} />);
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.queryByText('old id widget')).not.toBeInTheDocument();
  });

  describe('with the alias', () => {
    it.each([
      ['old id', oldId, OldIdWidget, 'old id widget'],
      ['new id', newId, NewIdWidget, 'new id widget'],
    ])('passes the props to a widget under the %s', async (_name, slotId, Widget, text) => {
      configureSlots([appendWidget(slotId, 'widget', Widget)]);
      renderSlot(<TrackControlsSlotAliased onPlay={onPlay} onPause={onPause} />);
      await userEvent.click(screen.getByText(text));
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    it('renders widgets under the old id and the new id together', () => {
      configureSlots([
        appendWidget(oldId, 'oldIdWidget', OldIdWidget),
        appendWidget(newId, 'newIdWidget', NewIdWidget),
      ]);
      renderSlot(<TrackControlsSlotAliased onPlay={onPlay} onPause={onPause} />);
      expect(screen.getByText('Play')).toBeInTheDocument();
      expect(screen.getByText('old id widget')).toBeInTheDocument();
      expect(screen.getByText('new id widget')).toBeInTheDocument();
    });

    it.each([
      ['old id', oldId],
      ['new id', newId],
    ])('lets an operation under the %s replace the default content', (_name, slotId) => {
      configureSlots([replaceDefaultContent(slotId, <p>replacement</p>)]);
      renderSlot(<TrackControlsSlotAliased onPlay={onPlay} onPause={onPause} />);
      expect(screen.getByText('replacement')).toBeInTheDocument();
      expect(screen.queryByText('Play')).not.toBeInTheDocument();
    });
  });

  describe('after the alias is removed', () => {
    it('ignores a widget under the old id', () => {
      configureSlots([appendWidget(oldId, 'oldIdWidget', OldIdWidget)]);
      renderSlot(<TrackControlsSlot onPlay={onPlay} onPause={onPause} />);
      expect(screen.getByText('Play')).toBeInTheDocument();
      expect(screen.queryByText('old id widget')).not.toBeInTheDocument();
    });

    it('passes the props to a widget under the new id', async () => {
      configureSlots([appendWidget(newId, 'newIdWidget', NewIdWidget)]);
      renderSlot(<TrackControlsSlot onPlay={onPlay} onPause={onPause} />);
      await userEvent.click(screen.getByText('new id widget'));
      expect(onPlay).toHaveBeenCalledTimes(1);
    });
  });
});

// Renaming a slot when its props change: songList becomes trackList, and songs becomes tracks.
const tracks: Track[] = [
  { id: 'overture', title: 'Overture', kind: 'song' },
  { id: 'episode-1', title: 'Episode 1', kind: 'episode' },
  { id: 'finale', title: 'Finale', kind: 'song' },
];
const songs = tracks.filter(track => track.kind === 'song');
const SongListWidget = ({ songs: s }: SongListSlotProps) => <p>songList widget: {s.map(song => song.title).join(', ')}</p>;
const TrackListWidget = ({ tracks: t }: TrackListSlotProps) => <p>trackList widget: {t.map(track => track.title).join(', ')}</p>;
const SongListLayout = () => {
  const { songs: s } = useSlotProps<SongListSlotProps>();
  return <LayoutPrinting text={`songList layout: ${s.map(song => song.title).join(', ')}`} />;
};
const TrackListLayout = () => {
  const { tracks: t } = useSlotProps<TrackListSlotProps>();
  return <LayoutPrinting text={`trackList layout: ${t.map(track => track.title).join(', ')}`} />;
};

const trackListWrapping = <TrackListSlotWrappingSongList tracks={tracks} />;

describeExample('renaming a slot when its props change', {
  v1Id: 'org.openedx.frontend.slot.example.songList.v1',
  v2Id: 'org.openedx.frontend.slot.example.trackList.v1',
  names: ['songList', 'trackList'],
  v1Only: <SongListSlot songs={songs} />,
  both: trackListWrapping,
  v2Only: <TrackListSlot tracks={tracks} />,
  defaultContentText: 'Finale',
  v1Widget: SongListWidget,
  v1WidgetText: 'songList widget: Overture, Finale',
  v2Widget: TrackListWidget,
  v2WidgetText: 'trackList widget: Overture, Episode 1, Finale',
  v1Layout: SongListLayout,
  v1LayoutText: 'songList layout: Overture, Finale',
  v2Layout: TrackListLayout,
  v2LayoutText: 'trackList layout: Overture, Episode 1, Finale',
});

describe('renaming a slot when its props change', () => {
  afterEach(() => {
    setSiteConfig({ ...getSiteConfig(), apps: [] });
  });

  it('gives a songList widget only the songs, on trackList wrapping songList', () => {
    const PrintsProps = (props: SongListSlotProps) => <p>songList widget: {JSON.stringify(props)}</p>;
    configureSlots([appendWidget('org.openedx.frontend.slot.example.songList.v1', 'printsProps', PrintsProps)]);
    renderSlot(trackListWrapping);
    expect(screen.getByText('songList widget: {"songs":[{"id":"overture","title":"Overture","kind":"song"},{"id":"finale","title":"Finale","kind":"song"}]}')).toBeInTheDocument();
  });
});
