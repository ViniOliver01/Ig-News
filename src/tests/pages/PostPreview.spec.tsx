import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { getPrismicClient } from "../../services/prismic";

import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";

jest.mock("../../services/prismic");
jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

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

describe("PostPreview", () => {
  test("should render correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({ data: null } as any);

    render(<PostPreview post={post} />);

    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  test("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
        expires: "fake-expires",
        activeSubscription: "fake-active-subscription",
      },
    } as any);

    render(<PostPreview post={post} />);
    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  test("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "Post content" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getStaticProps({
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
