import React, { useState, useEffect } from "react";
import axios from "axios";

function CityList() {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [newCity, setNewCity] = useState({
    name: "",
    state: "",
    population: 0,
  });
  const [editCity, setEditCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get("http://app-alb-918023355.ca-central-1.elb.amazonaws.com/cities");
      setCities(response.data);
      setFilteredCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://app-alb-918023355.ca-central-1.elb.amazonaws.com/city", newCity);
      fetchCities();
      setNewCity({ name: "", state: "", population: 0 });
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://app-alb-918023355.ca-central-1.elb.amazonaws.com/cities/${editCity.id}`, editCity);
      fetchCities();
      setEditCity(null);
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://app-alb-918023355.ca-central-1.elb.amazonaws.com/cities/${id}`);
      fetchCities();
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  const handleSearch = () => {
    const filtered = cities.filter(
      (city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cities</h2>
      <div className="flex gap-4 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or state"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={handleSearch}
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={fetchCities}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900"
        >
          Retrieve All
        </button>
      </div>
      <ul className="space-y-4">
        {filteredCities.map((city) => (
          <li
            key={city.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            {editCity && editCity.id === city.id ? (
              <div className="flex-1 flex gap-4">
                <input
                  value={editCity.name}
                  onChange={(e) =>
                    setEditCity({ ...editCity, name: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editCity.state}
                  onChange={(e) =>
                    setEditCity({ ...editCity, state: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  type="number"
                  value={editCity.population}
                  onChange={(e) =>
                    setEditCity({
                      ...editCity,
                      population: parseInt(e.target.value),
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
                  onClick={() => setEditCity(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-700">
                  {city.name}, {city.state} (Pop: {city.population})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditCity(city)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
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
        Add New City
      </h3>
      <div className="flex gap-4">
        <input
          value={newCity.name}
          onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
          placeholder="City Name"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newCity.state}
          onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
          placeholder="State"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="number"
          value={newCity.population}
          onChange={(e) =>
            setNewCity({ ...newCity, population: parseInt(e.target.value) })
          }
          placeholder="Population"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add City
        </button>
      </div>
    </div>
  );
}

export default CityList;
