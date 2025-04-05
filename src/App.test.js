import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock axios to prevent Jest from loading the real ESM module
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

test("renders airport management system heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Airport Management System/i);
  expect(headingElement).toBeInTheDocument();
});
