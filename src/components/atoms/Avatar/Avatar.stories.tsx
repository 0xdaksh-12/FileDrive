import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    name: { control: 'text' },
    email: { control: 'text' },
    src: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'Daksh',
    email: 'daksh@mail.com',
    size: 'sm',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/100',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    name: 'DJ',
    size: 'lg',
  },
};

export const ExtraSmall: Story = {
  args: {
    name: 'U',
    size: 'xs',
  },
};
