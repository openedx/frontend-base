import mainLandmark from './mainLandmark';

describe('mainLandmark', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('passes with one main element', () => {
    document.body.innerHTML = '<main>Content</main>';
    expect(mainLandmark(document)).toBeUndefined();
  });

  it('does not count main elements with the hidden attribute', () => {
    document.body.innerHTML = '<main hidden>Hidden</main><main>Content</main><main hidden>Hidden</main>';
    expect(mainLandmark(document)).toBeUndefined();
  });

  it('reports more than one main element without the hidden attribute as an error', () => {
    document.body.innerHTML = '<main>Outer<main>Inner</main></main>';
    expect(mainLandmark(document)).toEqual({ level: 'error', message: expect.stringContaining('2 <main> elements') });
  });

  it('reports a missing main element as a warning', () => {
    document.body.innerHTML = '<div id="main-content">Content</div>';
    expect(mainLandmark(document)).toEqual({ level: 'warning', message: expect.stringContaining('no <main> element') });
  });
});
