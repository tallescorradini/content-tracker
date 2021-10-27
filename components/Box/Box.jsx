import styles from "./Box.module.css";

export function Box({ children, ...rest }) {
  return (
    <div className={styles.box} {...rest}>
      {children}
    </div>
  );
}
