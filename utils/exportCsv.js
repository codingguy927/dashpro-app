// utils/exportCsv.js
export function toCsv(rows) {
  if (!rows.length) return null;

  // 1) Build the raw CSV string
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),  
    ...rows.map((r) =>
      headers
        .map((h) => {
          const cell = r[h] == null ? "" : String(r[h]);
          return `"${cell.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];
  const csv = csvLines.join("\n");

  // 2) Create a Blob and attach a text() helper
  const blob = new Blob([csv], { type: "text/csv" });
  blob.text = () => Promise.resolve(csv);

  return blob;
}
