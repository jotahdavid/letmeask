import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';

import illustrationImg from '../../assets/images/illustration.svg';
import letmeaskLogo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google-icon.svg';
import logInIcon from '../../assets/images/log-in.svg';
import styles from './styles.module.scss';

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    try {
      if (!user) {
        await signInWithGoogle();
      }

      navigate('/rooms/new');
    } catch (err) {
      console.error('Falha na autenticação!');
    }
  }

  return (
    <div className={styles.container}>
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
            <form
              onSubmit={(event) => event.preventDefault()}
              className={styles.form}
            >
              <input
                className={styles.roomCode}
                type="text"
                placeholder="Digite o código da sala"
              />
              <Button className={styles.buttonSubmit} type="submit">
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
