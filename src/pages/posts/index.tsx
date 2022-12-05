import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../../styles/pages/posts.module.scss";
import { getPrismicClient } from "./../../services/prismic";
import { RichText } from "prismic-dom";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface PostsProps {
  posts: Post[];
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

export default function Posts({ posts }: PostsProps) {
  const session = useSession();
  console.log("🚀 / Posts / session", session);

  return (
    <>
      <Head>
        <title>Posts | Ig News</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => {
            if (session?.data?.activeSubscription) {
              return (
                <Link key={post.slug} href={`/posts/${post.slug}`}>
                  <>
                    <time>{post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                  </>
                </Link>
              );
            } else {
              return (
                <Link key={post.slug} href={`/posts/preview/${post.slug}`}>
                  <>
                    <time>{post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                  </>
                </Link>
              );
            }
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getByType("posts", {
    pageSize: 100,
  });

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph" || "heading1")?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
