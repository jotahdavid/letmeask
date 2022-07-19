import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';

export function ToasterStylized() {
  return ReactDOM.createPortal(
    <Toaster
      toastOptions={{
        style: {
          fontWeight: 500,
          fontFamily: '"Roboto", sans-serif',
          backgroundColor: '#835AFD',
          color: '#fff',
        },
      }}
    />,
    document.getElementById('modal-root')!
  );
}
