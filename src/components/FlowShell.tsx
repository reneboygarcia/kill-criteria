import type { CSSProperties, ReactNode } from "react";
import styles from "./FlowShell.module.css";

type FlowShellProps = {
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  step: number;
  maxSteps: number;
  children: ReactNode;
  pathTrail?: ReactNode;
  focusMode?: boolean;
};

export function FlowShell({
  tag,
  title,
  subtitle,
  accent,
  step,
  maxSteps,
  children,
  pathTrail,
  focusMode = false,
}: FlowShellProps) {
  const progress = Math.min(100, Math.round((step / maxSteps) * 100));

  return (
    <div
      className={`${styles.shell} ${focusMode ? styles.focusMode : ""}`}
      style={{ "--flow-accent": accent } as CSSProperties}
    >
      <header className={styles.header}>
        {!focusMode ? (
          <>
            <div className={styles.tag}>{tag}</div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </>
        ) : (
          <>
            <p className={styles.focusLabel}>One question at a time</p>
            <h1 className={styles.focusTitle}>{title}</h1>
          </>
        )}
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={maxSteps}
          aria-label={`Step ${step} of ${maxSteps}`}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          Step {step} of {maxSteps}
        </span>
      </header>

      {!focusMode ? pathTrail : null}

      <main className={styles.main}>{children}</main>
    </div>
  );
}
