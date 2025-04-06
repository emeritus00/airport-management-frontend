import React, { useState } from "react";
import axios from "axios";

function ComponentManager() {
  const [component, setComponent] = useState("aircrafts");
  const [operation, setOperation] = useState("read");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({});

  const components = [
    {
      value: "aircrafts",
      label: "Aircrafts",
      fields: ["type", "airlineName", "numberOfPassengers"],
      searchField: "airlineName",
      searchPath: "aircraft",
    },
    {
      value: "airports",
      label: "Airports",
      fields: ["name", "code", "cityId"],
      searchField: "name",
      searchPath: "airport",
    },
    {
      value: "cities",
      label: "Cities",
      fields: ["name", "state", "population"],
      searchField: "name",
      searchPath: "name",
    },
    {
      value: "passengers",
      label: "Passengers",
      fields: ["firstName", "lastName", "phoneNumber", "cityId"],
      searchField: "lastName", // Changed to "lastName" to match getPassengerByLastName
      searchPath: "passenger",
    },
  ];

  const operations = [
    { value: "create", label: "Create" },
    { value: "read", label: "Read" },
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = "http://http://app-alb-1165913258.ca-central-1.elb.amazonaws.com";
    const selectedComponent =
      components.find((c) => c.value === component) || components[0];
    try {
      let response;
      switch (operation) {
        case "create":
          response = await axios.post(
            `${baseUrl}/${component.slice(0, -1)}`,
            formData
          );
          setResults([
            {
              message: `${
                selectedComponent.label
              } created successfully with ID ${response.data?.id || "unknown"}`,
            },
          ]);
          break;
        case "read":
          if (query) {
            // If query is numeric, treat it as an ID
            if (/^\d+$/.test(query)) {
              const url = `${baseUrl}/${component}/${encodeURIComponent(
                query
              )}`;
              console.log("Fetching ID URL:", url); // Debug
              response = await axios.get(url);
            } else {
              // Non-numeric query uses searchPath (e.g., lastName, airlineName)
              const url = `${baseUrl}/${component}/${
                selectedComponent.searchPath
              }/${encodeURIComponent(query)}`;
              console.log("Fetching search URL:", url); // Debug
              response = await axios.get(url);
            }
            console.log("Response data:", response.data); // Debug
            setResults(formatReadResults(selectedComponent, response.data));
          } else {
            response = await axios.get(`${baseUrl}/${component}`);
            setResults(formatReadResults(selectedComponent, response.data));
          }
          break;
        case "update":
          await axios.put(`${baseUrl}/${component}/${query}`, formData);
          setResults([
            {
              message: `${selectedComponent.label} with ID ${query} updated successfully`,
            },
          ]);
          break;
        case "delete":
          await axios.delete(`${baseUrl}/${component}/${query}`);
          setResults([
            {
              message: `${selectedComponent.label} with ID ${query} deleted successfully`,
            },
          ]);
          break;
        default:
          setResults([{ message: "Invalid operation" }]);
          break;
      }
    } catch (error) {
      setResults([
        { message: `Error: ${error.response?.data?.message || error.message}` },
      ]);
    }
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "numberOfPassengers" ||
        field === "population" ||
        field === "cityId"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const formatReadResults = (component, data) => {
    if (!data) return [{ message: "No results found" }];
    const isArray = Array.isArray(data);
    const items = isArray ? data : [data];

    switch (component.value) {
      case "aircrafts":
        return items.map((item) => ({
          message: `ID: ${item.id || "unknown"} - ${item.airlineName || ""} - ${
            item.type || ""
          } (${item.numberOfPassengers || 0} passengers)`,
        }));
      case "airports":
        return items.map((item) => ({
          message: `ID: ${item.id || "unknown"} - ${item.name || ""} (${
            item.code || ""
          })${item.city ? ` in ${item.city.name || ""}` : ""}`,
        }));
      case "cities":
        return items.map((item) => ({
          message: `ID: ${item.id || "unknown"} - ${item.name || ""}, ${
            item.state || ""
          } (Population: ${item.population || 0})`,
        }));
      case "passengers":
        return items.map((item) => ({
          message: `ID: ${item.id || "unknown"} - ${item.firstName || ""} ${
            item.lastName || ""
          } - ${item.phoneNumber || ""}${
            item.city ? ` (City: ${item.city.name || ""})` : ""
          }`,
        }));
      default:
        return items.map((item) => ({
          message: `ID: ${item.id || "unknown"} - ${JSON.stringify(item)}`,
        }));
    }
  };

  const selectedComponent =
    components.find((c) => c.value === component) || components[0];

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="component"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Component
          </label>
          <select
            id="component"
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {components.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="operation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Operation
          </label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {operations.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {(operation === "read" ||
          operation === "update" ||
          operation === "delete") && (
          <div>
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {operation === "read"
                ? `Search by ${selectedComponent.searchField} or ID`
                : "ID"}
            </label>
            <input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                operation === "read"
                  ? `e.g., ${
                      selectedComponent.searchField === "lastName"
                        ? "Doe"
                        : selectedComponent.searchField === "airlineName"
                        ? "Air Canada"
                        : "New York"
                    } or ID`
                  : "Enter ID"
              }
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        )}

        {(operation === "create" || operation === "update") && (
          <div className="space-y-4">
            {selectedComponent.fields.map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-2 capitalize"
                >
                  {field.replace("Id", " ID")}
                </label>
                <input
                  id={field}
                  value={formData[field] || ""}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  placeholder={`Enter ${field}`}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md shadow hover:bg-blue-900 transition duration-200"
        >
          Execute
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Results</h3>
          <ul className="space-y-3">
            {results.map((result, index) => (
              <li
                key={index}
                className="p-3 bg-gray-50 rounded-md text-gray-700 shadow-sm"
              >
                {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ComponentManager;
