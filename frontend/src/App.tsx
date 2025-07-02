import React, { useState } from "react";
import ExcelControls from "./components/ExcelControls";
import UserTable from "./components/UserTable";

const App = () => {
  const [form, setForm] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    pan: "",
  });

  const [showPAN, setShowPAN] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      pan: "",
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        isEditMode
          ? `http://localhost:3000/api/users?id=${form.id}`
          : "http://localhost:3000/api/users",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      alert(data.message);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to submit user.");
    }
  };

  const handleEditUser = (user: any) => {
    setForm(user);
    setIsEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          {isEditMode ? "Edit User" : "Add New User"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="border p-2 rounded"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="border p-2 rounded"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded w-full"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits)"
            className="border p-2 rounded w-full"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            pattern="[0-9]{10}"
            required
          />

          <div className="relative">
            <input
              type={showPAN ? "text" : "password"}
              name="pan"
              placeholder="PAN"
              className="border p-2 rounded w-full pr-10"
              value={form.pan}
              onChange={handleChange}
              maxLength={10}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-blue-600"
              onClick={() => setShowPAN(!showPAN)}
            >
              {showPAN ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? "Update User" : "Submit"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Upload + Download */}
      <ExcelControls />

      {/* Table with Edit + Delete */}
      <UserTable onEdit={handleEditUser} />
    </div>
  );
};

export default App;
