import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect } from 'vitest';

describe('LoginPage', () => {
  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check if the welcome text is present
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    
    // Check if the inputs are present
    expect(screen.getByPlaceholderText('johndoe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    
    // Check if the submit button is present
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
