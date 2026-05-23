import { useCallback, useState, type MouseEvent } from "react";
import type { Choice, ChoiceTone } from "../data/types";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./ChoiceButtons.module.css";

type ChoiceButtonsProps = {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
  sticky?: boolean;
  animate?: boolean;
};

type Ripple = {
  key: number;
  x: number;
  y: number;
  size: number;
};

const toneClass: Record<ChoiceTone, string> = {
  yes: styles.yes,
  no: styles.no,
  neutral: styles.neutral,
};

const staggerClass = [styles.stagger1, styles.stagger2, styles.stagger3, styles.stagger4];

const RIPPLE_DURATION_MS = 500;

function createRipple(event: MouseEvent<HTMLButtonElement>): Ripple {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const isPointerEvent = event.nativeEvent instanceof MouseEvent;

  const x = isPointerEvent
    ? event.clientX - rect.left - size / 2
    : rect.width / 2 - size / 2;
  const y = isPointerEvent
    ? event.clientY - rect.top - size / 2
    : rect.height / 2 - size / 2;

  return { key: Date.now(), x, y, size };
}

type ChoiceButtonProps = {
  choice: Choice;
  index: number;
  animate: boolean;
  reducedMotion: boolean;
  onChoose: (choice: Choice) => void;
};

function ChoiceButton({
  choice,
  index,
  animate,
  reducedMotion,
  onChoose,
}: ChoiceButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!reducedMotion) {
        const ripple = createRipple(event);
        setRipples((current) => [...current, ripple]);
        window.setTimeout(() => {
          setRipples((current) => current.filter((item) => item.key !== ripple.key));
        }, RIPPLE_DURATION_MS);
      }

      onChoose(choice);
    },
    [choice, onChoose, reducedMotion],
  );

  return (
    <button
      type="button"
      className={[
        styles.button,
        toneClass[choice.tone],
        animate && !reducedMotion ? styles.enter : "",
        animate && !reducedMotion ? (staggerClass[index] ?? "") : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
    >
      <span className={styles.label}>{choice.label}</span>
      {!reducedMotion && ripples.length > 0 ? (
        <span className={styles.rippleLayer} aria-hidden="true">
          {ripples.map((ripple) => (
            <span
              key={ripple.key}
              className={styles.ripple}
              style={{
                width: ripple.size,
                height: ripple.size,
                left: ripple.x,
                top: ripple.y,
              }}
            />
          ))}
        </span>
      ) : null}
    </button>
  );
}

export function ChoiceButtons({
  choices,
  onChoose,
  sticky = true,
  animate = true,
}: ChoiceButtonsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`${styles.wrapper} ${sticky ? styles.sticky : ""}`}
      role="group"
      aria-label="Answer choices"
    >
      {choices.map((choice, index) => (
        <ChoiceButton
          key={choice.id}
          choice={choice}
          index={index}
          animate={animate}
          reducedMotion={reducedMotion}
          onChoose={onChoose}
        />
      ))}
    </div>
  );
}
