import { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import { resolve } from "path";
import { readFileSync } from "fs";

/**
 * Interface representing the structure of FMCSA data.
 */
interface FMSCAData {
  id: number;
  created_dt: string;
  data_source_modified_dt: string;
  entity_type: string;
  legal_name: string;
  dba_name: string;
  physical_address: string;
  phone: string;
  usdot_number: number;
  power_units: number;
  mcs_150_form_date: string | number;
  drivers: number;
  mcs_150_mileage_year: string;
  credit_score: string;
  record_status: string;
}

// Function to handle the API request
const getFmscaRecords = async (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, limit = 10, filterColumn, filterValue } = req.query;

  try {
    // Resolve the path to the file in the public directory
    const filePath = resolve("./public/FMSCA_records.xlsx");

    // Read the file directly from the filesystem
    const data = readFileSync(filePath);
    const workbook = XLSX.read(data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<FMSCAData>(sheet);

    // Apply filtering on the full dataset
    const filteredData = filterColumn && filterValue
      ? jsonData.filter((row) =>
          row[filterColumn as keyof FMSCAData]
            ?.toString()
            .toLowerCase()
            .includes((filterValue as string).toLowerCase())
        )
      : jsonData;

    const totalCount = filteredData.length;
    const start = (parseInt(page as string) - 1) * parseInt(limit as string);
    const end = start + parseInt(limit as string);
    const paginatedData = filteredData.slice(start, end);

    res.setHeader("x-total-count", totalCount.toString()); // Set the total count in headers
    res.status(200).json(paginatedData);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// Export the function as default
export default getFmscaRecords;
