import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import styles from "../../../styles/pages/slug.module.scss";
import { getPrismicClient } from "../../../services/prismic";
import { RichText } from "prismic-dom";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../../services/api";
import { getStripeJs } from "../../../services/stripe-js";

interface PostPreviewProps {
  post: Post;
}

interface Post {
  slug: string;
  title: string;
  updatedAt: string;
  content: Content[];
}

interface Content {
  // paragraph and heading
  type: string;
  text: string;
  spans: [];
  // Images
  url?: string;
  alt?: string;
  dimensions?: {
    height: number;
    width: number;
  };
  // Iframes
  oembed?: {
    src?: string;
    title?: string;
    html?: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const session = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session?.data?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (session?.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <div className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
        </article>

        <div className={`${styles.postContent} ${styles.previewContent}`}>
          {post.content.map((item, index) => {
            if (item.type == "paragraph") {
              return <p key={index}>{item.text}</p>;
            }
            if (item.type == "heading2") {
              return <h2 key={index}>{item.text}</h2>;
            }
            if (item.type == "heading3") {
              return <h3 key={index}>{item.text}</h3>;
            }

            if (item.type == "heading6") {
              return <cite key={index}>{item.text}</cite>;
            }
            if (item.type == "list-item") {
              return <li key={index}>{item.text}</li>;
            }
            if (item.type == "image") {
              return (
                <img
                  key={index}
                  src={item.url}
                  alt={item.alt}
                  width={item.dimensions.width}
                  height={item.dimensions.height}
                />
              );
            }
            if (item.type == "embed") {
              return (
                <iframe
                  key={index}
                  height={400}
                  src={item.oembed.html.split(`"`)[5]}
                  title="Prisma 2: Automatize o acesso ao banco de dados | Code/Drops #29"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              );
            }
          })}
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="#" onClick={handleSubscribe}>
              Subscribe now 🤗
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("posts", String(slug));

  const post = {
    slug: response.uid,
    title: RichText.asText(response.data.title),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    content: response.data.content.splice(0, 3),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, //24 Hours
  };
};
