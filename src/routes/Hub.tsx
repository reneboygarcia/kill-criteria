import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { flowList, getFlow } from "../data/flows";
import type { FlowSession } from "../data/types";
import styles from "./Hub.module.css";

const STORAGE_KEY = "kill-criteria-session";

export function Hub() {
  const [savedSession, setSavedSession] = useState<FlowSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as FlowSession;
      if (parsed.flowId && parsed.currentNodeId && parsed.path.length > 0) {
        setSavedSession(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const savedFlow = savedSession ? getFlow(savedSession.flowId) : undefined;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tag}>Kill Criteria</div>
        <h1 className={styles.title}>Civil Engineer Decision Guide</h1>
        <p className={styles.subtitle}>
          A calm space to think through career decisions — one step at a time.
          For civil engineers in the Philippines · r/civilengineer_ph
        </p>
      </header>

      {savedSession && savedFlow ? (
        <aside className={styles.resume}>
          <p>You have an in-progress session:</p>
          <Link to={`/flow/${savedSession.flowId}`} className={styles.resumeLink}>
            Resume — {savedFlow.title}
          </Link>
        </aside>
      ) : null}

      <section className={styles.primer} aria-labelledby="primer-heading">
        <h2 id="primer-heading" className={styles.primerTitle}>
          What are kill criteria?
        </h2>
        <p>
          No rush — take your time. From Annie Duke&apos;s <em>Quit</em>: kill
          criteria are conditions you decide in advance, while you&apos;re
          thinking clearly, that tell you when to stop or change course.
          Writing them down now means future-you won&apos;t have to decide
          under pressure.
        </p>
      </section>

      <section className={styles.cards} aria-labelledby="flows-heading">
        <h2 id="flows-heading" className="sr-only">
          Choose your decision
        </h2>
        {flowList.map((flow) => (
          <Link
            key={flow.id}
            to={`/flow/${flow.id}`}
            className={styles.card}
            style={{ "--card-accent": flow.accent } as CSSProperties}
          >
            <span className={styles.cardTag}>File {flow.fileNumber} of 3</span>
            <span className={styles.cardTitle}>{flow.title}</span>
            <span className={styles.cardSubtitle}>{flow.subtitle}</span>
          </Link>
        ))}
      </section>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.stay}`} /> Stay for now
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.change}`} /> Take time to plan
        </span>
        <span className={`${styles.legendItem} ${styles.exitLegend}`}>
          <span className={`${styles.dot} ${styles.exit}`} /> Ready for a change
        </span>
      </div>

      <SiteFooter />
    </div>
  );
}
