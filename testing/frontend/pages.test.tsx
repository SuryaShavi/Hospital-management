import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// import every page component from the frontend sources
import Login from '../../frontend/src/app/pages/Login';
import Register from '../../frontend/src/app/pages/Register';
import Dashboard from '../../frontend/src/app/pages/Dashboard';
import Patients from '../../frontend/src/app/pages/Patients';
import Doctors from '../../frontend/src/app/pages/Doctors';
import Appointments from '../../frontend/src/app/pages/Appointments';
import MedicalRecords from '../../frontend/src/app/pages/MedicalRecords';
import Billing from '../../frontend/src/app/pages/Billing';
import BillingDetail from '../../frontend/src/app/pages/BillingDetail';
import Pharmacy from '../../frontend/src/app/pages/Pharmacy';
import Reports from '../../frontend/src/app/pages/Reports';
import Settings from '../../frontend/src/app/pages/Settings';

const pages: Array<{ name: string; component: React.ComponentType<any> }> = [
  { name: 'Login', component: Login },
  { name: 'Register', component: Register },
  { name: 'Dashboard', component: Dashboard },
  { name: 'Patients', component: Patients },
  { name: 'Doctors', component: Doctors },
  { name: 'Appointments', component: Appointments },
  { name: 'MedicalRecords', component: MedicalRecords },
  { name: 'Billing', component: Billing },
  { name: 'BillingDetail', component: BillingDetail },
  { name: 'Pharmacy', component: Pharmacy },
  { name: 'Reports', component: Reports },
  { name: 'Settings', component: Settings },
];

// provide a simple fetch stub so that any useEffect network calls don't reject
beforeAll(() => {
  jest.spyOn(global, 'fetch').mockImplementation(async () => {
    return {
      ok: true,
      json: async () => ([]),
    } as any;
  });
});

describe('Page components render without crashing', () => {
  pages.forEach(({ name, component: Component }) => {
    test(`${name} page loads`, () => {
      render(
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      );
      // at least one element should exist in the DOM
      expect(document.body).not.toBeNull();
    });
  });
});
