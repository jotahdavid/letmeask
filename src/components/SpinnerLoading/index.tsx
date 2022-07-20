import styles from './styles.module.scss';

function SpinnerLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}

export { SpinnerLoading };
