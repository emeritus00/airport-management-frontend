import React, { useState, useEffect } from "react";
import axios from "axios";

function AircraftList() {
  const [aircrafts, setAircrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAircrafts, setFilteredAircrafts] = useState([]);
  const [newAircraft, setNewAircraft] = useState({
    type: "",
    airlineName: "",
    numberOfPassengers: 0,
  });
  const [editAircraft, setEditAircraft] = useState(null);

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    try {
      const response = await axios.get("http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/aircraft/aircrafts");
      setAircrafts(response.data);
      setFilteredAircrafts(response.data);
    } catch (error) {
      console.error("Error fetching aircrafts:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/aircraft", newAircraft);
      fetchAircrafts();
      setNewAircraft({ type: "", airlineName: "", numberOfPassengers: 0 });
    } catch (error) {
      console.error("Error adding aircraft:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/aircrafts/${editAircraft.id}`,
        editAircraft
      );
      fetchAircrafts();
      setEditAircraft(null);
    } catch (error) {
      console.error("Error updating aircraft:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/aircrafts/${id}`);
      fetchAircrafts();
    } catch (error) {
      console.error("Error deleting aircraft:", error);
    }
  };

  const handleSearch = () => {
    const filtered = aircrafts.filter(
      (aircraft) =>
        aircraft.airlineName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        aircraft.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAircrafts(filtered);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Aircrafts</h2>
      <div className="flex gap-4 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by airline or type"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={handleSearch}
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={fetchAircrafts}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900"
        >
          Retrieve All
        </button>
      </div>
      <ul className="space-y-4">
        {filteredAircrafts.map((aircraft) => (
          <li
            key={aircraft.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            {editAircraft && editAircraft.id === aircraft.id ? (
              <div className="flex-1 flex gap-4">
                <input
                  value={editAircraft.type}
                  onChange={(e) =>
                    setEditAircraft({ ...editAircraft, type: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editAircraft.airlineName}
                  onChange={(e) =>
                    setEditAircraft({
                      ...editAircraft,
                      airlineName: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  type="number"
                  value={editAircraft.numberOfPassengers}
                  onChange={(e) =>
                    setEditAircraft({
                      ...editAircraft,
                      numberOfPassengers: parseInt(e.target.value),
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditAircraft(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-700">
                  {aircraft.airlineName} - {aircraft.type} (
                  {aircraft.numberOfPassengers} passengers)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditAircraft(aircraft)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(aircraft.id)}
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
        Add New Aircraft
      </h3>
      <div className="flex gap-4">
        <input
          value={newAircraft.type}
          onChange={(e) =>
            setNewAircraft({ ...newAircraft, type: e.target.value })
          }
          placeholder="Type"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newAircraft.airlineName}
          onChange={(e) =>
            setNewAircraft({ ...newAircraft, airlineName: e.target.value })
          }
          placeholder="Airline Name"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="number"
          value={newAircraft.numberOfPassengers}
          onChange={(e) =>
            setNewAircraft({
              ...newAircraft,
              numberOfPassengers: parseInt(e.target.value),
            })
          }
          placeholder="Passengers"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Aircraft
        </button>
      </div>
    </div>
  );
}

export default AircraftList;
