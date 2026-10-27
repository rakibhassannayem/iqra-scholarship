"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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
import StudentDetailsModal from "@/components/admin/students/StudentDetailsModal";

type Institution = {
  id: number;
  name: string;
  eiin: string;
};

export default function StudentRegistrationsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
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
        throw new Error("Failed to load student registrations or institutions.");
      }

      const [studentsData, institutionsData] = await Promise.all([
        studentsResponse.json(),
        institutionsResponse.json(),
      ]);

      setStudents(studentsData);
      setInstitutions(institutionsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load data.",
      );
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
        throw new Error(data.message || "Failed to save student registration.");
      }

      setFormOpen(false);
      setEditingStudent(null);
      setSuccess(
        editingStudent
          ? "Student registration updated successfully."
          : `Student registered successfully with ID: ${data.studentId || data.student?.studentId || "Generated"}`,
      );

      await fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save student registration.",
      );
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
        throw new Error(data.message || "Failed to delete student registration.");
      }

      setDeleteTarget(null);
      setSuccess("Student registration deleted successfully.");
      await fetchData();
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Failed to delete student registration.",
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Registrations</h1>
          <p className="text-sm text-muted-foreground">
            Manage student registrations, academic records, and scholarship allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button onClick={openCreateForm} className="gap-1.5">
            <UserPlus className="size-4" />
            Register Student
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {error && !formOpen && !deleteTarget && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Table or Loading */}
      {loading && students.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          <div className="inline-flex size-10 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent mb-3" />
          <p className="text-sm">Loading student registrations...</p>
        </div>
      ) : (
        <StudentTable
          students={students}
          institutions={institutions}
          onView={(student) => setViewingStudent(student)}
          onEdit={openEditForm}
          onDelete={(student) => {
            setDeleteError("");
            setDeleteTarget(student);
          }}
        />
      )}

      {/* View Details Modal */}
      <StudentDetailsModal
        student={viewingStudent}
        open={Boolean(viewingStudent)}
        onOpenChange={(open) => {
          if (!open) setViewingStudent(null);
        }}
        onEdit={(student) => {
          setViewingStudent(null);
          openEditForm(student);
        }}
      />

      {/* Register/Edit Modal */}
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
                scholarshipId: editingStudent.scholarshipId,
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

      {/* Delete Confirmation Alert */}
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
            <AlertDialogTitle>Delete Student Registration?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete registration for{" "}
              <strong>{deleteTarget?.name}</strong> (Student ID:{" "}
              <span className="font-mono">{deleteTarget?.studentId}</span>)?
              This will remove the student record and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="text-sm font-medium text-destructive">{deleteError}</p>
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
              Delete Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
