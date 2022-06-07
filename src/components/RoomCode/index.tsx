import copyIcon from '../../assets/images/copy.svg';
import styles from './styles.module.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  async function copyRoomCodeToClipboard() {
    await navigator.clipboard.writeText(code);
  }

  return (
    <button className={styles.button} onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyIcon} alt="Ícone de copiar" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}
