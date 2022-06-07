import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
};

export function useRoom(roomId: string) {
  const [roomTitle, setRoomTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (room) => {
      const roomData = room.val();
      const firebaseQuestions = roomData.questions as FirebaseQuestions;

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => ({
          ...value,
          id: key,
        })
      );

      setRoomTitle(roomData.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  return {
    questions,
    roomTitle,
  };
}
