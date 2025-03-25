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

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // In a real application, we would call the API
      // const response = await axios.get(\`\${process.env.REACT_APP_API_URL}/logs\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   },
      //   params: {
      //     level: filter.level !== 'all' ? filter.level : undefined,
      //     service: filter.service !== 'all' ? filter.service : undefined,
      //     startDate: filter.startDate || undefined,
      //     endDate: filter.endDate || undefined,
      //   }
      // });
      // setLogs(response.data);

      // For now, let's set mock data
      setLogs([
        {
          id: 1,
          timestamp: "2025-03-24T09:12:34Z",
          level: "INFO",
          message: "User johndoe logged in successfully",
          service: "auth",
          requestId: "req-123456",
          userId: 1,
        },
        {
          id: 2,
          timestamp: "2025-03-24T09:15:22Z",
          level: "ERROR",
          message: "Failed to process payment: Invalid card information",
          service: "payments",
          requestId: "req-123457",
          userId: 2,
        },
        {
          id: 3,
          timestamp: "2025-03-24T09:20:15Z",
          level: "INFO",
          message: "API request processed successfully",
          service: "humanize",
          requestId: "req-123458",
          userId: 1,
        },
        {
          id: 4,
          timestamp: "2025-03-24T09:25:02Z",
          level: "WARNING",
          message: "Rate limit approaching for user janedoe",
          service: "api-gateway",
          requestId: "req-123459",
          userId: 2,
        },
        {
          id: 5,
          timestamp: "2025-03-24T09:30:45Z",
          level: "ERROR",
          message: "Database connection failed",
          service: "database",
          requestId: "req-123460",
          userId: null,
        },
        {
          id: 6,
          timestamp: "2025-03-24T09:35:18Z",
          level: "INFO",
          message: "New user registered: bobsmith",
          service: "auth",
          requestId: "req-123461",
          userId: 3,
        },
        {
          id: 7,
          timestamp: "2025-03-24T09:40:27Z",
          level: "DEBUG",
          message: "Cache hit ratio: 0.78",
          service: "cache",
          requestId: "req-123462",
          userId: null,
        },
        {
          id: 8,
          timestamp: "2025-03-24T09:45:33Z",
          level: "INFO",
          message: "Scheduled task completed: cleanup-old-sessions",
          service: "scheduler",
          requestId: "req-123463",
          userId: null,
        },
        {
          id: 9,
          timestamp: "2025-03-24T09:50:16Z",
          level: "ERROR",
          message: "Failed to send email: SMTP connection timeout",
          service: "notifications",
          requestId: "req-123464",
          userId: 1,
        },
        {
          id: 10,
          timestamp: "2025-03-24T09:55:02Z",
          level: "WARNING",
          message: "API key about to expire for user johndoe",
          service: "api-gateway",
          requestId: "req-123465",
          userId: 1,
        },
      ]);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching logs:", err);
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
            color: \`\${colors.greenAccent[200]} !important\`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: \`\${colors.grey[100]} !important\`,
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