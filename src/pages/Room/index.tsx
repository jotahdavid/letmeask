import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { get, push, ref, remove } from 'firebase/database';
import { database } from '@services/firebase';

import { useAuth } from '@hooks/useAuth';
import { useRoom } from '@hooks/useRoom';
import { Button } from '@components/Button';
import { RoomCode } from '@components/RoomCode';
import { Question } from '@components/Question';
import { LikeIcon } from '@components/Icons';
import { SpinnerLoading } from '@components/SpinnerLoading';

import letmeaskLogo from '@assets/images/logo.svg';
import avatarIcon from '@assets/images/avatar.svg';
import emptyQuestionIllustration from '@assets/images/empty-questions.svg';
import styles from './styles.module.scss';

type RoomParams = {
  id: string;
};

export function Room() {
  const { user, loadingUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = `-${params.id}`;
  const { questions, roomTitle, roomExists, loadingRoom } = useRoom(roomId!);

  useEffect(() => {
    if (loadingUser || !user) return;

    const verifyIfTheUserIsAdmin = async () => {
      const room = await get(ref(database, `rooms/${roomId}`));

      if (!room.exists()) return;

      if (room.val().authorId !== user.id) return;

      navigate(`/admin/rooms/${roomId.slice(1)}`);
    };
    verifyIfTheUserIsAdmin();
  }, [loadingUser, user]);

  useEffect(() => {
    if (!roomExists) {
      navigate('/');
    }
  }, [roomExists]);

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

  async function handleLikeQuestion(questionId: string) {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        toast.error('Falha na autenticação!');
      }
      return;
    }

    const questionLiked = questions.find(
      (question) => question.likeId && question.id === questionId
    );

    if (questionLiked) {
      const like = await ref(
        database,
        `rooms/${roomId}/questions/${questionId}/likes/${questionLiked.likeId}`
      );
      await remove(like);
      return;
    }

    const newLike = await ref(
      database,
      `rooms/${roomId}/questions/${questionId}/likes`
    );
    await push(newLike, {
      authorId: user.id,
    });
  }

  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error('Falha na autenticação!');
    }
  }

  if (loadingRoom) {
    return <SpinnerLoading />;
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
          <RoomCode code={roomId.slice(1)} />
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
                <button
                  className={styles.form__login}
                  type="button"
                  onClick={handleSignIn}
                >
                  faça seu login
                </button>
                .
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
          {questions.length > 0 ? (
            questions.map(
              ({
                id,
                content,
                author,
                isHighlighted,
                isAnswered,
                likeCount,
                likeId,
              }) => (
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
                    <button
                      className={classNames(styles.like, {
                        [styles.liked]: likeId,
                      })}
                      onClick={() => handleLikeQuestion(id)}
                    >
                      {likeCount > 0 && <span>{likeCount}</span>}
                      <LikeIcon />
                    </button>
                  )}
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
                {!user
                  ? 'Faça o seu login e seja a primeira pessoa a fazer uma pergunta!'
                  : 'Seja a primeira pessoa a fazer uma pergunta!'}
              </p>
            </div>
          )}
        </ul>
      </main>
    </>
  );
}
