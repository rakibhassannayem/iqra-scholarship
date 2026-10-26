"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type UserTableProps = {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Users</span>
          <Badge variant="secondary">{users.length} total</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading users...
          </p>
        ) : users.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No users yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first user to see it here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-medium">{user.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        user.role === "superadmin" ? "default" : "secondary"
                      }
                    >
                      {user.role === "superadmin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Delete ${user.name}`}
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
