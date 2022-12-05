import Head from "next/head";
import { GetServerSideProps } from "next";
import styles from "../../styles/pages/slug.module.scss";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

interface PostProps {
  post: Post;
}

interface Post {
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

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

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

        <div className={styles.postContent}>
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
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { slug } = params;
  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID("posts", String(slug));

  const post = {
    title: RichText.asText(response.data.title),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    content: response.data.content,
  };
  return {
    props: {
      post,
    },
  };
};
