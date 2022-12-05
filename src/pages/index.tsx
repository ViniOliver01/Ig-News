import { GetStaticProps } from "next";
import Head from "next/head";

import styles from "../styles/pages/home.module.scss";
import SubscribeButton from "./../components/SubscribeButton/SubscribeButton";
import { stripe } from "./../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig News</title>
      </Head>

      <main className={styles.container}>
        <section className={styles.content}>
          <h2>👋 Hey, Welcome</h2>
          <h1>News about</h1>
          <h1>
            the <span>React</span> World
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1M4XcsFKtwfpKUXgb1bE67oY");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 Hours
  };
};
