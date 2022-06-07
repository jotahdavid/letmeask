import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { push, ref, onValue } from 'firebase/database';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import letmeaskLogo from '../../assets/images/logo.svg';
import avatarIcon from '../../assets/images/avatar.svg';
import styles from './styles.module.scss';

type RoomParams = {
  id: string;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const roomId = params.id;

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (room) => {
      const roomData = room.val();
      const firebaseQuestions = roomData.questions as FirebaseQuestions;

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => ({
          ...value,
          id: key,
        })
      );

      setRoomTitle(roomData.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

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
              alt="Letmeask logo"
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

        <ul className={styles.questions}>
          {questions.map((item) => (
            <p key={item.id}>{item.content}</p>
          ))}
        </ul>
      </main>
    </>
  );
}
