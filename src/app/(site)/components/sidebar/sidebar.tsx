import Link from "next/link";

import { draftMode } from "next/headers";

import styles from "./sidebar.module.scss";
import { classnames } from "@/utils/classnames";
import { DisableDraftMode } from "@/components/DisableDraftMode";

export async function Sidebar() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <svg width="100%" height="100%" aria-hidden="true">
          <defs>
            <filter id="blur_filter" x="0" y="0">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
          </defs>
          <clipPath id="clip">
            <text
              y="1.1em"
              className={classnames(["heading1", styles.svgtext])}
            >
              Surface Detail
            </text>
          </clipPath>
          <g clipPath="url(#clip)">
            <rect cx="0" cy="0" width="110%" height="100%" fill="26247b" />
            <g filter="url(#blur_filter)" id="logobg">
              <rect
                className={styles.bg}
                cx="0"
                cy="0"
                width="100%"
                height="100%"
                fill="#26247b"
              />
              <circle
                className={classnames([styles.circle, styles.circle1])}
                cx="50%"
                cy="50%"
                r="80px"
              />
              <circle
                className={classnames([styles.circle, styles.circle2])}
                cx="50%"
                cy="50%"
                r="70px"
              />
              <circle
                className={classnames([styles.circle, styles.circle3])}
                cx="50%"
                cy="50%"
                r="60px"
              />
            </g>
          </g>
        </svg>
        <h1 className={"logo"}>Surface Detail</h1>
      </div>
      <p>
        A small online home for my thoughts, projects, ideas and experiments. I
        don&apos;t expect anyone will read this, but it&apos;s not for you
        anyway.
      </p>

      <nav className={"nav"}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <a target="_blank" href="https://github.com/liamegan">
              GitHub
            </a>
          </li>
          <li>
            <a target="_blank" href="https://codepen.io/shubniggurath">
              CodePen
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://bsky.app/profile/liamegan.bsky.social"
            >
              Bluesky
            </a>
          </li>
          {(await draftMode()).isEnabled && (
            <li>
              <DisableDraftMode />
            </li>
          )}
        </ul>
      </nav>
      <p>All work, writing and random musings copyright Liam Egan.</p>
    </header>
  );
}
