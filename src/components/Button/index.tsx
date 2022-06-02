import { ButtonHTMLAttributes, Children } from 'react';

import styles from './styles.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ type, children, className }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className ?? ''}`}
      type={type !== undefined ? type : 'button'}
    >
      {children}
    </button>
  );
}
