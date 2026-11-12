# How to: Add a New Version of a Slot

## Overview

A change that would break a slot's API contract, as [ADR 0009](../decisions/0009-slot-naming-and-lifecycle.rst) defines it, cannot land without bumping the slot's version. Simply bumping the version would be a breaking change to the app. Ideally the new version can be added alongside the old one, with the old one deprecated and removed later. This guide provides examples of some ways to do that. The last two examples rename a slot, first with its contract unchanged and then with it changed.

## Example: renaming a prop

A greeting slot with one prop:

```tsx
import { Slot } from '@openedx/frontend-base';

export interface GreetingSlotProps {
  userName: string;
}

const GreetingSlot = ({ userName }: GreetingSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={userName}>
    <h1>Hello, {userName}</h1>
  </Slot>
);

export default GreetingSlot;
```

`userName` is being renamed to `displayName`. Simply renaming it would break the slot's API contract: a widget that reads `userName` would get `undefined`, and a widget typed with `GreetingSlotProps` would stop compiling.

```diff
 export interface GreetingSlotProps {
-  userName: string;
+  displayName: string;
 }

-const GreetingSlot = ({ userName }: GreetingSlotProps) => (
-  <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={userName}>
-    <h1>Hello, {userName}</h1>
+const GreetingSlot = ({ displayName }: GreetingSlotProps) => (
+  <Slot id="org.openedx.frontend.slot.example.greeting.v1" displayName={displayName}>
+    <h1>Hello, {displayName}</h1>
   </Slot>
 );
```

Bumping to `v2` at the same time removes `v1` from the app, which is a breaking change to the app.

```diff
 export interface GreetingSlotProps {
-  userName: string;
+  displayName: string;
 }

-const GreetingSlot = ({ userName }: GreetingSlotProps) => (
-  <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={userName}>
-    <h1>Hello, {userName}</h1>
+const GreetingSlot = ({ displayName }: GreetingSlotProps) => (
+  <Slot id="org.openedx.frontend.slot.example.greeting.v2" displayName={displayName}>
+    <h1>Hello, {displayName}</h1>
   </Slot>
 );
```

The steps below add `v2` while leaving `v1` in place.

### 1. Declare the new version's props as a new interface

The old interface keeps every member it had, so that widgets typed against it still compile. Give the two interfaces versioned names, and keep the old unversioned name as an alias of the old one.

```tsx
export interface GreetingSlotV1Props {
  userName: string;
}

export type GreetingSlotProps = GreetingSlotV1Props;

export interface GreetingSlotV2Props {
  displayName: string;
}
```

### 2. Render the new version around the old one

The `v2` `<Slot>` wraps the `v1` `<Slot>`, and the default content stays inside `v1`. Each `<Slot>` gets its own props. A value both versions need is passed under each version's name.

```tsx
const GreetingSlot = ({ displayName }: GreetingSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.greeting.v2" displayName={displayName}>
    <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={displayName}>
      <h1>Hello, {displayName}</h1>
    </Slot>
  </Slot>
);
```

This is what keeps both versions working at once:

- The `v1` slot is the `v2` slot's default content. Every `v1` widget, layout and option applies exactly as before.
- A `v2` operation that replaces the default content replaces `v1` and everything in it. That is what an operator moving to `v2` expects.
- A `v2` layout receives `v1` as its `defaultContent` widget, the same as it would any default content.

### 3. Mark the old props as deprecated

Add a `@deprecated` note to the old interface and to each renamed member.

```tsx
/** @deprecated Replaced by `GreetingSlotV2Props`, the props of `org.openedx.frontend.slot.example.greeting.v2`. */
export interface GreetingSlotV1Props {
  /** @deprecated Renamed to `displayName` in `GreetingSlotV2Props`. */
  userName: string;
}

/** @deprecated Renamed to `GreetingSlotV1Props`. */
export type GreetingSlotProps = GreetingSlotV1Props;
```

### 4. Give each version its own README

Rename the slot's `README.md` to `README.v1.md`, and write a new `README.md` for `v2`. The new file should link to `README.v1.md` as the previous version, and it should carry over every `v1` example that still applies, updated for `v2`, alongside any new ones. The only change to `README.v1.md` is a note at the top:

```markdown
> [!WARNING]
> `org.openedx.frontend.slot.example.greeting.v1` is deprecated and will be
> removed in a future release. Use `org.openedx.frontend.slot.example.greeting.v2`
> instead.
```

### 5. Commit as `feat:`

Adding a version beside a working one is not a breaking change to the app, so this is `feat:` and not `feat!:`. The commit body should say which version is deprecated and what replaces it.

```text
feat: add greeting slot v2, deprecate v1

org.openedx.frontend.slot.example.greeting.v1 is deprecated and will be
removed in a future release. Use
org.openedx.frontend.slot.example.greeting.v2 instead.
```

### 6. Remove the old version

Once the deprecation process allows it, and at least one Open edX named release has shipped with both versions, remove `v1`:

```diff
 import { Slot } from '@openedx/frontend-base';

-/** @deprecated Replaced by `GreetingSlotV2Props`, the props of `org.openedx.frontend.slot.example.greeting.v2`. */
-export interface GreetingSlotV1Props {
-  /** @deprecated Renamed to `displayName` in `GreetingSlotV2Props`. */
-  userName: string;
-}
-
-/** @deprecated Renamed to `GreetingSlotV1Props`. */
-export type GreetingSlotProps = GreetingSlotV1Props;
-
 export interface GreetingSlotV2Props {
   displayName: string;
 }

 const GreetingSlot = ({ displayName }: GreetingSlotV2Props) => (
   <Slot id="org.openedx.frontend.slot.example.greeting.v2" displayName={displayName}>
-    <Slot id="org.openedx.frontend.slot.example.greeting.v1" userName={displayName}>
-      <h1>Hello, {displayName}</h1>
-    </Slot>
+    <h1>Hello, {displayName}</h1>
   </Slot>
 );

 export default GreetingSlot;
```

Delete `README.v1.md` and the link to it from `README.md`.

Removing the old version is a breaking change to the app, so this commit is `feat!:`.

```text
feat!: remove greeting slot v1

BREAKING CHANGE: org.openedx.frontend.slot.example.greeting.v1 and
GreetingSlotProps are removed. Use
org.openedx.frontend.slot.example.greeting.v2 and GreetingSlotV2Props
instead.
```

### Moving a widget to `v2`

A widget written for `v1` keeps working unchanged for as long as `v1` exists. Moving it to `v2` is a change of slot id and prop name in the site config:

```diff
 {
-  slotId: 'org.openedx.frontend.slot.example.greeting.v1',
+  slotId: 'org.openedx.frontend.slot.example.greeting.v2',
   id: 'customGreeting',
   op: WidgetOperationTypes.REPLACE,
   relatedId: 'defaultContent',
-  component: ({ userName }: GreetingSlotProps) => <h1>Welcome back, {userName}</h1>,
+  component: ({ displayName }: GreetingSlotV2Props) => <h1>Welcome back, {displayName}</h1>,
 }
```

## Example: changing a prop's type

A banner slot with one prop:

```tsx
import { Slot } from '@openedx/frontend-base';

export interface BannerSlotProps {
  message: string;
}

const BannerSlot = ({ message }: BannerSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.banner.v1" message={message}>
    <Banner message={message} />
  </Slot>
);

export default BannerSlot;
```

`message` is being replaced by a `notice` object that also carries a severity and a dismiss handler.

### 1. Declare the new version's props as a new interface

The member changes type instead of name. `Notice` is new, so it is declared here and exported from the app's `index.ts` beside the slot props, so that a widget can import it.

```tsx
export interface BannerSlotV1Props {
  message: string;
}

export type BannerSlotProps = BannerSlotV1Props;

export interface Notice {
  message: string;
  severity: 'info' | 'warning' | 'error';
  onDismiss: () => void;
}

export interface BannerSlotV2Props {
  notice: Notice;
}
```

### 2. Render the new version around the old one

`v1` gets its value from the `v2` value instead of the same value under another name.

```tsx
const BannerSlot = ({ notice }: BannerSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.banner.v2" notice={notice}>
    <Slot id="org.openedx.frontend.slot.example.banner.v1" message={notice.message}>
      <Banner notice={notice} />
    </Slot>
  </Slot>
);
```

### 3. Mark the old props as deprecated

The member's `@deprecated` note says what replaces it and how to get the old value from the new one.

```tsx
/** @deprecated Replaced by `BannerSlotV2Props`, the props of `org.openedx.frontend.slot.example.banner.v2`. */
export interface BannerSlotV1Props {
  /** @deprecated Replaced by `notice` in `BannerSlotV2Props`; this is `notice.message`. */
  message: string;
}
```

### 4. Give each version its own README

Same as for the prop rename.

### 5. Commit as `feat:`

Same as for the prop rename.

### 6. Remove the old version

Same as for the prop rename.

## Example: a prop that becomes a list

A taggable item slot with one prop:

```tsx
import { Slot } from '@openedx/frontend-base';

export interface TaggableItemSlotProps {
  selectedTag: string;
}

const TaggableItemSlot = ({ selectedTag }: TaggableItemSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.taggableItem.v1" selectedTag={selectedTag}>
    <p>Tagged {selectedTag}</p>
  </Slot>
);

export default TaggableItemSlot;
```

`selectedTag` is becoming a list, `selectedTags`.

### 1. Declare the new version's props as a new interface

Version and alias the old interface.

```tsx
export interface TaggableItemSlotV1Props {
  selectedTag: string;
}

export type TaggableItemSlotProps = TaggableItemSlotV1Props;
```

Declare the new interface with only the list.

```tsx
export interface TaggableItemSlotV2Props {
  selectedTags: string[];
}
```

`selectedTags` can also be added to `v1` so widgets in the `v1` slot can read the list. This is purely additive and non-breaking.

```diff
 export interface TaggableItemSlotV1Props {
   selectedTag: string;
+  selectedTags: string[];
 }
```

Also update the slot's README.

### 2. Render the new version around the old one

Without a 1:1 mapping from the new props to the old ones, there is a choice to make about what the old slot gets. Here `v1` expects a single tag and `v2` has a list.

```tsx
const TaggableItemSlot = ({ selectedTags }: TaggableItemSlotV2Props) => {
  // v1 takes a single tag. This example gives it the first of the list, or an empty string when the list is empty.
  const selectedTag = selectedTags[0] ?? '';
  return (
    <Slot id="org.openedx.frontend.slot.example.taggableItem.v2" selectedTags={selectedTags}>
      <Slot id="org.openedx.frontend.slot.example.taggableItem.v1" selectedTag={selectedTag} selectedTags={selectedTags}>
        <p>Tagged {selectedTags.join(', ')}</p>
      </Slot>
    </Slot>
  );
};
```

### 3. Mark the old props as deprecated

Add the `@deprecated` notes as in the prop rename.

```tsx
/** @deprecated Replaced by `TaggableItemSlotV2Props`, the props of `org.openedx.frontend.slot.example.taggableItem.v2`. */
export interface TaggableItemSlotV1Props {
  /** @deprecated This is the first of `selectedTags`, or an empty string when there are none. Read `selectedTags` instead. */
  selectedTag: string;
  selectedTags: string[];
}
```

### 4. Give each version its own README

Same as for the prop rename.

### 5. Commit as `feat:`

Same as for the prop rename.

### 6. Remove the old version

Same as for the prop rename.

## Example: a slot whose default widget takes options

A tree list slot with one prop, whose default widget lists the trees by name and takes an option to replace or edit the list:

```tsx
import { Slot, useWidgetOptions } from '@openedx/frontend-base';

export interface Tree {
  id: string;
  name: string;
}

export interface TreeListSlotProps {
  trees: Tree[];
}

interface TreeListOptions {
  trees?: Tree[] | ((current: Tree[]) => Tree[]);
}

const DefaultTreeListWidget = ({ trees }: { trees: Tree[] }) => {
  const options = useWidgetOptions() as TreeListOptions;
  const shown = typeof options.trees === 'function'
    ? options.trees(trees)
    : options.trees ?? trees;
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{tree.name}</li>)}
    </ul>
  );
};

const TreeListSlot = ({ trees }: TreeListSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v1" trees={trees}>
    <DefaultTreeListWidget trees={trees} />
  </Slot>
);

export default TreeListSlot;
```

The app renders the slot with its default list of trees:

```tsx
<TreeListSlot
  trees={[
    { id: 'teak', name: 'Teak' },
    { id: 'sumac', name: 'Sumac' },
    { id: 'redwood', name: 'Redwood' },
  ]}
/>
```

An operator adds a tree from the site config:

```ts
{
  slotId: 'org.openedx.frontend.slot.example.treeList.v1',
  op: WidgetOperationTypes.OPTIONS,
  relatedId: 'defaultContent',
  options: {
    trees: (current: Tree[]) => [...current, { id: 'quince', name: 'Quince' }],
  },
}
```

A new required `foliage` (`evergreen` or `deciduous`) field is being added.

### 1. Declare the new version's props as a new interface

Version and alias the old interfaces, including the types they are built from.

```tsx
export interface TreeV1 {
  id: string;
  name: string;
}

export type Tree = TreeV1;

export interface TreeListSlotV1Props {
  trees: TreeV1[];
}

export type TreeListSlotProps = TreeListSlotV1Props;
```

Declare the new ones with the field.

```tsx
export type Foliage = 'evergreen' | 'deciduous';

export interface TreeV2 {
  id: string;
  name: string;
  foliage: Foliage;
}

export interface TreeListSlotV2Props {
  trees: TreeV2[];
}
```

Version the option's type with them.

```tsx
type TreeListV1Option = TreeV1[] | ((current: TreeV1[]) => TreeV1[]);

interface TreeListV1Options {
  trees?: TreeListV1Option;
}

interface TreeListV2Options {
  trees?: TreeV2[] | ((current: TreeV2[]) => TreeV2[]);
}
```

### 2. Render the new version around the old one

A `v1` widget or layout expects `v1` trees, so `v1` gets the list without foliage.

```tsx
const toTreeV1 = ({ foliage, ...tree }: TreeV2): TreeV1 => tree;
```

```tsx
const TreeListSlot = ({ trees }: TreeListSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v2" trees={trees}>
    <Slot id="org.openedx.frontend.slot.example.treeList.v1" trees={trees.map(toTreeV1)}>
      <DefaultTreeListWidget trees={trees} />
    </Slot>
  </Slot>
);
```

The app's own list gains the field:

```diff
 <TreeListSlot
   trees={[
-    { id: 'teak', name: 'Teak' },
-    { id: 'sumac', name: 'Sumac' },
-    { id: 'redwood', name: 'Redwood' },
+    { id: 'teak', name: 'Teak', foliage: 'deciduous' },
+    { id: 'sumac', name: 'Sumac', foliage: 'deciduous' },
+    { id: 'redwood', name: 'Redwood', foliage: 'evergreen' },
   ]}
 />
```

Rebuild the default widget for `v2`, as it will be once `v1` is gone.

```tsx
const FOLIAGE_ICON: Record<Foliage, string> = { evergreen: '🌲', deciduous: '🌳' };

const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
  const options = useWidgetOptions() as TreeListV2Options;
  const shown = typeof options.trees === 'function'
    ? options.trees(trees)
    : options.trees ?? trees;
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{FOLIAGE_ICON[tree.foliage]} {tree.name}</li>)}
    </ul>
  );
};
```

`useWidgetOptions()` reads the options of the slot the widget is in. With `v2` wrapping `v1`, the widget is in `v1`, so it gets `v1`'s options instead of `v2`'s. This can be worked around by reading `v2`'s options by id.

```diff
 const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
-  const options = useWidgetOptions() as TreeListV2Options;
+  // While v1 is wrapped, this widget is v1's defaultContent, so useWidgetOptions() reads v1's options.
+  const v1Options = useWidgetOptions() as TreeListV1Options;
+  const v2Options = useWidgetOptionsForId('org.openedx.frontend.slot.example.treeList.v2', 'defaultContent') as TreeListV2Options;
```

Apply `v2`'s option first, to the list exactly as it will be once `v1` is gone, so a `v2` operator never sees a `v1` tree.

```diff
-  const shown = typeof options.trees === 'function'
-    ? options.trees(trees)
-    : options.trees ?? trees;
+  const v2Trees = typeof v2Options.trees === 'function'
+    ? v2Options.trees(trees)
+    : v2Options.trees ?? trees;
```

Put everything `v1` needs in one function. It gives a `v1` option `v1` trees, and gives each tree the option returns its foliage back by id. A tree the option added has none.

```tsx
type ShownTree = TreeV1 & { foliage?: Foliage };

// A v1 option sees and returns v1 trees. A tree it kept gets its foliage back by id; a tree it added has none.
function applyV1Option(option: TreeListV1Option | undefined, trees: TreeV2[]): ShownTree[] {
  const v1Trees = trees.map(toTreeV1);
  const result = typeof option === 'function' ? option(v1Trees) : option ?? v1Trees;
  const foliageOf = (id: string) => trees.find(tree => tree.id === id)?.foliage;
  return result.map(tree => ({ ...tree, foliage: foliageOf(tree.id) }));
}
```

```diff
     : v2Options.trees ?? trees;
+  const shown = applyV1Option(v1Options.trees, v2Trees);
```

Show a tree without foliage as 🪾.

```diff
-      {shown.map(tree => <li key={tree.id}>{FOLIAGE_ICON[tree.foliage]} {tree.name}</li>)}
+      {shown.map(tree => <li key={tree.id}>{tree.foliage ? FOLIAGE_ICON[tree.foliage] : '🪾'} {tree.name}</li>)}
```

### 3. Mark the old props as deprecated

Add the `@deprecated` notes as in the prop rename, to the tree type as well as the props.

```tsx
/** @deprecated Replaced by `TreeV2`, which adds `foliage`. */
export interface TreeV1 {
  id: string;
  name: string;
}

/** @deprecated Renamed to `TreeV1`. */
export type Tree = TreeV1;
```

```tsx
/** @deprecated Replaced by `TreeListSlotV2Props`, the props of `org.openedx.frontend.slot.example.treeList.v2`. */
export interface TreeListSlotV1Props {
  /** @deprecated `trees` in `TreeListSlotV2Props` is `TreeV2[]`. A `v1` option cannot set a tree's foliage. */
  trees: TreeV1[];
}
```

<details>
<summary>The slot after step 3</summary>

```tsx
import { Slot, useWidgetOptions, useWidgetOptionsForId } from '@openedx/frontend-base';

/** @deprecated Replaced by `TreeV2`, which adds `foliage`. */
export interface TreeV1 {
  id: string;
  name: string;
}

/** @deprecated Renamed to `TreeV1`. */
export type Tree = TreeV1;

/** @deprecated Replaced by `TreeListSlotV2Props`, the props of `org.openedx.frontend.slot.example.treeList.v2`. */
export interface TreeListSlotV1Props {
  /** @deprecated `trees` in `TreeListSlotV2Props` is `TreeV2[]`. A `v1` option cannot set a tree's foliage. */
  trees: TreeV1[];
}

/** @deprecated Renamed to `TreeListSlotV1Props`. */
export type TreeListSlotProps = TreeListSlotV1Props;

export type Foliage = 'evergreen' | 'deciduous';

export interface TreeV2 {
  id: string;
  name: string;
  foliage: Foliage;
}

export interface TreeListSlotV2Props {
  trees: TreeV2[];
}

type TreeListV1Option = TreeV1[] | ((current: TreeV1[]) => TreeV1[]);

interface TreeListV1Options {
  trees?: TreeListV1Option;
}

interface TreeListV2Options {
  trees?: TreeV2[] | ((current: TreeV2[]) => TreeV2[]);
}

const toTreeV1 = ({ foliage, ...tree }: TreeV2): TreeV1 => tree;

type ShownTree = TreeV1 & { foliage?: Foliage };

// A v1 option sees and returns v1 trees. A tree it kept gets its foliage back by id; a tree it added has none.
function applyV1Option(option: TreeListV1Option | undefined, trees: TreeV2[]): ShownTree[] {
  const v1Trees = trees.map(toTreeV1);
  const result = typeof option === 'function' ? option(v1Trees) : option ?? v1Trees;
  const foliageOf = (id: string) => trees.find(tree => tree.id === id)?.foliage;
  return result.map(tree => ({ ...tree, foliage: foliageOf(tree.id) }));
}

const FOLIAGE_ICON: Record<Foliage, string> = { evergreen: '🌲', deciduous: '🌳' };

const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
  // While v1 is wrapped, this widget is v1's defaultContent, so useWidgetOptions() reads v1's options.
  const v1Options = useWidgetOptions() as TreeListV1Options;
  const v2Options = useWidgetOptionsForId('org.openedx.frontend.slot.example.treeList.v2', 'defaultContent') as TreeListV2Options;
  const v2Trees = typeof v2Options.trees === 'function'
    ? v2Options.trees(trees)
    : v2Options.trees ?? trees;
  const shown = applyV1Option(v1Options.trees, v2Trees);
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{tree.foliage ? FOLIAGE_ICON[tree.foliage] : '🪾'} {tree.name}</li>)}
    </ul>
  );
};

const TreeListSlot = ({ trees }: TreeListSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v2" trees={trees}>
    <Slot id="org.openedx.frontend.slot.example.treeList.v1" trees={trees.map(toTreeV1)}>
      <DefaultTreeListWidget trees={trees} />
    </Slot>
  </Slot>
);

export default TreeListSlot;
```

</details>

### 4. Give each version its own README

Same as for the prop rename.

### 5. Commit as `feat:`

Same as for the prop rename.

### 6. Remove the old version

Same as for the prop rename, and everything `v1` needed goes:

```diff
-import { Slot, useWidgetOptions, useWidgetOptionsForId } from '@openedx/frontend-base';
+import { Slot, useWidgetOptions } from '@openedx/frontend-base';
-
-/** @deprecated Replaced by `TreeV2`, which adds `foliage`. */
-export interface TreeV1 {
-  id: string;
-  name: string;
-}
-
-/** @deprecated Renamed to `TreeV1`. */
-export type Tree = TreeV1;
-
-/** @deprecated Replaced by `TreeListSlotV2Props`, the props of `org.openedx.frontend.slot.example.treeList.v2`. */
-export interface TreeListSlotV1Props {
-  /** @deprecated `trees` in `TreeListSlotV2Props` is `TreeV2[]`. A `v1` option cannot set a tree's foliage. */
-  trees: TreeV1[];
-}
-
-/** @deprecated Renamed to `TreeListSlotV1Props`. */
-export type TreeListSlotProps = TreeListSlotV1Props;

 export type Foliage = 'evergreen' | 'deciduous';

 export interface TreeV2 {
   id: string;
   name: string;
   foliage: Foliage;
 }

 export interface TreeListSlotV2Props {
   trees: TreeV2[];
 }

-type TreeListV1Option = TreeV1[] | ((current: TreeV1[]) => TreeV1[]);
-
-interface TreeListV1Options {
-  trees?: TreeListV1Option;
-}
-
 interface TreeListV2Options {
   trees?: TreeV2[] | ((current: TreeV2[]) => TreeV2[]);
-}
-
-const toTreeV1 = ({ foliage, ...tree }: TreeV2): TreeV1 => tree;
-
-type ShownTree = TreeV1 & { foliage?: Foliage };
-
-// A v1 option sees and returns v1 trees. A tree it kept gets its foliage back by id; a tree it added has none.
-function applyV1Option(option: TreeListV1Option | undefined, trees: TreeV2[]): ShownTree[] {
-  const v1Trees = trees.map(toTreeV1);
-  const result = typeof option === 'function' ? option(v1Trees) : option ?? v1Trees;
-  const foliageOf = (id: string) => trees.find(tree => tree.id === id)?.foliage;
-  return result.map(tree => ({ ...tree, foliage: foliageOf(tree.id) }));
 }

 const FOLIAGE_ICON: Record<Foliage, string> = { evergreen: '🌲', deciduous: '🌳' };

 const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
-  // While v1 is wrapped, this widget is v1's defaultContent, so useWidgetOptions() reads v1's options.
-  const v1Options = useWidgetOptions() as TreeListV1Options;
-  const v2Options = useWidgetOptionsForId('org.openedx.frontend.slot.example.treeList.v2', 'defaultContent') as TreeListV2Options;
-  const v2Trees = typeof v2Options.trees === 'function'
-    ? v2Options.trees(trees)
-    : v2Options.trees ?? trees;
-  const shown = applyV1Option(v1Options.trees, v2Trees);
+  const options = useWidgetOptions() as TreeListV2Options;
+  const shown = typeof options.trees === 'function'
+    ? options.trees(trees)
+    : options.trees ?? trees;
   return (
     <ul>
-      {shown.map(tree => <li key={tree.id}>{tree.foliage ? FOLIAGE_ICON[tree.foliage] : '🪾'} {tree.name}</li>)}
+      {shown.map(tree => <li key={tree.id}>{FOLIAGE_ICON[tree.foliage]} {tree.name}</li>)}
     </ul>
   );
 };

 const TreeListSlot = ({ trees }: TreeListSlotV2Props) => (
   <Slot id="org.openedx.frontend.slot.example.treeList.v2" trees={trees}>
-    <Slot id="org.openedx.frontend.slot.example.treeList.v1" trees={trees.map(toTreeV1)}>
-      <DefaultTreeListWidget trees={trees} />
-    </Slot>
+    <DefaultTreeListWidget trees={trees} />
   </Slot>
 );

 export default TreeListSlot;
```

<details>
<summary>The slot after step 6</summary>

```tsx
import { Slot, useWidgetOptions } from '@openedx/frontend-base';

export type Foliage = 'evergreen' | 'deciduous';

export interface TreeV2 {
  id: string;
  name: string;
  foliage: Foliage;
}

export interface TreeListSlotV2Props {
  trees: TreeV2[];
}

interface TreeListV2Options {
  trees?: TreeV2[] | ((current: TreeV2[]) => TreeV2[]);
}

const FOLIAGE_ICON: Record<Foliage, string> = { evergreen: '🌲', deciduous: '🌳' };

const DefaultTreeListWidget = ({ trees }: { trees: TreeV2[] }) => {
  const options = useWidgetOptions() as TreeListV2Options;
  const shown = typeof options.trees === 'function'
    ? options.trees(trees)
    : options.trees ?? trees;
  return (
    <ul>
      {shown.map(tree => <li key={tree.id}>{FOLIAGE_ICON[tree.foliage]} {tree.name}</li>)}
    </ul>
  );
};

const TreeListSlot = ({ trees }: TreeListSlotV2Props) => (
  <Slot id="org.openedx.frontend.slot.example.treeList.v2" trees={trees}>
    <DefaultTreeListWidget trees={trees} />
  </Slot>
);

export default TreeListSlot;
```

</details>

A `v2` operator's option was applied to the plain `v2` list before the removal and is applied to the same list after it, so a `v2` site config does not notice the removal.

## Example: renaming a slot

A song controls slot with two props:

```tsx
import { Slot } from '@openedx/frontend-base';

export interface SongControlsSlotProps {
  onPlay: () => void;
  onPause: () => void;
}

const SongControlsSlot = ({ onPlay, onPause }: SongControlsSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.songControls.v1" onPlay={onPlay} onPause={onPause}>
    <button type="button" onClick={onPlay}>Play</button>
    <button type="button" onClick={onPause}>Pause</button>
  </Slot>
);

export default SongControlsSlot;
```

Podcast episodes are being added beside the songs, so the slot is being renamed to `trackControls`. Its props, the place it renders and what it wraps stay the same, so nothing in its API contract changes and nothing calls for a new version. Simply renaming the id would still break every operator's site config: an operation written against the old id stops applying.

```diff
-export interface SongControlsSlotProps {
+export interface TrackControlsSlotProps {
   onPlay: () => void;
   onPause: () => void;
 }

-const SongControlsSlot = ({ onPlay, onPause }: SongControlsSlotProps) => (
-  <Slot id="org.openedx.frontend.slot.example.songControls.v1" onPlay={onPlay} onPause={onPause}>
+const TrackControlsSlot = ({ onPlay, onPause }: TrackControlsSlotProps) => (
+  <Slot id="org.openedx.frontend.slot.example.trackControls.v1" onPlay={onPlay} onPause={onPause}>
     <button type="button" onClick={onPlay}>Play</button>
     <button type="button" onClick={onPause}>Pause</button>
   </Slot>
 );
```

The steps below rename the slot while leaving the old id working.

### 1. Rename the component and its props interface

Rename the component, its file and folder, and its props interface. The interface's name is an export, so keep the old name as an alias of the new one.

```tsx
export interface TrackControlsSlotProps {
  onPlay: () => void;
  onPause: () => void;
}

/** @deprecated Renamed to `TrackControlsSlotProps`. */
export type SongControlsSlotProps = TrackControlsSlotProps;
```

### 2. Keep the old id as an alias

Render under the new id, with the old id in `idAliases`.

```tsx
const TrackControlsSlot = ({ onPlay, onPause }: TrackControlsSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.example.trackControls.v1"
    idAliases={['org.openedx.frontend.slot.example.songControls.v1']}
    onPlay={onPlay}
    onPause={onPause}
  >
    <button type="button" onClick={onPlay}>Play</button>
    <button type="button" onClick={onPause}>Pause</button>
  </Slot>
);
```

### 3. Update the README

Change the slot id in the README's title and examples, and add a note at the top:

```markdown
> [!WARNING]
> `org.openedx.frontend.slot.example.songControls.v1` is deprecated and will be
> removed in a future release. Use `org.openedx.frontend.slot.example.trackControls.v1`
> instead.
```

### 4. Commit as `feat:`

Adding an alias is not a breaking change to the app, so this is `feat:` and not `feat!:`. The commit body should say which id is deprecated and what replaces it.

```text
feat: rename the song controls slot to track controls

org.openedx.frontend.slot.example.songControls.v1 is deprecated and will
be removed in a future release. Use
org.openedx.frontend.slot.example.trackControls.v1 instead.
```

### 5. Remove the alias

Once the deprecation process allows it, and at least one Open edX named release has shipped with the alias, remove it and the interface alias:

```diff
 import { Slot } from '@openedx/frontend-base';

 export interface TrackControlsSlotProps {
   onPlay: () => void;
   onPause: () => void;
 }

-/** @deprecated Renamed to `TrackControlsSlotProps`. */
-export type SongControlsSlotProps = TrackControlsSlotProps;
-
 const TrackControlsSlot = ({ onPlay, onPause }: TrackControlsSlotProps) => (
   <Slot
     id="org.openedx.frontend.slot.example.trackControls.v1"
-    idAliases={['org.openedx.frontend.slot.example.songControls.v1']}
     onPlay={onPlay}
     onPause={onPause}
   >
     <button type="button" onClick={onPlay}>Play</button>
     <button type="button" onClick={onPause}>Pause</button>
   </Slot>
 );

 export default TrackControlsSlot;
```

Delete the note from `README.md`.

Removing the alias is a breaking change to the app, so this commit is `feat!:`.

```text
feat!: remove the song controls slot alias

BREAKING CHANGE: org.openedx.frontend.slot.example.songControls.v1 and
SongControlsSlotProps are removed. Use
org.openedx.frontend.slot.example.trackControls.v1 and
TrackControlsSlotProps instead.
```

## Example: renaming a slot when its props change

A song list slot with one prop:

```tsx
import { Slot } from '@openedx/frontend-base';

export interface Song {
  id: string;
  title: string;
}

export interface SongListSlotProps {
  songs: Song[];
}

const SongListSlot = ({ songs }: SongListSlotProps) => (
  <Slot id="org.openedx.frontend.slot.example.songList.v1" songs={songs}>
    <ul>
      {songs.map(song => <li key={song.id}>{song.title}</li>)}
    </ul>
  </Slot>
);

export default SongListSlot;
```

Podcast episodes are being added to the list. The slot's id and props are changing:

```diff
-export interface SongListSlotProps {
-  songs: Song[];
+export interface TrackListSlotProps {
+  tracks: Track[];
 }

-const SongListSlot = ({ songs }: SongListSlotProps) => (
-  <Slot id="org.openedx.frontend.slot.example.songList.v1" songs={songs}>
+const TrackListSlot = ({ tracks }: TrackListSlotProps) => (
+  <Slot id="org.openedx.frontend.slot.example.trackList.v1" tracks={tracks}>
     <ul>
-      {songs.map(song => <li key={song.id}>{song.title}</li>)}
+      {tracks.map(track => <li key={track.id}>{track.title}</li>)}
     </ul>
   </Slot>
 );
```

### 1. Declare the new slot's props as a new interface

`Track` and `TrackKind` are new, so they are declared here and exported from the app's `index.ts` beside the slot props.

```tsx
export type TrackKind = 'song' | 'episode';

export interface Track {
  id: string;
  title: string;
  kind: TrackKind;
}

export interface TrackListSlotProps {
  tracks: Track[];
}
```

### 2. Render the new slot around the old one

Rename the component, its file and its folder with the slot, and wrap the old `<Slot>` in the new one.

```tsx
const TrackListSlot = ({ tracks }: TrackListSlotProps) => {
  // The old slot takes songs only, so it gets the songs out of the list.
  const songs: Song[] = tracks.filter(track => track.kind === 'song');
  return (
    <Slot id="org.openedx.frontend.slot.example.trackList.v1" tracks={tracks}>
      <Slot id="org.openedx.frontend.slot.example.songList.v1" songs={songs}>
        <ul>
          {tracks.map(track => <li key={track.id}>{track.title}</li>)}
        </ul>
      </Slot>
    </Slot>
  );
};
```

### 3. Mark the old props as deprecated

Add a `@deprecated` note to the old interface and to each member whose replacement has another name.

```tsx
/** @deprecated Replaced by `TrackListSlotProps`, the props of `org.openedx.frontend.slot.example.trackList.v1`. */
export interface SongListSlotProps {
  /** @deprecated These are the songs in `tracks` of `TrackListSlotProps`. */
  songs: Song[];
}
```

### 4. Give each slot its own README

Same as for the prop rename, with the old slot's `README.md` renamed to `README.songList.v1.md`. The note at its top:

```markdown
> [!WARNING]
> `org.openedx.frontend.slot.example.songList.v1` is deprecated and will be
> removed in a future release. Use `org.openedx.frontend.slot.example.trackList.v1`
> instead.
```

### 5. Commit as `feat:`

Adding a slot beside a working one is not a breaking change to the app, so this is `feat:` and not `feat!:`. The commit body should say which slot is deprecated and what replaces it.

```text
feat: add track list slot, deprecate song list slot

org.openedx.frontend.slot.example.songList.v1 is deprecated and will be
removed in a future release. Use
org.openedx.frontend.slot.example.trackList.v1 instead.
```

### 6. Remove the old slot

Once the deprecation process allows it, and at least one Open edX named release has shipped with both slots, remove the old one and everything only it needed:

```diff
 import { Slot } from '@openedx/frontend-base';

-export interface Song {
-  id: string;
-  title: string;
-}
-
 export type TrackKind = 'song' | 'episode';

 export interface Track {
   id: string;
   title: string;
   kind: TrackKind;
 }

-/** @deprecated Replaced by `TrackListSlotProps`, the props of `org.openedx.frontend.slot.example.trackList.v1`. */
-export interface SongListSlotProps {
-  /** @deprecated These are the songs in `tracks` of `TrackListSlotProps`. */
-  songs: Song[];
-}
-
 export interface TrackListSlotProps {
   tracks: Track[];
 }

-const TrackListSlot = ({ tracks }: TrackListSlotProps) => {
-  // The old slot takes songs only, so it gets the songs out of the list.
-  const songs: Song[] = tracks.filter(track => track.kind === 'song');
-  return (
-    <Slot id="org.openedx.frontend.slot.example.trackList.v1" tracks={tracks}>
-      <Slot id="org.openedx.frontend.slot.example.songList.v1" songs={songs}>
-        <ul>
-          {tracks.map(track => <li key={track.id}>{track.title}</li>)}
-        </ul>
-      </Slot>
-    </Slot>
-  );
-};
+const TrackListSlot = ({ tracks }: TrackListSlotProps) => (
+  <Slot id="org.openedx.frontend.slot.example.trackList.v1" tracks={tracks}>
+    <ul>
+      {tracks.map(track => <li key={track.id}>{track.title}</li>)}
+    </ul>
+  </Slot>
+);

 export default TrackListSlot;
```

Delete `README.songList.v1.md` and the link to it from `README.md`.

Removing the old slot is a breaking change to the app, so this commit is `feat!:`.

```text
feat!: remove the song list slot

BREAKING CHANGE: org.openedx.frontend.slot.example.songList.v1,
SongListSlotProps and Song are removed. Use
org.openedx.frontend.slot.example.trackList.v1, TrackListSlotProps and
Track instead.
```
