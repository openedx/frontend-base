import { IFrameContentWrapper } from '@openedx/frontend-base';

export default function IframeWidget() {
  return (
    <IFrameContentWrapper>
      <section className="bg-light p-3 h-100">
        <h4>Inserted iFrame Widget</h4>
        <p>
          This is a component that lives in the test-site but is loaded into the page via an iframe.  This emulates a real-world scenario.  It is NOT testing for cross-origin security issues though, since it&apos;s on the same host name.
        </p>
      </section>
    </IFrameContentWrapper>
  );
}
