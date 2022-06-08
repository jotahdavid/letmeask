import { Link, useParams } from 'react-router-dom';
import { ref, remove } from 'firebase/database';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import letmeaskLogo from '../../assets/images/logo.svg';
import styles from './styles.module.scss';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';
import { AnswerIcon, CheckIcon, DeleteIcon } from '../../components/Icons';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();

  const roomId = params.id;
  const { questions, roomTitle } = useRoom(roomId!);

  async function handleDeleteQuestion(questionId: string) {
    const confirmResult = window.confirm(
      'Tem certeza que você deseja excluir esta pergunta?'
    );

    if (!confirmResult) return;

    await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
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

          <div className={styles.header__cta}>
            <RoomCode code={roomId!} />
            <Button outlined>Encerrar sala</Button>
          </div>
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

        <hr className={styles.divider} />

        <ul className={styles.questions}>
          {questions.map(({ id, content, author }) => (
            <Question key={id} content={content} author={author}>
              <button className={styles.question__cta}>
                <CheckIcon />
              </button>
              <button className={styles.question__cta}>
                <AnswerIcon />
              </button>
              <button
                className={`${styles.question__cta} ${styles.question__delete}`}
                onClick={() => handleDeleteQuestion(id)}
              >
                <DeleteIcon />
              </button>
            </Question>
          ))}
        </ul>
      </main>
    </>
  );
}
