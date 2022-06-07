import { ReactNode } from 'react';
import likeIcon from '../../assets/images/like.svg';
import styles from './styles.module.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children: ReactNode;
};

export function Question({ content, author, children }: QuestionProps) {
  return (
    <li className={styles.question}>
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
