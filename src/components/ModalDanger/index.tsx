import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import errorIcon from '@assets/images/error.svg';
import trashIcon from '@assets/images/delete-red.svg';

import styles from './styles.module.scss';

type ModalDangerProps = {
  closeModal: () => void;
  handleResult: (result: boolean) => void;
  icon?: 'danger' | 'trash';
  title?: string;
  warn?: string;
  buttonPlaceholder?: string;
};

function ModalDanger({
  closeModal,
  handleResult,
  icon,
  title,
  warn,
  buttonPlaceholder,
}: ModalDangerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    function handleOutsideModalClick(event: MouseEvent) {
      if (event.target === containerRef.current) {
        closeModal();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    containerRef.current?.addEventListener('click', handleOutsideModalClick);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return ReactDOM.createPortal(
    <div className={styles.container} ref={containerRef}>
      <article className={styles.modal}>
        <header className={styles.modal__header}>
          <img
            className={styles.modal__icon}
            src={icon === 'danger' ? errorIcon : trashIcon}
            alt="Um círculo com um X dentro"
          />
          <h3 className={styles.modal__title}>{title}</h3>
        </header>

        <p className={styles.modal__warn}>{warn}</p>

        <footer className={styles.modal__footer}>
          <button
            className={styles.button}
            onClick={() => {
              closeModal();
              handleResult(false);
            }}
          >
            Cancelar
          </button>
          <button
            className={`${styles.button} ${styles.danger}`}
            onClick={() => {
              closeModal();
              handleResult(true);
            }}
          >
            {buttonPlaceholder}
          </button>
        </footer>
      </article>
    </div>,
    document.getElementById('modal-root')!
  );
}

ModalDanger.defaultProps = {
  icon: 'danger',
  title: 'Danger',
  warn: 'Tem certeza que você deseja fazer isso?',
  buttonPlaceholder: 'Sim',
};

export { ModalDanger };
