import styles from "./Button.module.css";

export function Button({ variant, children, ...rest }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...rest}>
      {children}
    </button>
  );
}
