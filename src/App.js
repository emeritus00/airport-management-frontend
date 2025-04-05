import React from "react";
import ComponentManager from "./components/ComponentManager";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Airport Management System
        </h1>
        <ComponentManager />
      </div>
    </div>
  );
}

export default App;
