import { render, renderHook } from '@testing-library/react';
import { ReactNode, StrictMode } from 'react';

import usePageTitle from './usePageTitle';

type Title = string | null | undefined;

function Page({ title, children }: { title?: Title; children?: ReactNode }) {
  usePageTitle(title);
  return <div>{children}</div>;
}

describe('usePageTitle', () => {
  beforeEach(() => {
    document.title = 'Fallback';
  });

  it('sets the document title', () => {
    renderHook(() => usePageTitle('Dashboard | Site'));
    expect(document.title).toBe('Dashboard | Site');
  });

  it('updates the document title when it changes', () => {
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: 'One | Site' },
    });
    rerender({ title: 'Two | Site' });
    expect(document.title).toBe('Two | Site');
  });

  it.each([undefined, null, ''])('sets no title while it is %p', (empty) => {
    const { rerender } = renderHook(({ title }: { title: Title }) => usePageTitle(title), {
      initialProps: { title: empty as Title },
    });
    expect(document.title).toBe('Fallback');

    rerender({ title: 'Course | Site' });
    expect(document.title).toBe('Course | Site');
  });

  it('keeps the last title after the page unmounts', () => {
    const { unmount } = renderHook(() => usePageTitle('Dashboard | Site'));
    unmount();
    expect(document.title).toBe('Dashboard | Site');
  });

  it('lets the next page replace the previous one', () => {
    const { rerender } = render(<Page key="one" title="One | Site" />);
    rerender(<Page key="two" title="Two | Site" />);
    expect(document.title).toBe('Two | Site');
  });

  it('prefers the innermost title', () => {
    render(
      <Page title="Parent | Site">
        <Page title="Child | Site" />
      </Page>
    );
    expect(document.title).toBe('Child | Site');
  });

  it('keeps the innermost title when the outer one changes', () => {
    const { rerender } = render(
      <Page title="Parent | Site">
        <Page title="Child | Site" />
      </Page>
    );
    rerender(
      <Page title="Renamed Parent | Site">
        <Page title="Child | Site" />
      </Page>
    );
    expect(document.title).toBe('Child | Site');
  });

  it('writes the title once when the innermost one changes', () => {
    const { rerender } = render(
      <Page title="Parent | Site">
        <Page title="One | Site" />
      </Page>
    );
    const setTitle = jest.spyOn(document, 'title', 'set');
    rerender(
      <Page title="Parent | Site">
        <Page title="Two | Site" />
      </Page>
    );
    expect(setTitle.mock.calls).toEqual([['Two | Site']]);
    setTitle.mockRestore();
  });

  it('falls back to the outer title when the inner one unmounts', () => {
    const { rerender } = render(
      <Page title="Parent | Site">
        <Page title="Child | Site" />
      </Page>
    );
    rerender(<Page title="Parent | Site" />);
    expect(document.title).toBe('Parent | Site');
  });

  it('falls back to the outer title when the inner one becomes empty', () => {
    const { rerender } = render(
      <Page title="Parent | Site">
        <Page title="Child | Site" />
      </Page>
    );
    rerender(
      <Page title="Parent | Site">
        <Page title={undefined} />
      </Page>
    );
    expect(document.title).toBe('Parent | Site');
  });

  describe('under StrictMode', () => {
    it('prefers the innermost title', () => {
      render(
        <StrictMode>
          <Page title="Parent | Site">
            <Page title="Child | Site" />
          </Page>
        </StrictMode>
      );
      expect(document.title).toBe('Child | Site');
    });

    it('falls back to the outer title when the inner one unmounts', () => {
      const { rerender } = render(
        <StrictMode>
          <Page title="Parent | Site">
            <Page title="Child | Site" />
          </Page>
        </StrictMode>
      );
      rerender(
        <StrictMode>
          <Page title="Parent | Site" />
        </StrictMode>
      );
      expect(document.title).toBe('Parent | Site');
    });
  });
});
