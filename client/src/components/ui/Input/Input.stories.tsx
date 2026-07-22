import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Input } from './Input';
import { Icon } from '../Icon/Icon';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  // Wrapper to prevent the input from stretching across the entire Storybook preview
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your email...',
    size: 'md',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: 'invalid-email',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Cannot edit this field',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    size: 'sm',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <Icon name="search" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter password...',
    type: 'password',
    rightIcon: <Icon name="visibility" onClick={() => alert('Toggle visibility')} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search and clear...',
    leftIcon: <Icon name="search" />,
    rightIcon: <Icon name="close" onClick={() => alert('Clear')} />,
  },
};
