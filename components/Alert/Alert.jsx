import styles from "./Alert.module.css";

export function Alert({ message, onDismiss, style }) {
  return (
    <section role="alert" className={styles.alert} style={style}>
      <span>{message}</span>
      <button onClick={onDismiss}>
        <span className={styles.iconClose}></span>
      </button>
    </section>
  );
}
