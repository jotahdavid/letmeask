import styles from './styles.module.scss';

export function SpinnerLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}
