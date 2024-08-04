"use client";

import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "axios";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

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

const Viewer = () => {
  const [rows, setRows] = useState<FMSCAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [cachedData, setCachedData] = useState<Record<number, FMSCAData[]>>({});
  const router = useRouter();

  const fetchPageData = async (page: number) => {
    if (cachedData[page]) {
      // Return cached data if available
      return cachedData[page];
    }

    try {
      const response = await axios.get(`/api/fmsca_records?page=${page + 1}&limit=${paginationModel.pageSize}`);
      setTotalRowCount(response.headers['x-total-count']);
      const pageData = response.data;
      setCachedData((prev) => ({ ...prev, [page]: pageData }));
      return pageData;
    } catch (error) {
      console.error("Error fetching data", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchPageData(paginationModel.page);
      setRows(data);
      setLoading(false);

      // Prefetch the next page's data
      const nextPage = paginationModel.page + 1;
      if (nextPage < Math.ceil(totalRowCount / paginationModel.pageSize)) {
        fetchPageData(nextPage);
      }
    };

    fetchData();
  }, [paginationModel]);

  const columns: GridColDef[] = [
    { field: "created_dt", headerName: "Created Date", width: 200 },
    { field: "data_source_modified_dt", headerName: "Modified Date", width: 200 },
    { field: "entity_type", headerName: "Entity Type", width: 150 },
    { field: "legal_name", headerName: "Legal Name", width: 200 },
    { field: "dba_name", headerName: "DBA Name", width: 250 },
    { field: "physical_address", headerName: "Physical Address", width: 300 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "usdot_number", headerName: "USDOT Number", width: 150 },
    { field: "power_units", headerName: "Power Units", width: 150 },
    { field: "mcs_150_form_date", headerName: "MCS-150 Form Date", width: 200 },
    { field: "drivers", headerName: "Drivers", width: 100 },
    { field: "mcs_150_mileage_year", headerName: "MCS-150 Mileage Year", width: 200 },
    { field: "credit_score", headerName: "Credit Score", width: 150 },
    { field: "record_status", headerName: "Record Status", width: 150 },
    {
      field: "details",
      headerName: "Details",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(`/details/${params.row.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 770,
        width: "100%",
        bgcolor: "background.default",
        p: 5,
        boxShadow: 5,
        borderRadius: 2,
        paddingBottom: 10,
      }}
    >
      <Typography variant="h2" gutterBottom>
        FMSCA Records
      </Typography>
      <Box sx={{ position: "relative", height: "100%" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalRowCount}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          sx={{
            bgcolor: "white",
            borderRadius: "10px",
            marginBottom: "25px",
            fontSize: "1.1rem",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#E0E0E0",
              color: "black",
              fontWeight: "bold",
              fontSize: "1.3rem",
              padding: "8px",
            },
            "& .MuiDataGrid-cell": {
              color: "primary.main",
              borderBottom: "1px solid #E0E0E0",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "#F3F4F6",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              bgcolor: "#F9FAFB",
            },
            "& .MuiDataGrid-footerContainer": {
              bgcolor: "white",
              borderTop: "1px solid #E0E0E0",
              justifyContent: "center",
              "& .MuiTablePagination-root": {
                fontSize: "0.875rem",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Viewer;
