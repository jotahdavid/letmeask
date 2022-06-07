import { ButtonHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  handleClick?: () => void;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
}

export function Button({
  type,
  children,
  className,
  handleClick,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  handleClick: () => {},
  type: 'button',
  className: '',
};
