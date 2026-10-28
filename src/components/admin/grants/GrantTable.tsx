"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Building2,
  Eye,
  Pencil,
  Search,
  Trash2,
  Users,
  Trophy,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Grant = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  studentClass?: number;
  studentRoll?: number;
  institutionName: string;
  institutionEiin?: string;
  scholarshipId: number;
  scholarshipName: string;
  academicYear?: string;
  categoryId: number;
  categoryName: string;
  status: string;
  prizeStatus: string;
  prizeReceivedAt?: string | null;
  confirmedBy?: string | null;
  prizeNotes?: string | null;
  grantedAt: string;
  createdAt: string;
};

type GrantTableProps = {
  grants: Grant[];
  loading: boolean;
  onViewDetails: (grant: Grant) => void;
  onEdit: (grant: Grant) => void;
  onDelete: (grant: Grant) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function GrantTable({
  grants,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
}: GrantTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [scholarshipFilter, setScholarshipFilter] = useState("all");

  // Distinct categories and scholarships for filter dropdowns
  const categories = useMemo(() => {
    return Array.from(new Set(grants.map((g) => g.categoryName))).filter(
      Boolean,
    );
  }, [grants]);

  const scholarships = useMemo(() => {
    return Array.from(new Set(grants.map((g) => g.scholarshipName))).filter(
      Boolean,
    );
  }, [grants]);

  // Filtered grants
  const filteredGrants = useMemo(() => {
    const query = search.toLowerCase().trim();

    return grants.filter((grant) => {
      const matchesSearch =
        !query ||
        grant.studentName.toLowerCase().includes(query) ||
        grant.studentId.toLowerCase().includes(query) ||
        grant.institutionName.toLowerCase().includes(query) ||
        grant.scholarshipName.toLowerCase().includes(query) ||
        grant.categoryName.toLowerCase().includes(query) ||
        String(grant.studentRoll ?? "").includes(query);

      const matchesCategory =
        categoryFilter === "all" || grant.categoryName === categoryFilter;

      const matchesScholarship =
        scholarshipFilter === "all" ||
        grant.scholarshipName === scholarshipFilter;

      return matchesSearch && matchesCategory && matchesScholarship;
    });
  }, [grants, search, categoryFilter, scholarshipFilter]);

  // Statistics
  const prizesDistributed = useMemo(() => {
    return grants.filter((g) => g.prizeStatus === "received").length;
  }, [grants]);

  const uniqueInstitutions = useMemo(() => {
    return new Set(grants.map((g) => g.institutionName)).size;
  }, [grants]);

  const hasActiveFilters =
    Boolean(search) || categoryFilter !== "all" || scholarshipFilter !== "all";

  function resetFilters() {
    setSearch("");
    setCategoryFilter("all");
    setScholarshipFilter("all");
  }

  return (
    <div className="space-y-4">
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4 flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Granted Students (প্রাপ্ত শিক্ষার্থী)
            </p>
            <p className="text-2xl font-bold">{grants.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Trophy className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Prizes Distributed (বিতরণকৃত পুরস্কার)
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {prizesDistributed}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Building2 className="size-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Institutions (প্রতিষ্ঠান)
            </p>
            <p className="text-2xl font-bold">{uniqueInstitutions}</p>
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Granted Students List (বৃত্তিপ্রাপ্ত শিক্ষার্থী তালিকা)</span>
            <Badge variant="secondary">{filteredGrants.length} of {grants.length}</Badge>
          </CardTitle>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-48">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search student, ID, school..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            {categories.length > 0 && (
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v ?? "all")}
              >
                <SelectTrigger className="h-9 text-xs sm:w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {scholarships.length > 1 && (
              <Select
                value={scholarshipFilter}
                onValueChange={(v) => setScholarshipFilter(v ?? "all")}
              >
                <SelectTrigger className="h-9 text-xs sm:w-36">
                  <SelectValue placeholder="Scholarship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scholarships</SelectItem>
                  {scholarships.map((sch) => (
                    <SelectItem key={sch} value={sch}>
                      {sch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 text-xs gap-1 text-muted-foreground"
              >
                <X className="size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading scholarship grants...
            </p>
          ) : grants.length === 0 ? (
            <div className="py-10 text-center">
              <Award className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No scholarship grants yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Grant a scholarship to a registered student to see it here.
              </p>
            </div>
          ) : filteredGrants.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No grants match your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Scholarship</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredGrants.map((grant) => (
                    <TableRow key={grant.id}>
                      {/* Student Info */}
                      <TableCell>
                        <div className="font-medium text-sm">
                          {grant.studentName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-mono">
                          <span>{grant.studentId}</span>
                          {grant.studentClass && (
                            <span className="font-sans text-[11px] bg-muted px-1.5 py-0.2 rounded">
                              Class {grant.studentClass}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Institution */}
                      <TableCell className="text-sm">
                        {grant.institutionName}
                      </TableCell>

                      {/* Scholarship */}
                      <TableCell className="text-sm">
                        <div>{grant.scholarshipName}</div>
                        {grant.academicYear && (
                          <div className="text-xs text-muted-foreground">
                            {grant.academicYear}
                          </div>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {grant.categoryName}
                        </Badge>
                      </TableCell>

                      {/* Prize Status */}
                      <TableCell>
                        <Badge
                          variant={
                            grant.prizeStatus === "received"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            grant.prizeStatus === "received"
                              ? "bg-emerald-600"
                              : "text-muted-foreground"
                          }
                        >
                          {grant.prizeStatus === "received"
                            ? "Received"
                            : "Pending"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* View Details */}
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="View Details"
                            aria-label={`View details of ${grant.studentName}`}
                            onClick={() => onViewDetails(grant)}
                          >
                            <Eye className="size-4" />
                          </Button>

                          {/* Edit Grant */}
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Edit Grant"
                            aria-label={`Edit grant for ${grant.studentName}`}
                            onClick={() => onEdit(grant)}
                          >
                            <Pencil className="size-4" />
                          </Button>

                          {/* Delete Grant (replaces old revoke toggle) */}
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Delete Grant"
                            aria-label={`Delete grant for ${grant.studentName}`}
                            onClick={() => onDelete(grant)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
