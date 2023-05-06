import styles from "./ErrorPage.module.css";

interface ErrorPageProps {
  statusCode: number;
  message?: string;
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div className={`container-fluid ${styles.container}`}>
      <h1 className={`display-1 ${styles.errorCode}`}>
        Error {props.statusCode}
      </h1>
      <p className={`h4 ${styles.errorMessage}`}>
        {props.message || "An error occured."}
      </p>
    </div>
  );
}
