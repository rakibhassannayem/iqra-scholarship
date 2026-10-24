"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Student = {
  id: number;
  studentId: string;
  institutionId: number;
  name: string;
  class: number;
  roll: number;
  createdAt: string;
};

type StudentTableProps = {
  students: Student[];
  institutions: {
    id: number;
    name: string;
    eiin: string;
  }[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
};

export default function StudentTable({
  students,
  institutions,
  onEdit,
  onDelete,
}: StudentTableProps) {
  function getInstitutionName(institutionId: number) {
    const institution = institutions.find((item) => item.id === institutionId);

    return institution?.name ?? "Unknown Institution";
  }

  if (students.length === 0) {
    return (
      <div className="rounded-lg border py-12 text-center">
        <p className="text-muted-foreground">No students found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b text-left">
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Student ID</th>
            <th className="px-4 py-3 font-medium">Institution</th>
            <th className="px-4 py-3 font-medium">Class</th>
            <th className="px-4 py-3 font-medium">Roll</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-b last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-medium">{student.name}</td>

              <td className="px-4 py-3">
                <Badge variant="secondary">{student.studentId}</Badge>
              </td>

              <td className="px-4 py-3">
                {getInstitutionName(student.institutionId)}
              </td>

              <td className="px-4 py-3">Class {student.class}</td>

              <td className="px-4 py-3">{student.roll}</td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(student)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
