import { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';

type ToasterStylizedProps = {
  styles?: CSSProperties;
};

function ToasterStylized({ styles }: ToasterStylizedProps) {
  return ReactDOM.createPortal(
    <Toaster
      toastOptions={{
        style: {
          fontWeight: 500,
          fontFamily: '"Roboto", sans-serif',
          backgroundColor: '#fff',
          color: '#29292E',
          textAlign: 'center',
          boxShadow:
            '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.1)',
          ...styles,
        },
      }}
    />,
    document.getElementById('modal-root')!
  );
}

ToasterStylized.defaultProps = {
  styles: {},
};

export { ToasterStylized };
