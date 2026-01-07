import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icon } from './Icon';
import { ICONS } from '@/lib/constants';

describe('Icon Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toBeInTheDocument();
    });

    it('should render the correct icon name', () => {
      render(<Icon name={ICONS.navigation.home} ariaLabel="Home" />);
      const icon = screen.getByText(ICONS.navigation.home);
      expect(icon).toBeInTheDocument();
    });

    it('should render with default size (md)', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-xl'); // md size
    });
  });

  describe('Sizes', () => {
    it('should apply small size class', () => {
      render(<Icon name={ICONS.actions.add} size="sm" ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-base');
    });

    it('should apply medium size class', () => {
      render(<Icon name={ICONS.actions.add} size="md" ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-xl');
    });

    it('should apply large size class', () => {
      render(<Icon name={ICONS.actions.add} size="lg" ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-2xl');
    });

    it('should apply extra large size class', () => {
      render(<Icon name={ICONS.actions.add} size="xl" ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-4xl');
    });

    it('should apply 2xl size class', () => {
      render(<Icon name={ICONS.actions.add} size="2xl" ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-6xl');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Icon
          name={ICONS.actions.add}
          className="text-red-500"
          ariaLabel="Add"
        />
      );
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('text-red-500');
    });

    it('should merge custom className with default classes', () => {
      render(
        <Icon
          name={ICONS.actions.add}
          className="custom-class"
          ariaLabel="Add"
        />
      );
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('custom-class');
      expect(icon).toHaveClass('material-symbols-outlined');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label when provided', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add item" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveAttribute('aria-label', 'Add item');
    });

    it('should not be aria-hidden when not decorative', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveAttribute('aria-hidden', 'false');
    });

    it('should be aria-hidden when decorative', () => {
      render(<Icon name={ICONS.actions.add} decorative />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not have aria-label when decorative', () => {
      render(<Icon name={ICONS.actions.add} decorative />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).not.toHaveAttribute('aria-label');
    });

    it('should have role="presentation" when decorative', () => {
      render(<Icon name={ICONS.actions.add} decorative />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveAttribute('role', 'presentation');
    });

    it('should not have role when not decorative', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).not.toHaveAttribute('role');
    });
  });

  describe('Icon Categories', () => {
    it('should render navigation icons', () => {
      render(<Icon name={ICONS.navigation.home} ariaLabel="Home" />);
      expect(screen.getByText(ICONS.navigation.home)).toBeInTheDocument();
    });

    it('should render action icons', () => {
      render(<Icon name={ICONS.actions.edit} ariaLabel="Edit" />);
      expect(screen.getByText(ICONS.actions.edit)).toBeInTheDocument();
    });

    it('should render user icons', () => {
      render(<Icon name={ICONS.user.person} ariaLabel="Person" />);
      expect(screen.getByText(ICONS.user.person)).toBeInTheDocument();
    });

    it('should render security icons', () => {
      render(<Icon name={ICONS.security.gppGood} ariaLabel="Secure" />);
      expect(screen.getByText(ICONS.security.gppGood)).toBeInTheDocument();
    });

    it('should render analytics icons', () => {
      render(<Icon name={ICONS.analytics.barChart} ariaLabel="Chart" />);
      expect(screen.getByText(ICONS.analytics.barChart)).toBeInTheDocument();
    });

    it('should render status icons', () => {
      render(<Icon name={ICONS.status.hourglassEmpty} ariaLabel="Loading" />);
      expect(screen.getByText(ICONS.status.hourglassEmpty)).toBeInTheDocument();
    });
  });

  describe('Base Classes', () => {
    it('should always have material-symbols-outlined class', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('material-symbols-outlined');
    });

    it('should always have inline-flex class', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon).toHaveClass('inline-flex');
    });

    it('should render as a span element', () => {
      render(<Icon name={ICONS.actions.add} ariaLabel="Add" />);
      const icon = screen.getByText(ICONS.actions.add);
      expect(icon.tagName).toBe('SPAN');
    });
  });
});
