import { ReactNode } from 'react';
import { Card, Container } from '@openedx/paragon';
import { Slot } from '../../../runtime';
import HorizontalSlotLayout from './HorizontalSlotLayout';
import LayoutWithOptions from './LayoutWithOptions';
import ToggleByRoleLayout from './ToggleByRoleLayout';
import './SlotShowcase.scss';

function SlotContainer({ children }: { children: ReactNode }) {
  return (
    <Card className="showcase-slot">
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
}

function Section({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div>
      <h3 className="text-primary-500">{title}</h3>
      {children}
    </div>
  );
}

export default function SlotShowcasePage() {
  return (
    <Container fluid size="xl" className="showcase-page py-4">
      <div className="showcase-full-width">
        <h1>Slot Showcase</h1>
        <p>As a best practice, widgets should pass additional props (<code>...props</code>) to their rendered HTMLElement.  This allows custom layouts to add <code>className</code> and <code>style</code> props as necessary for the layout.</p>
      </div>

      <Section title="Simple slot with default layout">
        <p>This slot has no opinionated layout, it just renders its children.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseSimple" />
        </SlotContainer>
      </Section>

      <Section title="Simple slot with default content and props">
        <p>This slot has default content, and it exposes a slot prop to widgets.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseSimpleWithDefaultContent" aSlotProp="hello!">
            <div className="showcase-widget">Look, I&apos;m default content!</div>
          </Slot>
        </SlotContainer>
      </Section>

      <h2 className="showcase-divider">UI Layout Operations</h2>

      <Section title="Slot with custom layout (component)">
        <p>This slot uses a horizontal flexbox layout from a component.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseCustom" layout={HorizontalSlotLayout} />
        </SlotContainer>
      </Section>

      <Section title="Slot with custom layout (element)">
        <p>This slot uses a horizontal flexbox layout from a JSX element.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseCustom" layout={<HorizontalSlotLayout />} />
        </SlotContainer>
      </Section>

      <Section title="Slot with override custom layout">
        <p>This slot uses a horizontal flexbox layout, but it was added by a layout replace operation.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseCustomConfig" />
        </SlotContainer>
      </Section>

      <Section title="Slot with layout options (default)">
        <p>This slot uses a custom layout that takes options.  It shows the default title.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptionsDefault" layout={LayoutWithOptions} />
        </SlotContainer>
      </Section>

      <Section title="Slot with layout options (configured)">
        <p>Same layout, but the title option is set to &quot;Bar&quot;.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptions" layout={LayoutWithOptions} />
        </SlotContainer>
      </Section>

      <Section title="Slot with widget filtering by role">
        <p>This slot has four widgets, two with a &quot;highlighted&quot; role.  The layout uses <code>widgets.byRole()</code> to toggle between all and highlighted.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseFilterByRole" layout={ToggleByRoleLayout} />
        </SlotContainer>
      </Section>

      <h2 className="showcase-divider">UI Widget Operations</h2>

      <Section title="Slot with prepended element">
        <p>This slot has a prepended element (and two appended elements).</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcasePrepending" />
        </SlotContainer>
      </Section>

      <Section title="Slot with inserted elements">
        <p>This slot has elements inserted before and after the second element. The insert operations are declared <em>before</em> the related element, but can still insert themselves relative to it.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseInserting" />
        </SlotContainer>
      </Section>

      <Section title="Slot with replaced element">
        <p>This slot has an element replacing element two.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseReplacing" />
        </SlotContainer>
      </Section>

      <Section title="Slot with removed element">
        <p>This slot has removed element two (<code>WidgetOperationTypes.REMOVE</code>).</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseRemoving" />
        </SlotContainer>
      </Section>

      <Section title="Slot with widget options (default)">
        <p>This widget accepts options.  It shows the default title.</p>
        <SlotContainer>
          <Slot id="org.openedx.frontend.slot.dev.slotShowcaseWidgetOptions" />
        </SlotContainer>
      </Section>

    </Container>
  );
}
