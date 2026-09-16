'use client';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const switchVariants = cva(
  'inline-flex items-center justify-center transition-colors peer h-5 w-9 rounded-full border border-transparent bg-muted cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const SwitchComponent = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & VariantProps<typeof switchVariants> & { checked?: boolean; onChange?: (value: boolean) => void }
>(({ className, variant, checked: checkedProp, onChange, ...props }, ref) => {
  const [checked, setChecked] = React.useState(!!checkedProp);

  const handleClick = () => {
    const newVal = !checked;
    setChecked(newVal);
    onChange?.(newVal);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      className={`${switchVariants({ variant, className })} relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent bg-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input`}
      onClick={handleClick}
      ref={ref}
    >
      <span
        className={`pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-background shadow-sm ring-0 transition translate-x-0 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0`}
      />
    </button>
  );
});
SwitchComponent.displayName = 'Switch';

export { SwitchComponent as Switch };
