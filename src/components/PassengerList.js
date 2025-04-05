import React, { useState, useEffect } from "react";
import axios from "axios";

function PassengerList() {
  const [passengers, setPassengers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [newPassenger, setNewPassenger] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: { id: "" },
  });
  const [editPassenger, setEditPassenger] = useState(null);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      const response = await axios.get("http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/passengers");
      setPassengers(response.data);
      setFilteredPassengers(response.data);
    } catch (error) {
      console.error("Error fetching passengers:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/passenger", {
        ...newPassenger,
        city: newPassenger.city.id
          ? { id: parseInt(newPassenger.city.id) }
          : null,
      });
      fetchPassengers();
      setNewPassenger({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: { id: "" },
      });
    } catch (error) {
      console.error("Error adding passenger:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/passengers/${editPassenger.id}`, {
        ...editPassenger,
        city:
          editPassenger.city && editPassenger.city.id
            ? { id: parseInt(editPassenger.city.id) }
            : null,
      });
      fetchPassengers();
      setEditPassenger(null);
    } catch (error) {
      console.error("Error updating passenger:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://app-alb-1165913258.ca-central-1.elb.amazonaws.com/passengers/${id}`);
      fetchPassengers();
    } catch (error) {
      console.error("Error deleting passenger:", error);
    }
  };

  const handleSearch = () => {
    const filtered = passengers.filter(
      (passenger) =>
        passenger.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passenger.phoneNumber.includes(searchQuery)
    );
    setFilteredPassengers(filtered);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Passengers</h2>
      <div className="flex gap-4 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or phone"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          onClick={handleSearch}
          className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={fetchPassengers}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900"
        >
          Retrieve All
        </button>
      </div>
      <ul className="space-y-4">
        {filteredPassengers.map((passenger) => (
          <li
            key={passenger.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
          >
            {editPassenger && editPassenger.id === passenger.id ? (
              <div className="flex-1 flex gap-4">
                <input
                  value={editPassenger.firstName}
                  onChange={(e) =>
                    setEditPassenger({
                      ...editPassenger,
                      firstName: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editPassenger.lastName}
                  onChange={(e) =>
                    setEditPassenger({
                      ...editPassenger,
                      lastName: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editPassenger.phoneNumber}
                  onChange={(e) =>
                    setEditPassenger({
                      ...editPassenger,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full"
                />
                <input
                  value={editPassenger.city?.id || ""}
                  onChange={(e) =>
                    setEditPassenger({
                      ...editPassenger,
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
                  onClick={() => setEditPassenger(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-700">
                  {passenger.firstName} {passenger.lastName} -{" "}
                  {passenger.phoneNumber}
                  {passenger.city ? ` (City: ${passenger.city.name})` : ""}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditPassenger(passenger)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(passenger.id)}
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
        Add New Passenger
      </h3>
      <div className="flex gap-4">
        <input
          value={newPassenger.firstName}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, firstName: e.target.value })
          }
          placeholder="First Name"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newPassenger.lastName}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, lastName: e.target.value })
          }
          placeholder="Last Name"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newPassenger.phoneNumber}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, phoneNumber: e.target.value })
          }
          placeholder="Phone Number"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <input
          value={newPassenger.city.id}
          onChange={(e) =>
            setNewPassenger({ ...newPassenger, city: { id: e.target.value } })
          }
          placeholder="City ID"
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Passenger
        </button>
      </div>
    </div>
  );
}

export default PassengerList;
