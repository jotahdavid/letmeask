import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FirebaseQuestions =
  | Record<
      string,
      {
        author: {
          name: string;
          avatar: string;
        };
        content: string;
        isHighlighted: boolean;
        isAnswered: boolean;
        likes:
          | Record<
              string,
              {
                authorId: string;
              }
            >
          | undefined;
      }
    >
  | undefined;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | null;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [roomTitle, setRoomTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [roomExists, setRoomExists] = useState(false);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (room) => {
      if (!room.exists()) {
        setRoomExists(true);
        return;
      }

      const roomData = room.val();
      const firebaseQuestions = roomData.questions as FirebaseQuestions;

      const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(
        ([key, { likes, ...value }]) => {
          const questionLikes = Object.entries(likes ?? {});
          const [likeId] =
            questionLikes.find(([_, like]) => like.authorId === user?.id) ?? [];

          return {
            ...value,
            id: key,
            likeCount: questionLikes.length,
            likeId: likeId ?? null,
          };
        }
      );

      parsedQuestions.sort(
        (questionA, questionB) => questionB.likeCount - questionA.likeCount
      );

      setRoomTitle(roomData.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, user?.id]);

  return {
    questions,
    roomTitle,
    roomExists,
  };
}
