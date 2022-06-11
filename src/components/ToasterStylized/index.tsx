import { Toaster } from 'react-hot-toast';

export function ToasterStylized() {
  return (
    <Toaster
      toastOptions={{
        style: {
          fontWeight: 500,
          fontFamily: '"Roboto", sans-serif',
          backgroundColor: '#835AFD',
          color: '#fff',
        },
      }}
    />
  );
}
