"use client"

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import _ from 'lodash';

/**
 * Interface representing the structure of the FMCSA data.
 * Each object in the dataset will adhere to this structure.
 */
interface FMSCAData {
  id: number;
  entity_type: string;
  legal_name: string;
  power_units: number;
  operating_status?: string;
}

/**
 * PivotTable Component
 * 
 * This component is responsible for displaying a pivot table based on the FMCSA data.
 * It allows users to dynamically select the row field and value field to generate
 * different views of the data.
 */
const PivotTable = () => {
  // State to store the fetched data, pivoted data, and loading status.
  const [data, setData] = useState<FMSCAData[]>([]);
  const [pivotData, setPivotData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State to store the currently selected row field and value field for the pivot table.
  const [rowField, setRowField] = useState<string>("entity_type");
  const [valueField, setValueField] = useState<string>("power_units");

  /**
   * useEffect Hook
   * 
   * Fetches the data from the JSON file when the component mounts. Once the data is fetched,
   * it generates the initial pivot table using the default row field and value field.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/FMSCA_records.json");
        const data = await response.json();
        setData(data);
        generatePivotTable(data, rowField, valueField);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Generates a pivot table from the provided data based on the selected row field and value field.
   */
  const generatePivotTable = (data: FMSCAData[], rowField: string, valueField: string) => {
    const pivot = _.chain(data)
      .groupBy(rowField)
      .map((items, key) => ({
        [rowField]: key,
        total: _.sumBy(items, valueField as keyof FMSCAData),
        count: items.length, 
      }))
      .value();
    setPivotData(pivot);  
  };

  /**
   * Event handler for changing the row field in the pivot table.
   */
  const handleRowFieldChange = (event: SelectChangeEvent<string>) => {
    const selectedField = event.target.value as string;
    setRowField(selectedField);  
    generatePivotTable(data, selectedField, valueField); 
  };

  /**
   * Event handler for changing the value field in the pivot table.
   */
  const handleValueFieldChange = (event: SelectChangeEvent<string>) => {
    const selectedField = event.target.value as string;
    setValueField(selectedField); 
    generatePivotTable(data, rowField, selectedField);
  };

  // If data is still loading, display a loading spinner.
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={100} />
      </Box>
    );
  }

  return (
    <Box sx={{
      height: "90vh",
      width: "100%",
      bgcolor: "background.default",
      p: 3,
      boxShadow: 5,
      borderRadius: 3,
      overflow: "hidden",
    }}>
      <Typography variant="h2" gutterBottom>FMSCA - Pivot Table</Typography>
      <Box sx={{ display: "flex", gap: 3, mb: 3, mt: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Row Field</InputLabel>
          <Select value={rowField} onChange={handleRowFieldChange}>
            <MenuItem value="entity_type">Entity Type</MenuItem>
            <MenuItem value="operating_status">Operating Status</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Value Field</InputLabel>
          <Select value={valueField} onChange={handleValueFieldChange}>
            <MenuItem value="power_units">Power Units</MenuItem>
            <MenuItem value="drivers">Drivers</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{
        overflowY: "auto",
        maxHeight: "calc(100% - 80px)",
        overflowX: "auto",
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
        paddingBottom: 10,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>{rowField}</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Total</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {pivotData.map((row, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{row[rowField]}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{row.total}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default PivotTable;
