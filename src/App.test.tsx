import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the logo", () => {
  render(<App />);
  const linkElement = screen.getByRole("img", { name: /logo/i });
  expect(linkElement).toBeInTheDocument();
});

//TODO add more tests
