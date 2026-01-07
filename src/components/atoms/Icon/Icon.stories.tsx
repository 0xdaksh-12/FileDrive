import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { ICONS } from '@/lib/constants';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.values(ICONS).flatMap((category) =>
        Object.values(category)
      ),
      description: 'Material Symbols icon name',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Icon size',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the icon is purely decorative',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Story
export const Default: Story = {
  args: {
    name: ICONS.actions.add,
    ariaLabel: 'Add',
  },
};

// Different Sizes
export const Sizes: Story = {
  args: { name: ICONS.actions.add },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name={ICONS.actions.add} size="sm" ariaLabel="Small add icon" />
      <Icon name={ICONS.actions.add} size="md" ariaLabel="Medium add icon" />
      <Icon name={ICONS.actions.add} size="lg" ariaLabel="Large add icon" />
      <Icon
        name={ICONS.actions.add}
        size="xl"
        ariaLabel="Extra large add icon"
      />
      <Icon name={ICONS.actions.add} size="2xl" ariaLabel="2X large add icon" />
    </div>
  ),
};

// Navigation Icons
export const Navigation: Story = {
  args: { name: ICONS.navigation.home },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(ICONS.navigation).map(([key, iconName]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" ariaLabel={key} />
          <span className="text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

// Action Icons
export const Actions: Story = {
  args: { name: ICONS.actions.add },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(ICONS.actions).map(([key, iconName]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" ariaLabel={key} />
          <span className="text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

// User Icons
export const User: Story = {
  args: { name: ICONS.user.person },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(ICONS.user).map(([key, iconName]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" ariaLabel={key} />
          <span className="text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

// Security Icons
export const Security: Story = {
  args: { name: ICONS.security.gppGood },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(ICONS.security).map(([key, iconName]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" ariaLabel={key} />
          <span className="text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

// Analytics Icons
export const Analytics: Story = {
  args: { name: ICONS.analytics.barChart },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(ICONS.analytics).map(([key, iconName]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" ariaLabel={key} />
          <span className="text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

// Status Icons
export const Status: Story = {
  args: { name: ICONS.status.schedule },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(ICONS.status).map(([key, iconName]) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <Icon name={iconName} size="lg" ariaLabel={key} />
          <span className="text-xs">{key}</span>
        </div>
      ))}
    </div>
  ),
};

// With Custom Styling
export const CustomStyling: Story = {
  args: { name: ICONS.actions.add },
  render: () => (
    <div className="flex gap-4">
      <Icon
        name={ICONS.actions.add}
        size="xl"
        className="text-blue-500"
        ariaLabel="Blue add icon"
      />
      <Icon
        name={ICONS.security.gppGood}
        size="xl"
        className="text-green-500"
        ariaLabel="Green security icon"
      />
      <Icon
        name={ICONS.security.gppBad}
        size="xl"
        className="text-red-500"
        ariaLabel="Red security icon"
      />
    </div>
  ),
};

// Decorative Icon (no aria-label needed)
export const Decorative: Story = {
  args: {
    name: ICONS.actions.add,
    decorative: true,
  },
};

// Interactive Example
export const Interactive: Story = {
  args: { name: ICONS.actions.add },
  render: () => (
    <button
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      onClick={() => alert('Button clicked!')}
    >
      <Icon name={ICONS.actions.add} ariaLabel="Add" />
      <span>Add Item</span>
    </button>
  ),
};
