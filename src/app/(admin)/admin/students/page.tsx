"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StudentForm, {
  type StudentFormValues,
} from "@/components/admin/students/StudentForm";
import StudentTable, {
  type Student,
} from "@/components/admin/students/StudentTable";

type Institution = {
  id: number;
  name: string;
  eiin: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsResponse, institutionsResponse] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/institutions"),
      ]);

      if (!studentsResponse.ok || !institutionsResponse.ok) {
        throw new Error("Failed to load students or institutions.");
      }

      const [studentsData, institutionsData] = await Promise.all([
        studentsResponse.json(),
        institutionsResponse.json(),
      ]);

      setStudents(studentsData);
      setInstitutions(institutionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openCreateForm() {
    setEditingStudent(null);
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(student: Student) {
    setEditingStudent(student);
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  async function handleSubmit(values: StudentFormValues) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        editingStudent ? `/api/students/${editingStudent.id}` : "/api/students",
        {
          method: editingStudent ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save student.");
      }

      setFormOpen(false);
      setEditingStudent(null);
      setSuccess(
        editingStudent
          ? "Student updated successfully."
          : "Student registered successfully.",
      );

      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save student.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleteError("");

    try {
      const response = await fetch(`/api/students/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student.");
      }

      setDeleteTarget(null);
      setSuccess("Student deleted successfully.");
      await fetchData();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete student.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            Manage student registrations and information.
          </p>
        </div>

        <Button onClick={openCreateForm}>Add Student</Button>
      </div>

      {error && !formOpen && !deleteTarget && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-600/30 bg-green-600/5 p-3 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Loading students...
        </div>
      ) : (
        <StudentTable
          students={students}
          institutions={institutions}
          onEdit={openEditForm}
          onDelete={(student) => {
            setDeleteError("");
            setDeleteTarget(student);
          }}
        />
      )}

      <StudentForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setError("");
            setEditingStudent(null);
          }
        }}
        initialValues={
          editingStudent
            ? {
                name: editingStudent.name,
                institutionId: editingStudent.institutionId,
                class: editingStudent.class,
                roll: editingStudent.roll,
              }
            : null
        }
        editing={Boolean(editingStudent)}
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
