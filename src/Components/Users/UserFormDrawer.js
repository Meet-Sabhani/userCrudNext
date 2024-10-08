"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function UserFormDrawer({
  open,
  onClose,
  user = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        address: user?.address || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        address: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = user
        ? `http://localhost:7000/api/update/${user?._id}`
        : "http://localhost:7000/api/user";

      const method = user ? "put" : "post";

      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data: formData, // Send form data as JSON
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to save user");
      }

      toast({
        title: `User ${user ? "updated" : "created"} successfully`,
        variant: "success",
      });

      onSuccess && onSuccess(); // Refresh data after success
      setFormData({
        name: "",
        email: "",
        address: "",
      });
      onClose(); // Close the drawer
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        onClose();
        setFormData({
          name: "",
          email: "",
          address: "",
        });
      }}
    >
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{user ? "Edit User" : "Create New User"}</SheetTitle>
          <SheetDescription>
            {user
              ? "Update user information using the form below."
              : "Fill in the details to create a new user."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                setFormData({
                  name: "",
                  email: "",
                  address: "",
                });
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : user ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
