import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import { NavAction } from './NavAction';

const meta: Meta<typeof NavAction> = {
  title: 'Molecules/NavAction',
  component: NavAction,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-6">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'primary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavAction>;

export const Dashboard: Story = {
  args: {
    to: '/dashboard',
    icon: 'dashboard',
    children: 'Dashboard',
  },
};

export const PrimaryRegister: Story = {
  args: {
    to: '/auth/register',
    icon: 'person_add',
    children: 'Register',
    variant: 'primary',
  },
};
