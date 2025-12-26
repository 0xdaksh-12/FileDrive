import type { Meta, StoryObj } from '@storybook/react-vite';
import { Login } from './Login';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '@/providers/authProvider';

const meta: Meta<typeof Login> = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen gridplace-items-center bg-base-200 p-4">
            <Story />
          </div>
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Login>;

export const Default: Story = {};
