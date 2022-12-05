import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";

import { getPrismicClient } from "../../services/prismic";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

const post = {
  slug: "my-new-post",
  title: "My new post",
  updatedAt: "01 de Abril de 2021",
  content: [
    {
      type: "paragraph",
      text: "Post excerpt",
      spans: [],
    },
  ],
} as any;

describe("Post", () => {
  test("should render correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
  });

  test("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({ params: { slug: "my-new-post" } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  test("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fakes-active-subscription",
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "Post content" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getServerSideProps({
      uid: "posts",
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            title: "My new post",
            updatedAt: "01 de abril de 2021",
            content: [{ type: "paragraph", text: "Post content" }],
          },
        },
      })
    );
  });
});
