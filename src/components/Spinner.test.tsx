import { renderToStaticMarkup } from 'react-dom/server';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders as status by default', () => {
    const html = renderToStaticMarkup(<Spinner />);

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Loading"');
  });

  it('omits accessibility attributes when decorative', () => {
    const html = renderToStaticMarkup(<Spinner decorative />);

    expect(html).not.toContain('role="status"');
    expect(html).toContain('aria-hidden="true"');
  });
});
