import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import { UserMenu } from './UserMenu';

const meta: Meta<typeof UserMenu> = {
  title: 'Molecules/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-6 flex justify-end">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {
  args: {
    user: {
      name: 'Daksh',
      email: 'daksh@mail.com',
    },
  },
};

export const WithProfileImage: Story = {
  args: {
    user: {
      name: 'DJ',
      profilePic: 'https://i.pravatar.cc/100',
    },
  },
};
