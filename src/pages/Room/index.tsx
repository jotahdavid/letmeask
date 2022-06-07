import { useParams } from 'react-router-dom';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import letmeaskLogo from '../../assets/images/logo.svg';
import styles from './styles.module.scss';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__content}>
          <img className={styles.logo} src={letmeaskLogo} alt="Letmeask logo" />
          <RoomCode code={roomId!} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.main__header}>
          <h1 className={styles.roomName}>Sala: React Q&A</h1>
          <span className={styles.questionCount}>4 pergunta(s)</span>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <textarea
            className={styles.form__questionInput}
            placeholder="O que você quer perguntar?"
          />
          <div className={styles.form__footer}>
            <p className={styles.form__text}>
              Para enviar uma pergunta,&nbsp;
              <button className={styles.form__login}>faça seu login</button>.
            </p>
            <Button className={styles.form__submit} type="submit">
              Enviar pergunta
            </Button>
          </div>
        </form>

        <ul className={styles.questions}>Perguntas</ul>
      </main>
    </>
  );
}
