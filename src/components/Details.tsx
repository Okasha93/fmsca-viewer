"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import * as XLSX from "xlsx";
import { Box, Typography, CircularProgress } from "@mui/material";

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

const DetailsPage = () => {
  const { id } = useParams() as { id: string }; // Typecasting to ensure `id` is of type string
  const [record, setRecord] = useState<FMSCAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get("/fmsca_records.xlsx", {
          responseType: "arraybuffer",
        });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<FMSCAData>(sheet);
        const recordData = jsonData.find((item) => item.id === parseInt(id));
        setRecord(recordData || null);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={100}/>
      </Box>
    );
  }

  if (!record) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4">Record not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 5, bgcolor: "white", borderRadius: 2, boxShadow: 5, fontSize: 24 }}>
      <Typography variant="h2" gutterBottom>
        {record.legal_name} - Details
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Created Date:</strong> {record.created_dt}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Modified Date:</strong> {record.data_source_modified_dt}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Entity Type:</strong> {record.entity_type}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>DBA Name:</strong> {record.dba_name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Physical Address:</strong> {record.physical_address}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Phone:</strong> {record.phone}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>USDOT Number:</strong> {record.usdot_number}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Power Units:</strong> {record.power_units}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>MCS-150 Form Date:</strong> {record.mcs_150_form_date}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Drivers:</strong> {record.drivers}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>MCS-150 Mileage Year:</strong> {record.mcs_150_mileage_year}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Credit Score:</strong> {record.credit_score}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Record Status:</strong> {record.record_status}
      </Typography>
    </Box>
  );
};

export default DetailsPage;
