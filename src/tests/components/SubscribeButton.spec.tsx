import { render, screen, fireEvent } from "@testing-library/react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { mocked } from "jest-mock";

import SubscribeButton from "./../../components/SubscribeButton/SubscribeButton";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SubscribeButton", () => {
  test("Render correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({ data: null } as any);
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  test("Redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({ data: null } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");
    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  test("Redirects to posts when user has a subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

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

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");
    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
