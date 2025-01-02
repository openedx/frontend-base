import { Slot } from '../../../runtime';
import HorizontalSlotLayout from './HorizontalSlotLayout';
import LayoutWithOptions from './LayoutWithOptions';

export default function SlotShowcasePage() {
  return (
    <div className="p-3">
      <h1>Slot Showcase</h1>

      <p>As a best practice, widgets should pass additional props (<code>...props</code>) to their rendered HTMLElement. This accomplishes two things:

        <ul>
          <li>It allows custom layouts to add <code>className</code> and <code>style</code> props as necessary for the layout.</li>
          <li>It allows widgets to be effectively &quot;wrapped&quot; by a parent component to alter their behavior.</li>
        </ul>
      </p>

      <h3>Simple slot with default layout</h3>
      <p>This slot has no opinionated layout, it just renders its children.</p>
      <Slot id="frontend.dev-project.slot-showcase.simple.ui" />

      <h2>UI Layout Operations</h2>

      <h3>Slot with custom layout</h3>
      <p>This slot uses a horizontal flexbox layout.</p>
      <Slot id="frontend.dev-project.slot-showcase.custom.ui" layout={HorizontalSlotLayout} />

      <h3>Slot with override custom layout</h3>
      <p>This slot uses a horizontal flexbox layout, but it was added by a layout replace operation.</p>
      <Slot id="frontend.dev-project.slot-showcase.customConfig.ui" />

      <h3>Slot with layout options</h3>
      <p>These slots use a custom layout that takes options.  The first shows the default title, the second shows it set to &quot;Bar&quot;</p>
      <Slot id="frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui" layout={LayoutWithOptions} />
      <Slot id="frontend.dev-project.slot-showcase.layoutWithOptions.ui" layout={LayoutWithOptions} />

      <h2>UI Widget Operations</h2>

      <h3>Slot with prepended element</h3>
      <p>This slot has a prepended element (and two appended elements).</p>
      <Slot id="frontend.dev-project.slot-showcase.prepending.ui" />

      <h3>Slot with inserted elements</h3>
      <p>This slot has elements inserted before and after the second element. Also note that the insert operations are declared <em>before</em> the related element is declared, but can still insert themselves relative to it.</p>
      <Slot id="frontend.dev-project.slot-showcase.inserting.ui" />

      <h3>Slot with replaced element</h3>
      <p>This slot has an element replacing element two.</p>
      <Slot id="frontend.dev-project.slot-showcase.replacing.ui" />

      <h3>Slot with removed element</h3>
      <p>This slot has removed element two (<code>WidgetOperationTypes.REMOVE</code>).</p>
      <Slot id="frontend.dev-project.slot-showcase.removing.ui" />

      <h3>Slot with widget with options.</h3>
      <p>Both widgets accept options.  The first shows the default title, the second shows it set to &quot;Bar&quot;</p>
      <Slot id="frontend.dev-project.slot-showcase.widgetOptions.ui" />
    </div>
  );
}
