import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { get, push, ref, update } from 'firebase/database';
import { database } from '@services/firebase';

import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/Button';
import { ToasterStylized } from '@components/ToasterStylized';

import illustrationImg from '@assets/images/illustration.svg';
import letmeaskLogo from '@assets/images/logo.svg';
import styles from './styles.module.scss';

function NewRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    if (!user) navigate('/');
  }, []);

  async function handleNewRoom(event: FormEvent) {
    event.preventDefault();

    if (!user || newRoom.trim() === '') return;

    if (newRoom.length > 115) {
      toast.error('Nome de sala muito longo');
      return;
    }

    const userRoomsRef = await ref(database, `user/${user?.id}/rooms`);
    const userRooms = await (await get(userRoomsRef)).val();

    if (Object.keys(userRooms).length >= 5) {
      toast.dismiss();
      toast.error('Você só pode criar no máximo 5 salas!');
      return;
    }

    const roomRef = await ref(database, 'rooms');
    const roomId = await push(roomRef, {
      title: newRoom.trim(),
      authorId: user?.id,
    });

    const userRoomRef = await ref(
      database,
      `user/${user?.id}/rooms/${roomId.key}`
    );
    await update(userRoomRef, {
      title: newRoom.trim(),
    });

    navigate(`/admin/rooms/${roomId.key?.slice(1)}`);
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
            <h2 className={styles.formTitle}>Criar uma nova sala</h2>
            <form className={styles.form} onSubmit={handleNewRoom}>
              <input
                className={styles.roomCode}
                type="text"
                placeholder="Nome da sala"
                onChange={(event) => setNewRoom(event.target.value)}
                value={newRoom}
              />
              <Button
                className={styles.buttonSubmit}
                type="submit"
                disabled={newRoom.length === 0}
              >
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

export { NewRoom };
