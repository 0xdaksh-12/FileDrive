import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home } from './Home';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '@/providers/authProvider';

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Home>;

export const Default: Story = {};
