import illustrationImg from '../../assets/images/illustration.svg';
import letmeaskLogo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google-icon.svg';
import logInIcon from '../../assets/images/log-in.svg';

import styles from './styles.module.scss';

export function Home() {
  return (
    <div className={styles.container}>
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

      <main className={styles.authentication}>
        <img
          className={styles.logo}
          src={letmeaskLogo}
          alt="Logo do Letmeask"
        />
        <button className={styles.googleLogin} type="button">
          <img src={googleIcon} alt="Logo do Google" />
          Crie sua sala com o Google
        </button>
        <div className={styles.separator}>ou entre em uma sala</div>
        <form className={styles.form}>
          <input
            className={styles.roomCode}
            type="text"
            placeholder="Digite o código da sala"
          />
          <button className={styles.buttonSubmit} type="submit">
            <img src={logInIcon} alt="Icone de login" />
            Entrar na sala
          </button>
        </form>
      </main>
    </div>
  );
}
