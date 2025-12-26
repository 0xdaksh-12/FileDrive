import type { Meta, StoryObj } from '@storybook/react-vite';
import { Register } from './Register';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '@/providers/authProvider';

const meta: Meta<typeof Register> = {
  title: 'Pages/Register',
  component: Register,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen grid place-items-center bg-base-200 p-4">
            <Story />
          </div>
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Register>;

export const Default: Story = {};
