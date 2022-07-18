import toast from 'react-hot-toast';

import { ToasterStylized } from '@components/ToasterStylized';

import copyIcon from '@assets/images/copy.svg';
import styles from './styles.module.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  async function copyRoomCodeToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      const $el = document.createElement('textarea');
      $el.value = code;
      document.body.appendChild($el);
      $el.select();
      document.execCommand('copy');
      document.body.removeChild($el);
    }
    toast.success('Código copiado!', {
      icon: '📋',
    });
  }

  return (
    <>
      <ToasterStylized />

      <button className={styles.button} onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyIcon} alt="Ícone de copiar" />
        </div>
        <span>Código da sala</span>
      </button>
    </>
  );
}
