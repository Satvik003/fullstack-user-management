import React, { useEffect, useState } from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pan: string;
}

interface Props {
  onEdit: (user: User) => void;
}

const UserTable: React.FC<Props> = ({ onEdit }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`http://localhost:3000/api/users?id=${id}`, {
        method: "DELETE",
      });
      fetchUsers(); // refresh table
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-10 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">PAN</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border p-2">
                  {user.first_name} {user.last_name}
                </td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.pan}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
