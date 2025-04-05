import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComponentManager from "./ComponentManager";

// Mock axios completely to avoid loading the real ESM module
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("ComponentManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with dropdowns and button", () => {
    render(<ComponentManager />);
    expect(screen.getByLabelText(/Component/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Operation/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Execute/i })
    ).toBeInTheDocument();
  });

  test("displays search input when Read operation is selected", () => {
    render(<ComponentManager />);
    const operationSelect = screen.getByLabelText(/Operation/i);
    fireEvent.change(operationSelect, { target: { value: "read" } });
    expect(
      screen.getByLabelText(/Search by airlineName or ID/i)
    ).toBeInTheDocument();
  });

  test("creates an aircraft and displays result with ID", async () => {
    const mockAxios = require("axios");
    mockAxios.post.mockResolvedValueOnce({
      data: {
        id: 1,
        type: "Boeing 737",
        airlineName: "Air Canada",
        numberOfPassengers: 150,
      },
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "aircrafts" } });
    fireEvent.change(operationSelect, { target: { value: "create" } });

    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: "Boeing 737" },
    });
    fireEvent.change(screen.getByLabelText(/airlineName/i), {
      target: { value: "Air Canada" },
    });
    fireEvent.change(screen.getByLabelText(/numberOfPassengers/i), {
      target: { value: "150" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Aircrafts created successfully with ID 1")
      ).toBeInTheDocument();
    });
    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8080/aircraft",
      {
        type: "Boeing 737",
        airlineName: "Air Canada",
        numberOfPassengers: 150,
      }
    );
  });

  test("reads all aircrafts and displays results with IDs", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          airlineName: "Air Canada",
          type: "Boeing 737",
          numberOfPassengers: 150,
        },
        {
          id: 2,
          airlineName: "Delta",
          type: "Airbus A320",
          numberOfPassengers: 180,
        },
      ],
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "aircrafts" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("ID: 1 - Air Canada - Boeing 737 (150 passengers)")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("ID: 2 - Delta - Airbus A320 (180 passengers)")
      ).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/aircrafts"
    );
  });

  test("searches aircraft by airlineName and displays result", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          airlineName: "Air Canada",
          type: "Boeing 737",
          numberOfPassengers: 150,
        },
      ],
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "aircrafts" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.change(screen.getByLabelText(/Search by airlineName or ID/i), {
      target: { value: "Air Canada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("ID: 1 - Air Canada - Boeing 737 (150 passengers)")
      ).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/aircrafts/aircraft/Air%20Canada"
    );
  });

  test("searches airport by name and displays result", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "John F. Kennedy",
          code: "JFK",
          city: { name: "New York" },
        },
      ],
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "airports" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.change(screen.getByLabelText(/Search by name or ID/i), {
      target: { value: "John F. Kennedy" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("ID: 1 - John F. Kennedy (JFK) in New York")
      ).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/airports/airport/John%20F.%20Kennedy"
    );
  });

  test("searches city by name and displays result", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: "New York", state: "NY", population: 8400000 }],
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "cities" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.change(screen.getByLabelText(/Search by name or ID/i), {
      target: { value: "New York" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("ID: 1 - New York, NY (Population: 8400000)")
      ).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/cities/name/New%20York"
    );
  });

  test("searches passenger by id and displays result", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "555-123-4567",
        city: { name: "New York" },
      },
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "passengers" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.change(screen.getByLabelText(/Search by lastName or ID/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("ID: 1 - John Doe - 555-123-4567 (City: New York)")
      ).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/passengers/1"
    );
  });

  test("searches passenger by lastName and displays result", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "555-123-4567",
        city: { name: "New York" },
      },
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "passengers" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.change(screen.getByLabelText(/Search by lastName or ID/i), {
      target: { value: "Doe" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("ID: 1 - John Doe - 555-123-4567 (City: New York)")
      ).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/passengers/passenger/Doe"
    );
  });

  test("updates an airport and displays result with ID", async () => {
    const mockAxios = require("axios");
    mockAxios.put.mockResolvedValueOnce({});

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "airports" } });
    fireEvent.change(operationSelect, { target: { value: "update" } });

    fireEvent.change(screen.getByLabelText("ID"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "JFK Updated" },
    });
    fireEvent.change(screen.getByLabelText(/code/i), {
      target: { value: "JFK" },
    });
    fireEvent.change(screen.getByLabelText(/city ID/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Airports with ID 1 updated successfully")
      ).toBeInTheDocument();
    });
    expect(mockAxios.put).toHaveBeenCalledWith(
      "http://localhost:8080/airports/1",
      {
        name: "JFK Updated",
        code: "JFK",
        cityId: 1,
      }
    );
  });

  test("deletes a passenger and displays result with ID", async () => {
    const mockAxios = require("axios");
    mockAxios.delete.mockResolvedValueOnce({});

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "passengers" } });
    fireEvent.change(operationSelect, { target: { value: "delete" } });

    fireEvent.change(screen.getByLabelText("ID"), { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Passengers with ID 1 deleted successfully")
      ).toBeInTheDocument();
    });
    expect(mockAxios.delete).toHaveBeenCalledWith(
      "http://localhost:8080/passengers/1"
    );
  });

  test("displays error message on API failure", async () => {
    const mockAxios = require("axios");
    mockAxios.get.mockRejectedValueOnce({
      response: { data: { message: "Not found" } },
    });

    render(<ComponentManager />);
    const componentSelect = screen.getByLabelText(/Component/i);
    const operationSelect = screen.getByLabelText(/Operation/i);

    fireEvent.change(componentSelect, { target: { value: "aircrafts" } });
    fireEvent.change(operationSelect, { target: { value: "read" } });

    fireEvent.change(screen.getByLabelText(/Search by airlineName or ID/i), {
      target: { value: "Invalid" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Execute/i }));

    await waitFor(() => {
      expect(screen.getByText("Error: Not found")).toBeInTheDocument();
    });
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/aircrafts/aircraft/Invalid"
    );
  });
});
