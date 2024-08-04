"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";

/**
 * Interface representing the structure of FMCSA data.
 */
interface FMSCAData {
  id: number;
  created_dt: string;
  data_source_modified_dt: string;
  entity_type: string;
  operating_status?: string;
  legal_name: string;
  dba_name?: string;
  physical_address: string;
  phone: string;
  usdot_number: number;
  mc_mx_ff_number?: string;
  power_units: number;
  out_of_service_date?: string;
}

/**
 * DetailsPage Component
 * 
 * This component displays detailed information about a specific FMCSA record.
 * The record is fetched from a JSON file based on the ID passed via the URL.
 */
const DetailsPage = () => {
  const { id } = useParams() as { id: string }; // Typecasting to ensure `id` is of type string
  const [record, setRecord] = useState<FMSCAData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Function to fetch the specific FMCSA record based on the ID from the URL.
   */
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch("/FMSCA_records.json");
        const data: FMSCAData[] = await response.json();
        const recordData = data.find((item) => item.id === parseInt(id));
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
    <Box sx={{ p: 10, bgcolor: "#F3F4F6", borderRadius: 2, boxShadow: 5, fontSize: 24 }}>
      <Typography variant="h2" gutterBottom>
        {record.legal_name}
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
      {record.operating_status && (
        <Typography variant="h6" gutterBottom>
          <strong>Operating Status:</strong> {record.operating_status}
        </Typography>
      )}
      {record.dba_name && (
        <Typography variant="h6" gutterBottom>
          <strong>DBA Name:</strong> {record.dba_name}
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        <strong>Physical Address:</strong> {record.physical_address}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Phone:</strong> {record.phone}
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>USDOT Number:</strong> {record.usdot_number}
      </Typography>
      {record.mc_mx_ff_number && (
        <Typography variant="h6" gutterBottom>
          <strong>MC/MX/FF Number:</strong> {record.mc_mx_ff_number}
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        <strong>Power Units:</strong> {record.power_units}
      </Typography>
      {record.out_of_service_date && (
        <Typography variant="h6" gutterBottom>
          <strong>Out of Service Date:</strong> {record.out_of_service_date}
        </Typography>
      )}
    </Box>
  );
};

export default DetailsPage;
