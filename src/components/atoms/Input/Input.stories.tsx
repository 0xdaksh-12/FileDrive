import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your link"
      />
    );
  },
};

export const WithError: Story = {
  render: function Render() {
    return <Input placeholder="Invalid URL" error="Invalid link" />;
  },
};

export const Disabled: Story = {
  render: function Render() {
    return <Input placeholder="Disabled field" disabled />;
  },
};
