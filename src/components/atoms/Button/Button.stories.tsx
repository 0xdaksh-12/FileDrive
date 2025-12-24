import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'error',
      ],
    },
    style: {
      control: 'select',
      options: ['default', 'outline', 'soft', 'ghost', 'link'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    size: 'md',
    style: 'default',
    loading: false,
    disabled: false,
    variant: 'success',
  },
};

export const GoogleIconText: Story = {
  args: {
    children: (
      <>
        <span className="material-symbols-outlined">download</span>
        Download
      </>
    ),

    size: 'md',
    style: 'default',
    loading: false,
    disabled: false,
    variant: "accent"
  },
};
