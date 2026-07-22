import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'jane@example.com',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters long.',
    type: 'password',
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    errorText: 'This username is already taken.',
    defaultValue: 'johndoe',
  },
};
