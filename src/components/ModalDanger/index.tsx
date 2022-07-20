import ReactDOM from 'react-dom';

import errorIcon from '@assets/images/error.svg';

import styles from './styles.module.scss';

export function ModalDanger() {
  return ReactDOM.createPortal(
    <div className={styles.container}>
      <article className={styles.modal}>
        <header className={styles.modal__header}>
          <img
            className={styles.modal__icon}
            src={errorIcon}
            alt="Um círculo com um X dentro"
          />
          <h3 className={styles.modal__title}>Encerrar sala</h3>
        </header>

        <p className={styles.modal__warn}>
          Tem certeza que você deseja encerrar esta sala?
        </p>

        <footer className={styles.modal__footer}>
          <button className={styles.button}>Cancelar</button>
          <button className={`${styles.button} ${styles.danger}`}>
            Sim, encerrar
          </button>
        </footer>
      </article>
    </div>,
    document.getElementById('modal-root')!
  );
}
