"use client";

import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridFilterModel,
} from "@mui/x-data-grid";
import axios from "axios";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

/**
 * Interface representing the structure of FMCSA data.
 */
interface FMSCAData {
  created_dt: string;
  data_source_modified_dt: string;
  entity_type: string;
  operating_status: string;
  legal_name: string;
  dba_name: string;
  physical_address: string;
  phone: string;
  usdot_number: number;
  mc_mx_ff_number: number;
  power_units: number;
  out_of_service_date: string;
}

/**
 * Viewer Component
 * 
 * This component displays FMCSA records in a DataGrid with server-side pagination and filtering.
 * It fetches data from an API, handles caching, pagination, and prefetching of data.
 */

const Viewer = () => {
  const [rows, setRows] = useState<FMSCAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [cachedData, setCachedData] = useState<Record<string, FMSCAData[]>>({});
  const router = useRouter();

  const fetchPageData = async (page: number, filterColumn?: string, filterValue?: string) => {
    const cacheKey = `${page}-${filterColumn || ""}-${filterValue || ""}`;
    if (cachedData[cacheKey]) {
      return cachedData[cacheKey];
    }

    try {
      const response = await axios.get("/api/fmsca_records", {
        params: {
          page: page + 1,
          limit: paginationModel.pageSize,
          filterColumn,
          filterValue,
        },
      });
      setTotalRowCount(response.headers["x-total-count"]);
      const pageData = response.data;
      setCachedData((prev) => ({ ...prev, [cacheKey]: pageData }));
      return pageData;
    } catch (error) {
      console.error("Error fetching data", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const filterItem = filterModel.items[0];
      const data = await fetchPageData(
        paginationModel.page,
        filterItem?.field,
        filterItem?.value
      );
      setRows(data);
      setLoading(false);

      // Prefetch the next page's data
      const nextPage = paginationModel.page + 1;
      if (nextPage < Math.ceil(totalRowCount / paginationModel.pageSize)) {
        fetchPageData(nextPage, filterItem?.field, filterItem?.value);
      }
    };

    fetchData();
  }, [paginationModel, filterModel]);

  // Define the columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "created_dt", headerName: "Created_DT", width: 220 },
    {
      field: "data_source_modified_dt",
      headerName: "Modifed_DT",
      width: 220,
    },
    { field: "entity_type", headerName: "Entity", width: 150 },
    { field: "operating_status", headerName: "Operating status", width: 200 },
    { field: "legal_name", headerName: "Legal name", width: 200 },
    { field: "dba_name", headerName: "DBA name", width: 250 },
    { field: "physical_address", headerName: "Physical address", width: 300 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "usdot_number", headerName: "DOT", width: 150 },
    { field: "mc_mx_ff_number", headerName: "MC/MX/FF", width: 200 },
    { field: "power_units", headerName: "Power units", width: 150 },
    { field: "out_of_service_date", headerName: "Out of service date", width: 200 },
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
        borderRadius: 3,
        paddingBottom: 10,
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 2,
        }}
      >
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
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
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
