import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import {
  DISCLOSURE_LAST_UPDATED,
  DISCLOSURE_SECTIONS,
  DISCLOSURE_SUMMARY,
} from "../data/disclosure";
import styles from "./Disclosure.module.css";

export function Disclosure() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Back to hub
        </Link>
        <div className={styles.tag}>Disclosure</div>
        <h1 className={styles.title}>Terms of use &amp; disclaimer</h1>
        <p className={styles.summary}>{DISCLOSURE_SUMMARY}</p>
        <p className={styles.updated}>Last updated: {DISCLOSURE_LAST_UPDATED}</p>
      </header>

      <article className={styles.content}>
        {DISCLOSURE_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`${section.id}-heading`}>
            <h2 id={`${section.id}-heading`} className={styles.sectionTitle}>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>

      <SiteFooter />
    </div>
  );
}
