import { useHealth } from "@/hooks/use-health";
import styles from "./Home.module.css";

export default function Home() {
  const { status, data } = useHealth();

  const isHealthy = status === "success" && data?.status === "ok";
  const isLoading = status === "pending";

  let dotClass = styles.dotGrey;
  let statusText = "Checking backend status...";

  if (!isLoading) {
    if (isHealthy) {
      dotClass = styles.dotGreen;
      statusText = "Backend is connected";
    } else {
      dotClass = styles.dotRed;
      statusText = "Backend is unreachable";
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>FileDrive</h1>
      <div className={styles.statusContainer}>
        <span className={`${styles.dot} ${dotClass}`} />
        <span className={styles.statusText}>{statusText}</span>
      </div>
    </main>
  );
}
