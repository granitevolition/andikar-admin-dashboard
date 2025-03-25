import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useTheme,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Alert
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const Logs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    level: "all",
    service: "all",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/logs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          level: filter.level !== 'all' ? filter.level : undefined,
          service: filter.service !== 'all' ? filter.service : undefined,
          startDate: filter.startDate || undefined,
          endDate: filter.endDate || undefined,
        }
      });
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch logs. Please try again.");
      setLogs([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  };

  const applyFilters = () => {
    fetchLogs();
  };

  const resetFilters = () => {
    setFilter({
      level: "all",
      service: "all",
      startDate: "",
      endDate: "",
    });
    fetchLogs();
  };

  const renderLogLevel = (params) => {
    const level = params.value;
    let color;
    
    switch(level) {
      case 'ERROR':
        color = colors.redAccent[500];
        break;
      case 'WARNING':
        color = colors.orangeAccent ? colors.orangeAccent[500] : '#FFA500';
        break;
      case 'INFO':
        color = colors.blueAccent[500];
        break;
      case 'DEBUG':
        color = colors.greenAccent[500];
        break;
      default:
        color = colors.grey[500];
    }
    
    return (
      <Chip 
        label={level} 
        size="small"
        sx={{ 
          backgroundColor: color,
          color: '#ffffff',
          fontWeight: 'bold'
        }}
      />
    );
  };

  const columns = [
    { 
      field: "timestamp", 
      headerName: "Timestamp", 
      flex: 1.5,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      }
    },
    { 
      field: "level", 
      headerName: "Level", 
      flex: 0.8,
      renderCell: renderLogLevel
    },
    { 
      field: "service", 
      headerName: "Service", 
      flex: 1,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          variant="outlined"
          sx={{ borderColor: colors.grey[500] }}
        />
      )
    },
    { field: "message", headerName: "Message", flex: 3 },
    { field: "requestId", headerName: "Request ID", flex: 1 },
    { 
      field: "userId", 
      headerName: "User ID", 
      flex: 0.8,
      valueFormatter: (params) => {
        return params.value || 'N/A';
      }
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="LOGS" subtitle="System and API Logs" />
        <IconButton onClick={fetchLogs}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        mb="20px"
      >
        <TextField
          select
          label="Log Level"
          name="level"
          value={filter.level}
          onChange={handleFilterChange}
          variant="filled"
          sx={{ gridColumn: "span 2" }}
        >
          <MenuItem value="all">All Levels</MenuItem>
          <MenuItem value="ERROR">Error</MenuItem>
          <MenuItem value="WARNING">Warning</MenuItem>
          <MenuItem value="INFO">Info</MenuItem>
          <MenuItem value="DEBUG">Debug</MenuItem>
        </TextField>

        <TextField
          select
          label="Service"
          name="service"
          value={filter.service}
          onChange={handleFilterChange}
          variant="filled"
          sx={{ gridColumn: "span 2" }}
        >
          <MenuItem value="all">All Services</MenuItem>
          <MenuItem value="auth">Auth</MenuItem>
          <MenuItem value="api-gateway">API Gateway</MenuItem>
          <MenuItem value="humanize">Humanize</MenuItem>
          <MenuItem value="detect">Detect</MenuItem>
          <MenuItem value="payments">Payments</MenuItem>
          <MenuItem value="database">Database</MenuItem>
          <MenuItem value="cache">Cache</MenuItem>
          <MenuItem value="scheduler">Scheduler</MenuItem>
          <MenuItem value="notifications">Notifications</MenuItem>
        </TextField>

        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={filter.startDate}
          onChange={handleFilterChange}
          variant="filled"
          InputLabelProps={{ shrink: true }}
          sx={{ gridColumn: "span 2" }}
        />

        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={filter.endDate}
          onChange={handleFilterChange}
          variant="filled"
          InputLabelProps={{ shrink: true }}
          sx={{ gridColumn: "span 2" }}
        />

        <Box sx={{ gridColumn: "span 4", display: "flex", gap: "10px" }}>
          <Button
            onClick={applyFilters}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
            }}
          >
            Apply Filters
          </Button>
          <Button
            onClick={resetFilters}
            variant="outlined"
            sx={{
              borderColor: colors.grey[400],
              color: colors.grey[100],
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {/* Logs Table */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={logs}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          initialState={{
            sorting: {
              sortModel: [{ field: 'timestamp', sort: 'desc' }],
            },
          }}
          getRowId={(row) => row.id || row.timestamp + row.message}
        />
      </Box>
    </Box>
  );
};

// Define an orange accent color that might not exist in the theme
const colors = tokens("dark");
colors.orangeAccent = {
  100: "#ffe0b2",
  200: "#ffcc80",
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  600: "#fb8c00",
  700: "#f57c00",
  800: "#ef6c00",
  900: "#e65100",
};

export default Logs;