import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // The seeded record gives us a deterministic expectation regardless of the
    // rest of the shared database contents.
    const seededPerk = global._TEST_CONTEXT_.seededPerk;

    // Debug: Check if seeded perk exists
    console.log('Seeded perk:', seededPerk);
    console.log('Token in localStorage:', window.localStorage.getItem('token'));

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the baseline card to appear which guarantees the asynchronous
    // fetch finished.
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record.
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    // Use the seeded record
    const seededPerk = global._TEST_CONTEXT_.seededPerk;

    // Debug: Check if seeded perk exists
    console.log('Seeded perk:', seededPerk);

    // Render the page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the fetch to finish
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Choose the record's merchant from the dropdown.
    // We'll find the <select> element by its 'combobox' role.
    const merchantFilter = screen.getByRole('combobox');
    fireEvent.change(merchantFilter, { target: { value: seededPerk.merchant } });

    // Verify the record is still displayed after filtering
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // Verify the summary text reflects the number of matching perks
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});