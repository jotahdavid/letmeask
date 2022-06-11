import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  handleClick?: () => void;
  outlined?: boolean;
  className?: string;
};

export function Button({
  type,
  children,
  className,
  handleClick,
  outlined,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={classNames(styles.button, className, {
        [styles.outlined]: outlined,
      })}
      type={type}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  handleClick: () => {},
  outlined: false,
  className: '',
};
