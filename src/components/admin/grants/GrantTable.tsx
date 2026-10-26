"use client";

import { Pencil, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export type Grant = {
  id: number;
  studentId: string;
  studentName: string;
  institutionName: string;
  scholarshipName: string;
  categoryName: string;
  awardAmount: number;
  status: "granted" | "revoked";
  grantedAt: string;
  createdAt: string;
};

type GrantTableProps = {
  grants: Grant[];
  loading: boolean;
  onToggleStatus: (grant: Grant) => void;
  updatingId: number | null;
};

export default function GrantTable({
  grants,
  loading,
  onToggleStatus,
  updatingId,
}: GrantTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredGrants = grants.filter((grant) => {
    const searchTerm = search.toLowerCase().trim();

    const matchesSearch = [
      grant.studentName,
      grant.studentId,
      grant.institutionName,
      grant.scholarshipName,
      grant.categoryName,
    ].some((value) => value.toLowerCase().includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" || grant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Loading scholarship grants...
      </div>
    );
  }

  if (grants.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No scholarship grants found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search student, ID, institution, scholarship..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (value !== null) {
              setStatusFilter(value);
            }
          }}
        >
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="granted">Granted</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Scholarship</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Granted At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredGrants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No matching scholarship grants found.
                </TableCell>
              </TableRow>
            ) : (
              filteredGrants.map((grant) => {
                const updating = updatingId === grant.id;

                return (
                  <TableRow key={grant.id}>
                    <TableCell>
                      <div className="font-medium">{grant.studentName}</div>
                      <div className="text-xs text-muted-foreground">
                        {grant.studentId}
                      </div>
                    </TableCell>

                    <TableCell>{grant.institutionName}</TableCell>
                    <TableCell>{grant.scholarshipName}</TableCell>
                    <TableCell>{grant.categoryName}</TableCell>
                    <TableCell>
                      ৳{grant.awardAmount.toLocaleString("en-BD")}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          grant.status === "granted" ? "default" : "secondary"
                        }
                      >
                        {grant.status === "granted" ? "Granted" : "Revoked"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(grant.grantedAt).toLocaleDateString("en-GB")}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updating}
                        onClick={() => onToggleStatus(grant)}
                      >
                        {updating ? (
                          <RefreshCw className="animate-spin" />
                        ) : (
                          <Pencil />
                        )}
                        {grant.status === "granted" ? "Revoke" : "Restore"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
