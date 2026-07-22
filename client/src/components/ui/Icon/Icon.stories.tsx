import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'search',
  },
};

export const Interactive: Story = {
  args: {
    name: 'visibility',
    onClick: () => alert('Clicked!'),
  },
};

export const Disabled: Story = {
  args: {
    name: 'visibility',
    onClick: () => alert('Clicked!'),
    disabled: true,
  },
};
