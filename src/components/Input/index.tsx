import { forwardRef } from 'react';
import style from './style.module.css';

type Props = React.ComponentProps<'input'>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ ...rest }, ref) => {
    return (
      <input
        type="text"
        className={style.input}
        ref={ref}
        {...rest}
      />
    );
  }
);