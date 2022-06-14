import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { get, ref } from 'firebase/database';
import { database } from '@services/firebase';

import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/Button';
import { ToasterStylized } from '@components/ToasterStylized';

import illustrationImg from '@assets/images/illustration.svg';
import letmeaskLogo from '@assets/images/logo.svg';
import googleIcon from '@assets/images/google-icon.svg';
import logInIcon from '@assets/images/log-in.svg';
import styles from './styles.module.scss';

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const [roomCode, setRoomCode] = useState('');
  const [roomExists, setRoomExists] = useState(true);

  async function handleCreateRoom() {
    try {
      if (!user) {
        await signInWithGoogle();
      }

      navigate('/rooms/new');
    } catch (err) {
      toast.error('Falha na autenticação!');
    }
  }

  async function handleEnterRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') return;

    const room = await get(ref(database, `rooms/-${roomCode}`));

    if (!room.exists()) {
      setRoomExists(false);
      return;
    }

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div className={styles.container}>
      <ToasterStylized />

      <div className={styles.background}>
        <aside className={styles.aside}>
          <section className={styles.asideWrapper}>
            <img
              className={styles.illustration}
              src={illustrationImg}
              alt="Ilustração simbolizando perguntas e respostas"
            />
            <strong className={styles.title}>
              Toda pergunta tem uma resposta.
            </strong>
            <p className={styles.subtitle}>
              Aprenda e compartilhe conhecimento com outras pessoas
            </p>
          </section>
        </aside>
      </div>

      <div className={styles.background}>
        <main className={styles.auth}>
          <section className={styles.authWrapper}>
            <img
              className={styles.logo}
              src={letmeaskLogo}
              alt="Logo do Letmeask"
            />
            <Button
              handleClick={handleCreateRoom}
              className={styles.googleLogin}
            >
              <img src={googleIcon} alt="Logo do Google" />
              Crie sua sala com o Google
            </Button>
            <div className={styles.separator}>ou entre em uma sala</div>
            <form className={styles.form} onSubmit={handleEnterRoom}>
              {!roomExists && (
                <p className={styles.messageError}>Sala não encontrada!</p>
              )}
              <input
                className={classNames(styles.roomCode, {
                  [styles.inputError]: !roomExists,
                })}
                type="text"
                placeholder="Digite o código da sala"
                onChange={(event) => {
                  setRoomCode(event.target.value);
                  setRoomExists(true);
                }}
              />
              <Button
                className={styles.buttonSubmit}
                type="submit"
                disabled={roomCode.length === 0}
              >
                <img src={logInIcon} alt="Icone de login" />
                Entrar na sala
              </Button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
