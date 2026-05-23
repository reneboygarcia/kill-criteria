import { Link } from "react-router-dom";
import { BUILDER_ATTRIBUTION, FIELDNOTES_SITE_URL } from "../config/site";
import { FieldnotesMark } from "./FieldnotesMark";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  compact?: boolean;
};

export function SiteFooter({ compact = false }: SiteFooterProps) {
  return (
    <footer className={`${styles.footer} ${compact ? styles.compact : ""}`}>
      {!compact ? (
        <p className={styles.notice}>
          For reflection only — not professional advice.{" "}
          <Link to="/disclosure">Read full disclosure</Link>
        </p>
      ) : null}

      <p className={styles.credits}>
        Based on Annie Duke&apos;s kill criteria framework · r/civilengineer_ph
        {compact ? (
          <>
            {" "}
            · <Link to="/disclosure">Disclosure</Link>
          </>
        ) : null}
      </p>

      <p className={styles.builderAttribution}>
        {!compact ? (
          <>
            {BUILDER_ATTRIBUTION.tagline}
            <span className={styles.builderSeparator} aria-hidden="true">
              {" "}
              ·{" "}
            </span>
          </>
        ) : null}
        <a
          href={FIELDNOTES_SITE_URL}
          className={styles.builderLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FieldnotesMark size="sm" />
          {BUILDER_ATTRIBUTION.siteLabel}
        </a>
      </p>
    </footer>
  );
}
