import type { ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./StepTransition.module.css";

type StepTransitionProps = {
  stepKey: string;
  children: ReactNode;
  className?: string;
};

export function StepTransition({
  stepKey,
  children,
  className = "",
}: StepTransitionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      key={stepKey}
      className={`${styles.wrap} ${reducedMotion ? "" : styles.enter} ${className}`}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
