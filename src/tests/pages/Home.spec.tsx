import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { mocked } from "jest-mock";

import { stripe } from "../../services/stripe";

import Home, { getStaticProps } from "../../pages";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react");

jest.mock("../../services/stripe");

describe("Home", () => {
  test("should render correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({ data: null } as any);

    render(<Home product={{ priceId: "fake-price-id", amount: "fake-amount" }} />);

    expect(screen.getByText(/fake-amount/i)).toBeInTheDocument();
  });

  test("loads initial data", async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
