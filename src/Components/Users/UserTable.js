"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import UserFormDrawer from "./UserFormDrawer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import axios from "axios";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { toast } = useToast();

  // Fetch users using Axios
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/users");
      console.log("response: ", response);

      setUsers(response.data); // Use response.data with Axios
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDrawerOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `http://localhost:7000/api/delete/${userId}`
        );

        if (response.status !== 200) {
          throw new Error("Failed to delete user");
        }

        toast({
          title: "User deleted successfully",
          variant: "success",
        });

        fetchUsers(); // Refetch users after deletion
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  // Optional loading and error states
  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user?.id}>
                <TableCell className="font-medium">{user?.name}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user?._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserFormDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
