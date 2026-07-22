import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Button } from './Button';
import { Icon } from '../Icon/Icon';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Action',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Action',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete Account',
    variant: 'danger',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Not Allowed',
    variant: 'primary',
    disabled: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Upload',
    variant: 'secondary',
    leftIcon: <Icon name="upload" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Next Step',
    variant: 'primary',
    rightIcon: <Icon name="arrow_forward" />,
  },
};
