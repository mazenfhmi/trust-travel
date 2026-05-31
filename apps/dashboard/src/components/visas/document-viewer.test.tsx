import React from 'react';
import { render, screen } from '@testing-library/react';
import { DocumentViewer } from './document-viewer';

describe('DocumentViewer', () => {
  it('renders passport and photo links', () => {
    const docs = [
      { type: 'PASSPORT', url: 'http://test.com/passport.jpg' },
      { type: 'PERSONAL_PHOTO', url: 'http://test.com/photo.jpg' },
    ];
    render(<DocumentViewer documents={docs} />);
    expect(screen.getByText('View PASSPORT')).toBeInTheDocument();
    expect(screen.getByText('View PERSONAL_PHOTO')).toBeInTheDocument();
  });
});
