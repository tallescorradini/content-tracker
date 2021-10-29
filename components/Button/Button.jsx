import styles from "./Button.module.css";

export function Button({ variant, children, type = "button", ...rest }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}
