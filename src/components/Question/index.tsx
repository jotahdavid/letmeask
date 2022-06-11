import { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted?: boolean;
  isAnswered?: boolean;
  children?: ReactNode;
  className?: string;
};

export function Question({
  content,
  author,
  isHighlighted,
  isAnswered,
  children,
  className,
}: QuestionProps) {
  return (
    <li
      className={classNames(styles.question, className, {
        [styles.isHighlighted]: isHighlighted && !isAnswered,
        [styles.isAnswered]: isAnswered,
      })}
    >
      <section>
        <p className={styles.question__content}>{content}</p>
      </section>

      <footer className={styles.question__footer}>
        <div className={styles.userInfo}>
          <img
            className={styles.userInfo__avatar}
            referrerPolicy="no-referrer"
            src={author.avatar}
            alt={author.name}
          />
          <span className={styles.userInfo__name}>{author.name}</span>
        </div>
        <div className={styles.question__cta}>{children}</div>
      </footer>
    </li>
  );
}

Question.defaultProps = {
  isHighlighted: false,
  isAnswered: false,
  children: '',
  className: '',
};
