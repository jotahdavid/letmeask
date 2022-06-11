import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get, push, ref, remove } from 'firebase/database';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { LikeIcon } from '../../components/Icons';

import letmeaskLogo from '../../assets/images/logo.svg';
import avatarIcon from '../../assets/images/avatar.svg';
import emptyQuestionIllustration from '../../assets/images/empty-questions.svg';
import styles from './styles.module.scss';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function Room() {
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id;
  const { questions, roomTitle, isRoomDeleted } = useRoom(roomId!);

  useEffect(() => {
    if (loadingUser || !user) return;

    const verifyIfTheUserIsAdmin = async () => {
      const room = await get(ref(database, `rooms/${roomId}`));

      if (room.val().authorId !== user.id) return;

      navigate(`/admin/rooms/${roomId}`);
    };
    verifyIfTheUserIsAdmin();
  }, [loadingUser]);

  useEffect(() => {
    if (isRoomDeleted) {
      navigate('/');
    }
  }, [isRoomDeleted]);

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
      authorId: user?.id,
    });
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
                >
                  {!isAnswered && (
                    <button
                      className={`${styles.like} ${likeId ? styles.liked : ''}`}
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
