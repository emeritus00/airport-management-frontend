import React, { useState, useEffect } from "react";
import axios from "axios";

function AirportList() {
  const [airports, setAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [newAirport, setNewAirport] = useState({
    name: "",
    code: "",
    city: { id: "" },
  });
  const [editAirport, setEditAirport] = useState(null);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await axios.get("http://localhost:8080/airports");
      setAirports(response.data);
      setFilteredAirports(response.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:8080/airport", {
        ...newAirport,
        city: newAirport.city.id ? { id: parseInt(newAirport.city.id) } : null,
      });
      fetchAirports();
      setNewAirport({ name: "", code: "", city: { id: "" } });
    } catch (error) {
      console.error("Error adding airport:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/airports/${editAirport.id}`, {
        ...editAirport,
        city:
          editAirport.city && editAirport.city.id
            ? { id: parseInt(editAirport.city.id) }
            : null,
      });
      fetchAirports();
      setEditAirport(null);
    } catch (error) {
      console.error("Error updating airport:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/airports/${id}`);
      fetchAirports();
    } catch (error) {
      console.error("Error deleting airport:", error);
    }
  };

  const handleSearch = () => {
    const filtered = airports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAirports(filtered);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Airports</h2>
      <div className="flex gap-4 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or code"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={handleSearch}
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={fetchAirports}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900"
        >
          Retrieve All
        </button>
      </div>
      <ul className="space-y-4">
        {filteredAirports.map((airport) => (
          <li
            key={airport.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            {editAirport && editAirport.id === airport.id ? (
              <div className="flex-1 flex gap-4">
                <input
                  value={editAirport.name}
                  onChange={(e) =>
                    setEditAirport({ ...editAirport, name: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editAirport.code}
                  onChange={(e) =>
                    setEditAirport({ ...editAirport, code: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editAirport.city?.id || ""}
                  onChange={(e) =>
                    setEditAirport({
                      ...editAirport,
                      city: { id: e.target.value },
                    })
                  }
                  placeholder="City ID"
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditAirport(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-700">
                  {airport.name} ({airport.code}) -{" "}
                  {airport.city ? airport.city.name : "No City"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditAirport(airport)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(airport.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4">
        Add New Airport
      </h3>
      <div className="flex gap-4">
        <input
          value={newAirport.name}
          onChange={(e) =>
            setNewAirport({ ...newAirport, name: e.target.value })
          }
          placeholder="Airport Name"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newAirport.code}
          onChange={(e) =>
            setNewAirport({ ...newAirport, code: e.target.value })
          }
          placeholder="Airport Code"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newAirport.city.id}
          onChange={(e) =>
            setNewAirport({ ...newAirport, city: { id: e.target.value } })
          }
          placeholder="City ID"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Airport
        </button>
      </div>
    </div>
  );
}

export default AirportList;
