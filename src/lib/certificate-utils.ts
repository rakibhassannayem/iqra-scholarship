export function toBengaliNumber(
  num: string | number | undefined | null,
): string {
  if (num === undefined || num === null) return "";
  const banglaDigits: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

export function toBengaliClass(classNum: number | string | undefined | null): string {
  if (classNum === undefined || classNum === null) return "";
  const num = Number(classNum);
  const classMap: Record<number, string> = {
    0: "নার্সারী",
    1: "প্রথম",
    2: "দ্বিতীয়",
    3: "তৃতীয়",
    4: "চতুর্থ",
    5: "পঞ্চম",
    6: "ষষ্ঠ",
    7: "সপ্তম",
    8: "অষ্টম",
    9: "নবম",
    10: "দশম",
  };
  return classMap[num] || `শ্রেণি ${toBengaliNumber(classNum)}`;
}

export function formatInstitutionLocation(inst: {
  name: string;
  address?: string | null;
  upazila?: string | null;
  district?: string | null;
}): string {
  const parts = [
    inst.name,
    inst.address || inst.upazila,
    inst.district,
  ].filter(Boolean);
  return parts.join(", ");
}
