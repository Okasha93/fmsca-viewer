"use client";

import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import axios from "axios";
import * as XLSX from "xlsx";
import { Box, CircularProgress, Typography } from "@mui/material";

interface FMSCAData {
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
  id: number;
  credit_score: string;
  record_status: string;
}

const columns: GridColDef[] = [
  { field: "created_dt", headerName: "Created Date", width: 150 },
  { field: "data_source_modified_dt", headerName: "Modified Date", width: 150 },
  { field: "entity_type", headerName: "Entity Type", width: 150 },
  { field: "legal_name", headerName: "Legal Name", width: 200 },
  { field: "dba_name", headerName: "DBA Name", width: 200 },
  { field: "physical_address", headerName: "Physical Address", width: 300 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "usdot_number", headerName: "USDOT Number", width: 150 },
  { field: "power_units", headerName: "Power Units", width: 150 },
  { field: "mcs_150_form_date", headerName: "MCS-150 Form Date", width: 200 },
  { field: "drivers", headerName: "Drivers", width: 150 },
  {
    field: "mcs_150_mileage_year",
    headerName: "MCS-150 Mileage Year",
    width: 200,
  },
  { field: "credit_score", headerName: "Credit Score", width: 150 },
  { field: "record_status", headerName: "Record Status", width: 150 },
];

const Viewer = () => {
  const [rows, setRows] = useState<FMSCAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/fmsca_records.xlsx", {
          responseType: "arraybuffer",
        });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<FMSCAData>(sheet);
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        height: 750,
        width: "100%",
        bgcolor: "background.default",
        p: 5,
        boxShadow: 5,
        borderRadius: 2,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h2" gutterBottom>
            FMSCA Company
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            sx={{
              bgcolor: "white",
              "& .MuiDataGrid-cell": {
                color: "primary.main",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "secondary.main",
                color: "black",
              },
              borderRadius: "15px",
        marginBottom: "25px",

            }}
          />
        </>
      )}
    </Box>
  );
};

export default Viewer;
