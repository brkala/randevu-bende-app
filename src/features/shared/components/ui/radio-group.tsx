import {
  RadioGroup as ArkRadioGroup,
  type RadioGroupItemProps,
  type RadioGroupRootProps,
} from '@ark-ui/react/radio-group';
import { tv } from '@/features/style/utils/tv';

const radioStyles = tv({
  slots: {
    root: 'flex flex-col gap-2',
    item: 'flex items-center gap-2 cursor-pointer data-disabled:opacity-50 data-disabled:pointer-events-none',
    control:
      'flex items-center justify-center w-5 h-5 rounded-full bg-bg-default border border-border-default transition-colors duration-normal ease-enter data-[state=checked]:bg-accent-default data-[state=checked]:border-accent-default data-[state=checked]:shadow-[inset_0_0_0_3px_white]',
    text: 'text-sm text-fg-default',
  },
});

const RadioGroupRoot = ({ className, ...props }: RadioGroupRootProps) => {
  const { root } = radioStyles();
  return <ArkRadioGroup.Root className={root({ className })} {...props} />;
};

const RadioGroupItem = ({ className, children, ...props }: RadioGroupItemProps) => {
  const { item, control, text } = radioStyles();
  return (
    <ArkRadioGroup.Item className={item({ className })} {...props}>
      <ArkRadioGroup.ItemControl className={control()} />
      <ArkRadioGroup.ItemText className={text()}>{children}</ArkRadioGroup.ItemText>
      <ArkRadioGroup.ItemHiddenInput />
    </ArkRadioGroup.Item>
  );
};

export { RadioGroupItem, RadioGroupRoot };
