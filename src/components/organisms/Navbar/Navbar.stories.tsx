/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import AuthContext from '@/context/authContext';
import type { AuthContextType } from '@/types';

// Mock Provider to control auth state via Storybook controls
const MockAuthProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Partial<AuthContextType>;
}) => {
  const defaultValue: AuthContextType = {
    user: null,
    isAuth: false,
    loading: false,
    login: async () => ({ accessToken: 'mock_token' }),
    register: async () => ({ accessToken: 'mock_token' }),
    logout: async () => {},
    ...value,
  };

  return (
    <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
  );
};

const meta: Meta<typeof Navbar> = {
  title: 'Organisms/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => (
      <BrowserRouter>
        <MockAuthProvider value={context.args as any}>
          <Story />
        </MockAuthProvider>
      </BrowserRouter>
    ),
  ],
  // We need to define argTypes manually since Navbar doesn't have these props
  argTypes: {
    isAuth: {
      control: 'boolean',
      description: 'Is user authenticated?',
    },
    user: {
      control: 'object',
      description: 'User object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Guest: Story = {
  args: {
    isAuth: false,
    user: null,
  },
};

export const Authenticated: Story = {
  args: {
    isAuth: true,
    user: {
      name: 'DJ',
      email: 'dj@example.com',
      profilePic: '',
    },
    logout: async () => alert('Logout clicked'),
  },
};

export const AuthenticatedWithProfilePic: Story = {
  args: {
    isAuth: true,
    user: {
      name: 'DJ',
      email: 'dj@example.com',
      profilePic: 'https://i.pravatar.cc/150?img=3',
    },
    logout: async () => alert('Logout clicked'),
  },
};
