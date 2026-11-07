"use client";

import { useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Pencil,
  Eye,
  School,
  MapPin,
  Phone,
  Search,
  X,
  User,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Institution } from "@/types/institution";

export type { Institution };

type InstitutionTableProps = {
  institutions: Institution[];
  loading: boolean;
  onView: (institution: Institution) => void;
  onEdit: (institution: Institution) => void;
};

export default function InstitutionTable({
  institutions,
  loading,
  onView,
  onEdit,
}: InstitutionTableProps) {
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Filter & Search
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((institution) => {
      const query = search.toLowerCase();
      const matchesSearch =
        institution.name.toLowerCase().includes(query) ||
        institution.eiin.toLowerCase().includes(query) ||
        (institution.principal &&
          institution.principal.toLowerCase().includes(query)) ||
        (institution.representative &&
          institution.representative.toLowerCase().includes(query)) ||
        (institution.district &&
          institution.district.toLowerCase().includes(query)) ||
        (institution.upazila &&
          institution.upazila.toLowerCase().includes(query));

      const matchesDistrict =
        districtFilter === "all" ||
        institution.district?.toLowerCase() === districtFilter.toLowerCase();

      return matchesSearch && matchesDistrict;
    });
  }, [institutions, search, districtFilter]);

  // Unique districts for filter dropdown
  const uniqueDistricts = useMemo(() => {
    const districts = institutions
      .map((i) => i.district)
      .filter((d): d is string => Boolean(d));
    return Array.from(new Set(districts)).sort();
  }, [institutions]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInstitutions.length / PAGE_SIZE) || 1;
  const paginatedInstitutions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredInstitutions.slice(start, start + PAGE_SIZE);
  }, [filteredInstitutions, page]);

  // Reset page when search or filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDistrictChange = (value: string) => {
    setDistrictFilter(value);
    setPage(1);
  };

  // Helper for generating page numbers with ellipsis
  const getPaginationItems = () => {
    const items: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (page <= 3) {
        items.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (page >= totalPages - 2) {
        items.push(
          1,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        items.push(
          1,
          "ellipsis",
          page - 1,
          page,
          page + 1,
          "ellipsis",
          totalPages,
        );
      }
    }
    return items;
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search, Filter, Clear */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search name, EIIN, contact..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {uniqueDistricts.length > 0 && (
            <select
              value={districtFilter}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Districts</option>
              {uniqueDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

          {(search || districtFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setDistrictFilter("all");
                setPage(1);
              }}
              className="h-10"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">EIIN</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Principal</th>
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Loading institutions...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedInstitutions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <School className="size-8 text-muted-foreground/60" />
                      <span className="font-medium">No institutions found</span>
                      <span className="text-xs">
                        {search || districtFilter !== "all"
                          ? "Try adjusting your search filters."
                          : "Get started by adding your first institution."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInstitutions.map((institution) => {
                  const locationParts = [
                    institution.upazila,
                    institution.district,
                  ].filter(Boolean);

                  return (
                    <tr
                      key={institution.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Name & Basic Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <Building className="size-4 text-muted-foreground shrink-0" />
                          <span>{institution.name}</span>
                        </div>
                        {institution.village && (
                          <div className="text-xs text-muted-foreground pl-6">
                            {institution.village}
                          </div>
                        )}
                      </td>

                      {/* EIIN */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <Badge variant="outline" className="font-semibold">
                          {institution.eiin}
                        </Badge>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {locationParts.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
                            <span>{locationParts.join(", ")}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            -
                          </span>
                        )}
                      </td>

                      {/* Principal Info */}
                      <td className="py-3.5 px-4">
                        {institution.principal ? (
                          <div className="space-y-0.5">
                            <div className="text-xs font-medium text-foreground flex items-center gap-1">
                              <User className="size-3 shrink-0 text-muted-foreground/70" />
                              <span>{institution.principal}</span>
                            </div>
                            {institution.principalPhone && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="size-3 shrink-0 text-muted-foreground/50" />
                                <span>{institution.principalPhone}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            -
                          </span>
                        )}
                      </td>

                      {/* Representative Info */}
                      <td className="py-3.5 px-4">
                        {institution.representative ? (
                          <div className="space-y-0.5">
                            <div className="text-xs font-medium text-foreground flex items-center gap-1">
                              <User className="size-3 shrink-0 text-muted-foreground/70" />
                              <span>{institution.representative}</span>
                            </div>
                            {institution.representativePhone && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="size-3 shrink-0 text-muted-foreground/50" />
                                <span>{institution.representativePhone}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            -
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(institution)}
                            title="View details"
                            aria-label={`View details for ${institution.name}`}
                            className="size-8"
                          >
                            <Eye className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(institution)}
                            title="Edit"
                            aria-label={`Edit ${institution.name}`}
                            className="size-8"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with counts and Pagination */}
        {!loading && filteredInstitutions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/10 text-xs text-muted-foreground">
            <div>
              Showing{" "}
              <span className="font-medium text-foreground">
                {(page - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(page * PAGE_SIZE, filteredInstitutions.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredInstitutions.length}
              </span>{" "}
              institutions
            </div>

            {totalPages > 1 && (
              <Pagination className="justify-end w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPaginationItems().map((item, idx) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={page === item}
                          onClick={() => setPage(item)}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
