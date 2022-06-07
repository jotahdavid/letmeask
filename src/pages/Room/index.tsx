import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { push, ref } from 'firebase/database';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import letmeaskLogo from '../../assets/images/logo.svg';
import avatarIcon from '../../assets/images/avatar.svg';
import styles from './styles.module.scss';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;
  const { questions, roomTitle } = useRoom(roomId!);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') return;

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion.trim(),
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const questionsRef = await ref(database, `rooms/${roomId}/questions`);
    await push(questionsRef, question);

    setNewQuestion('');
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__content}>
          <Link to="/">
            <img
              className={styles.logo}
              src={letmeaskLogo}
              alt="Logo do Letmeask"
            />
          </Link>
          <RoomCode code={roomId!} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.main__header}>
          {roomTitle && <h1 className={styles.roomName}>Sala: {roomTitle}</h1>}
          {questions.length > 0 && (
            <span className={styles.questionCount}>
              {questions.length} pergunta{questions.length > 1 && 's'}
            </span>
          )}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            className={styles.form__questionInput}
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className={styles.form__footer}>
            {!user ? (
              <p className={styles.form__text}>
                Para enviar uma pergunta,&nbsp;
                <button className={styles.form__login}>faça seu login</button>.
              </p>
            ) : (
              <div className={styles.userInfo}>
                <img
                  referrerPolicy="no-referrer"
                  className={styles.userInfo__avatar}
                  src={user.avatar ?? avatarIcon}
                  alt={user.name}
                />
                <span className={styles.userInfo__name}>{user.name}</span>
              </div>
            )}
            <Button
              className={styles.form__submit}
              type="submit"
              disabled={!user}
            >
              Enviar pergunta
            </Button>
          </div>
        </form>

        <hr className={styles.divider} />

        <ul className={styles.questions}>
          {questions.map(({ id, content, author }) => (
            <Question key={id} content={content} author={author} />
          ))}
        </ul>
      </main>
    </>
  );
}
