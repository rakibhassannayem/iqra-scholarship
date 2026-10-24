"use client";

import { Pencil, Trash2 } from "lucide-react";
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

export type Institution = {
  id: number;
  name: string;
  eiin: string;
  createdAt: string;
};

type InstitutionTableProps = {
  institutions: Institution[];
  loading: boolean;
  onEdit: (institution: Institution) => void;
  onDelete: (institution: Institution) => void;
};

export default function InstitutionTable({
  institutions,
  loading,
  onEdit,
  onDelete,
}: InstitutionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Institution List</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution Name</TableHead>
                <TableHead>EIIN</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading institutions...
                  </TableCell>
                </TableRow>
              ) : institutions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No institutions found. Create your first institution.
                  </TableCell>
                </TableRow>
              ) : (
                institutions.map((institution) => (
                  <TableRow key={institution.id}>
                    <TableCell className="font-medium">
                      {institution.name}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{institution.eiin}</Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(institution.createdAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Edit ${institution.name}`}
                          onClick={() => onEdit(institution)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="icon"
                          aria-label={`Delete ${institution.name}`}
                          onClick={() => onDelete(institution)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
