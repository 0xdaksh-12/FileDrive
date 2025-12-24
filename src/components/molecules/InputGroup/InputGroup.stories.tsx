import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputGroup } from './InputGroup';
import { useState } from 'react';

const meta: Meta<typeof InputGroup> = {
  title: 'Molecules/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const ScanUrlBar: Story = {
  render: function Render() {
    const [url, setUrl] = useState('');

    return (
      <div className="max-w-xl p-6 bg-base-200 rounded-xl">
        <InputGroup
          icon="link"
          placeholder="Paste a suspicious link here..."
          buttonText="Scan URL Now"
          value={url}
          className="border-0 focus:outline-none focus:ring-0 focus:border-0"
          onChange={(e) => setUrl(e.target.value)}
          onAction={() => alert(`Scanning: ${url}`)}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: function Render() {
    return (
      <div className="max-w-xl p-6 bg-base-200 rounded-xl">
        <InputGroup
          icon="link"
          placeholder="Broken link"
          buttonText="Scan"
          error="Invalid URL format"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="max-w-xl p-6 bg-base-200 rounded-xl">
        <InputGroup
          icon="link"
          placeholder="Service unavailable"
          buttonText="Scan"
          disabled
        />
      </div>
    );
  },
};
