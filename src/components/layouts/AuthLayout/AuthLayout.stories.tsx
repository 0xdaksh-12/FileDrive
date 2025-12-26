import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthLayout from './AuthLayout';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof AuthLayout> = {
  title: 'Layouts/AuthLayout',
  component: AuthLayout,
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
type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  render: () => <AuthLayout />,
};
