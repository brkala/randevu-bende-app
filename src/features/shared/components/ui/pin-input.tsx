import { PinInput as ArkPinInput, type PinInputRootProps } from '@ark-ui/react/pin-input';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const pinInputStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-fg-default select-none',
    control: 'flex gap-2 flex-wrap justify-center',
    input:
      'bg-bg-default text-fg-default text-center border border-border-default transition-colors duration-normal ease-enter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent disabled:pointer-events-none disabled:opacity-50 disabled:bg-bg-subtle disabled:text-fg-muted',
    errorText: 'text-xs text-error-default',
  },
  variants: {
    size: {
      sm: { input: 'h-8 w-6 text-xs rounded-l1' },
      md: { input: 'h-control-h w-8 text-control rounded-l2' },
      lg: { input: 'h-12 w-10 text-base rounded-l3' },
    },
    state: {
      default: {},
      error: {
        input: 'border-error-default focus-visible:ring-error-default',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

type PinInputVariants = VariantProps<typeof pinInputStyles>;

interface PinInputRootFieldProps
  extends Omit<PinInputRootProps, 'size'>,
    Pick<PinInputVariants, 'size' | 'state'> {
  label?: string;
  errorText?: string;
  onRootBlur?: () => void;
}

const PinInputRoot = ({
  className,
  size,
  state,
  label,
  errorText,
  onRootBlur,
  ...props
}: PinInputRootFieldProps) => {
  const {
    root,
    label: labelClass,
    control,
    input,
    errorText: errorTextClass,
  } = pinInputStyles({ size, state });

  const count = props.count ?? 4;
  const inputs = Array.from({ length: count }, (_, idx) => idx);

  return (
    <ArkPinInput.Root
      invalid={state === 'error'}
      className={root({ className })}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onRootBlur?.();
        }
      }}
      {...props}
    >
      {label ? <ArkPinInput.Label className={labelClass()}>{label}</ArkPinInput.Label> : null}
      <ArkPinInput.Control className={control()}>
        {inputs.map((idx) => (
          <ArkPinInput.Input key={idx} className={input()} index={idx} />
        ))}
      </ArkPinInput.Control>
      <ArkPinInput.HiddenInput />
      {errorText ? <p className={errorTextClass()}>{errorText}</p> : null}
    </ArkPinInput.Root>
  );
};

export { PinInputRoot };
