import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { get, ref, remove, update } from 'firebase/database';
import { database } from '@services/firebase';

import { Button } from '@components/Button';
import { RoomCode } from '@components/RoomCode';
import { Question } from '@components/Question';
import { AnswerIcon, CheckIcon, DeleteIcon } from '@components/Icons';
import { SpinnerLoading } from '@components/SpinnerLoading';
import { ModalDanger } from '@components/ModalDanger';

import { useAuth } from '@hooks/useAuth';
import { useRoom } from '@hooks/useRoom';

import letmeaskLogo from '@assets/images/logo.svg';
import emptyQuestionIllustration from '@assets/images/empty-questions.svg';
import styles from './styles.module.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const [loading, setLoading] = useState(true);

  const roomId = `-${params.id}`;
  const { questions, roomTitle, roomExists, loadingRoom } = useRoom(roomId!);

  useEffect(() => {
    if (loadingUser) return;

    if (!user) {
      navigate(`/rooms/${roomId.slice(1)}`);
      return;
    }

    const verifyIfTheUserIsAdmin = async () => {
      const room = await get(ref(database, `rooms/${roomId}`));

      if (!room.exists()) return;

      if (room.val().authorId !== user.id) {
        navigate(`/rooms/${roomId.slice(1)}`);
        return;
      }

      setLoading(false);
    };
    verifyIfTheUserIsAdmin();
  }, [loadingUser]);

  useEffect(() => {
    if (!roomExists) {
      navigate('/');
    }
  }, [roomExists]);

  async function handleDeleteQuestion(questionId: string) {
    // TODO: change confirm window to a Modal
    const confirmResult = window.confirm(
      'Tem certeza que você deseja excluir esta pergunta?'
    );

    if (!confirmResult) return;

    await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = await ref(
      database,
      `rooms/${roomId}/questions/${questionId}`
    );

    const question = (await get(questionRef)).val();

    await update(questionRef, {
      isHighlighted: !question.isHighlighted,
    });
  }

  async function handleDeleteRoom() {
    // TODO: change confirm window to a Modal
    const confirmResult = window.confirm(
      'Tem certeza que você deseja encerrar a sala?'
    );

    if (!confirmResult) return;

    await remove(ref(database, `rooms/${roomId}`));
    navigate('/');
  }

  if (loading || loadingRoom) {
    return <SpinnerLoading />;
  }

  return (
    <>
      <ModalDanger />
      <header className={styles.header}>
        <div className={styles.header__content}>
          <Link to="/" className={styles.logoContainer}>
            <img
              className={styles.logo}
              src={letmeaskLogo}
              alt="Logo do Letmeask"
            />
          </Link>

          <div className={styles.header__cta}>
            <RoomCode code={roomId.slice(1)} />
            <Button outlined handleClick={handleDeleteRoom}>
              Encerrar sala
            </Button>
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

        <ul className={styles.questions}>
          {questions.length > 0 ? (
            questions.map(
              ({ id, content, author, isHighlighted, isAnswered }) => (
                <Question
                  key={id}
                  content={content}
                  author={author}
                  isHighlighted={isHighlighted}
                  isAnswered={isAnswered}
                  className={classNames({
                    [styles.question__answered]: isAnswered,
                    [styles.question__highlighted]:
                      isHighlighted && !isAnswered,
                  })}
                >
                  {!isAnswered && (
                    <>
                      <button
                        className={styles.question__cta}
                        onClick={() => handleCheckQuestionAsAnswered(id)}
                      >
                        <CheckIcon />
                      </button>
                      <button
                        className={classNames(styles.question__cta, {
                          [styles.active]: isHighlighted && !isAnswered,
                        })}
                        onClick={() => handleHighlightQuestion(id)}
                      >
                        <AnswerIcon />
                      </button>
                    </>
                  )}

                  <button
                    className={`${styles.question__cta} ${styles.question__delete}`}
                    onClick={() => handleDeleteQuestion(id)}
                  >
                    <DeleteIcon />
                  </button>
                </Question>
              )
            )
          ) : (
            <div className={styles.questions__empty}>
              <img
                src={emptyQuestionIllustration}
                alt="Ilustração com balões de falas"
              />
              <h2>Nenhuma pergunta por aqui...</h2>
              <p>
                Envie o código desta sala para seus amigos e comece a responder
                perguntas!
              </p>
            </div>
          )}
        </ul>
      </main>
    </>
  );
}
