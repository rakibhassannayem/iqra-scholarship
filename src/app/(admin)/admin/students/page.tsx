"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import StudentTable from "@/components/admin/students/StudentTable";
import StudentForm from "@/components/admin/students/StudentForm";
import StudentDetailsModal from "@/components/admin/students/StudentDetailsModal";
import type { Student, StudentFormValues } from "@/types/student";
import type { Institution } from "@/types/institution";

export default function StudentRegistrationsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [formError, setFormError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [studentsResponse, institutionsResponse] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/institutions"),
      ]);

      if (!studentsResponse.ok || !institutionsResponse.ok) {
        throw new Error("Failed to load registrations or institutions.");
      }

      const [studentsData, institutionsData] = await Promise.all([
        studentsResponse.json(),
        institutionsResponse.json(),
      ]);

      setStudents(studentsData);
      setInstitutions(institutionsData);
    } catch (err) {
      toast.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to load student data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function openCreateForm() {
    setEditingStudent(null);
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(student: Student) {
    setEditingStudent(student);
    setFormError("");
    setFormOpen(true);
  }

  async function handleSubmit(values: StudentFormValues) {
    setSaving(true);
    setFormError("");

    try {
      const isEditing = editingStudent !== null;
      const url = isEditing
        ? `/api/students/${editingStudent.id}`
        : "/api/students";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save student registration.");
      }

      setFormOpen(false);
      setEditingStudent(null);
      toast.add({
        title: isEditing ? "Registration Updated" : "Registration Successful",
        description: isEditing
          ? `Student "${values.name}" registration updated successfully.`
          : `Student "${values.name}" registered successfully with ID: ${data.studentId || data.student?.studentId || "Generated"}`,
        type: "success",
      });

      await fetchData();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save student registration.",
      );
    } finally {
      setSaving(false);
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
            setFormError("");
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
        error={formError}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
