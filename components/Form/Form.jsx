import styles from "./Form.module.css";

export function Form({ children, ...rest }) {
  return (
    <form className={styles.form} {...rest}>
      {children}
    </form>
  );
}
