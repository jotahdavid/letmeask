import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';

import illustrationImg from '../../assets/images/illustration.svg';
import letmeaskLogo from '../../assets/images/logo.svg';

import styles from './styles.module.scss';

export function NewRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate('/');
  }, []);

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
            <h2 className={styles.formTitle}>Criar uma nova sala</h2>
            <form
              onSubmit={(event) => event.preventDefault()}
              className={styles.form}
            >
              <input
                className={styles.roomCode}
                type="text"
                placeholder="Nome da sala"
              />
              <Button className={styles.buttonSubmit} type="submit">
                Criar sala
              </Button>
              <p>
                Quer entrar em uma sala existente?&nbsp;
                <Link to="/">Clique aqui</Link>
              </p>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
