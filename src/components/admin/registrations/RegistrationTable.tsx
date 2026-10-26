"use client";

import { Trash2, ClipboardList } from "lucide-react";
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

export type Registration = {
  id: number;
  studentId: string;
  studentName: string;
  institutionName: string;
  scholarshipName: string;
  registeredAt: string;
};

type RegistrationTableProps = {
  registrations: Registration[];
  loading: boolean;
  onDelete: (registration: Registration) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RegistrationTable({
  registrations,
  loading,
  onDelete,
}: RegistrationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>All Registrations</span>
          <Badge variant="secondary">{registrations.length} total</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading registrations...
          </p>
        ) : registrations.length === 0 ? (
          <div className="py-10 text-center">
            <ClipboardList className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No registrations yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Scholarship registrations will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Scholarship</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <p className="font-medium">{registration.studentName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ID: {registration.studentId}
                    </p>
                  </TableCell>

                  <TableCell>{registration.institutionName}</TableCell>

                  <TableCell>{registration.scholarshipName}</TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(registration.registeredAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Delete registration for ${registration.studentName}`}
                        onClick={() => onDelete(registration)}
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
