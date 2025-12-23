import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Organisms/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Guest: Story = {
  args: {
    isAuth: false,
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
    onLogout: () => alert('Logout clicked'),
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
    onLogout: () => alert('Logout clicked'),
  },
};
