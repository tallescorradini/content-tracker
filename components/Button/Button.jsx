import styles from "./Button.module.css";

export function Button({
  variant,
  children,
  type = "button",
  fullWidth = false,
  ...rest
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      style={{ width: fullWidth ? "100%" : "auto" }}
      {...rest}
    >
      {children}
    </button>
  );
}
