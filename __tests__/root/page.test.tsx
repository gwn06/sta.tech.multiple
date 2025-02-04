import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("Home page", () => {
  render(<Page />);

  it("render home page", () => {
    expect(screen.getByText(/Godwin/i)).toBeInTheDocument();
  });
});
