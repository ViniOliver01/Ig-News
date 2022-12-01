import SignInButton from "../SignInButton/SignInButton";
import styles from "./Header.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import ActiveLink from "./../ActiveLink/ActiveLink";

export default function Header() {
  const { pathname } = useRouter();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a href="/">
          <img src="/images/logo.svg" alt="Ig.News" />
        </a>

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
