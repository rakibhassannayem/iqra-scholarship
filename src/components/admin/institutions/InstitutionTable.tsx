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
  Trash2,
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

export type Institution = {
  id: number;
  name: string;
  eiin: string;
  principal: string | null;
  principalPhone: string | null;
  representative: string | null;
  representativePhone: string | null;
  division: string | null;
  district: string | null;
  upazila: string | null;
  village: string | null;
  block: string | null;
  address: string | null;
  createdAt: string;
};

type InstitutionTableProps = {
  institutions: Institution[];
  loading: boolean;
  onView: (institution: Institution) => void;
  onEdit: (institution: Institution) => void;
  onDelete: (institution: Institution) => void;
};

export default function InstitutionTable({
  institutions,
  loading,
  onView,
  onEdit,
  onDelete,
}: InstitutionTableProps) {
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const distinctDistricts = useMemo(() => {
    const map = new Map<string, string>();
    institutions.forEach((inst) => {
      if (inst.district) map.set(inst.district, inst.district);
    });
    return Array.from(map.values());
  }, [institutions]);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((item) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesEiin = item.eiin.toLowerCase().includes(q);
        const matchesPrincipal = item.principal?.toLowerCase().includes(q);
        const matchesRep = item.representative?.toLowerCase().includes(q);
        const matchesDistrict = item.district?.toLowerCase().includes(q);
        const matchesUpazila = item.upazila?.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesEiin &&
          !matchesPrincipal &&
          !matchesRep &&
          !matchesDistrict &&
          !matchesUpazila
        ) {
          return false;
        }
      }

      if (districtFilter !== "all" && item.district !== districtFilter) {
        return false;
      }

      return true;
    });
  }, [institutions, search, districtFilter]);

  const hasActiveFilters = search.trim() !== "" || districtFilter !== "all";

  function clearFilters() {
    setSearch("");
    setDistrictFilter("all");
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredInstitutions.length / PAGE_SIZE));
  const pagedInstitutions = filteredInstitutions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleDistrictChange(value: string) {
    setDistrictFilter(value);
    setPage(1);
  }

  function getPageNumbers() {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by institution name, EIIN, district, representative..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {distinctDistricts.length > 0 && (
            <select
              value={districtFilter}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Districts (সকল জেলা)</option>
              {distinctDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table Results Count */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {filteredInstitutions.length === 0
              ? 0
              : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredInstitutions.length)}
          </strong>{" "}
          of {filteredInstitutions.length} institutions
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-medium">Filtered results</span>
        )}
      </div>

      {/* Table Container */}
      {loading && institutions.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          <div className="inline-flex size-9 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent mb-3" />
          <p className="text-sm">Loading institutions...</p>
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <School className="size-12 text-muted-foreground/30" />
          <h3 className="mt-4 text-base font-semibold">No institutions found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "No institutions match your search or filter criteria."
              : "No institutions have been created yet."}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4 gap-1.5"
            >
              <X className="size-3.5" /> Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Institution</th>
                  <th className="px-4 py-3.5 font-semibold">Address</th>
                  <th className="px-4 py-3.5 font-semibold">Principal (মোহতামিম)</th>
                  <th className="px-4 py-3.5 font-semibold">Representative (প্রতিনিধি)</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {pagedInstitutions.map((institution) => {
                  const locationParts = [
                    institution.upazila,
                    institution.district,
                    institution.division,
                  ].filter(Boolean);

                  return (
                    <tr
                      key={institution.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      {/* Name & EIIN */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">
                          {institution.name}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="font-mono text-[11px] font-medium"
                          >
                            EIIN: {institution.eiin}
                          </Badge>
                        </div>
                      </td>

                      {/* Location / Address */}
                      <td className="px-4 py-3.5">
                        {locationParts.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <MapPin className="size-3.5 shrink-0 text-primary" />
                            <span>{locationParts.join(", ")}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Address not set
                          </span>
                        )}
                        {institution.village && (
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            Village: {institution.village}
                            {institution.block ? `, Block: ${institution.block}` : ""}
                          </div>
                        )}
                      </td>

                      {/* Principal */}
                      <td className="px-4 py-3.5">
                        {institution.principal ? (
                          <div className="text-xs">
                            <p className="font-medium text-foreground">
                              {institution.principal}
                            </p>
                            {institution.principalPhone && (
                              <a
                                href={`tel:${institution.principalPhone}`}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                              >
                                <Phone className="size-2.5" />
                                {institution.principalPhone}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">—</span>
                        )}
                      </td>

                      {/* Representative */}
                      <td className="px-4 py-3.5">
                        {institution.representative ? (
                          <div className="text-xs">
                            <p className="font-medium text-foreground">
                              {institution.representative}
                            </p>
                            {institution.representativePhone && (
                              <a
                                href={`tel:${institution.representativePhone}`}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                              >
                                <Phone className="size-2.5" />
                                {institution.representativePhone}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(institution)}
                            title="View Details"
                            aria-label={`View ${institution.name}`}
                            className="size-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(institution)}
                            title="Edit"
                            aria-label={`Edit ${institution.name}`}
                            className="size-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(institution)}
                            title="Delete"
                            aria-label={`Delete ${institution.name}`}
                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers().map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={page === item}
                      onClick={(e) => { e.preventDefault(); setPage(item); }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        </>
      )}
    </div>
  );
}
