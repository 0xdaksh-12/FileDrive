import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField, type FieldDefinition } from './FormField';
import { useState } from 'react';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

const fields: FieldDefinition[] = [
  {
    id: 'email',
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'example@mail.com',
    icon: 'mail',
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    icon: 'lock',
  },
  {
    id: 'remember',
    name: 'remember',
    type: 'checkbox',
    label: 'Remember me',
  },
];

export const Default: Story = {
  render: function Render() {
    const [formData, setFormData] = useState<Record<string, string | boolean>>({
      email: '',
      password: '',
      remember: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    return (
      <div className="max-w-md w-full">
        <form className="flex flex-col gap-4">
          <FormField
            fields={fields}
            formData={formData}
            onChange={handleChange}
          />
        </form>
        <pre className="mt-4 text-xs bg-base-200 p-2 rounded">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    );
  },
};

export const WithErrors: Story = {
  render: function Render() {
    const [formData, setFormData] = useState<Record<string, string | boolean>>({
      email: 'invalid-email',
      password: '',
      remember: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    const errors = {
      email: 'Invalid email address',
      password: 'Password is required',
    };

    return (
      <div className="max-w-md w-full">
        <form className="flex flex-col gap-4">
          <FormField
            fields={fields}
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </form>
      </div>
    );
  },
};
