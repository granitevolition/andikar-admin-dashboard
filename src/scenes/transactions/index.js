import { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "all",
    paymentMethod: "all",
    startDate: "",
    endDate: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    refunded: 0,
    pending: 0,
    daily: [],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // In a real application, we would call the API
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   params: {
      //     status: filter.status !== 'all' ? filter.status : undefined,
      //     paymentMethod: filter.paymentMethod !== 'all' ? filter.paymentMethod : undefined,
      //     startDate: filter.startDate || undefined,
      //     endDate: filter.endDate || undefined,
      //   }
      // });
      // setTransactions(response.data.transactions);
      // setStats(response.data.stats);

      // For now, let's set mock data
      const mockTransactions = [
        {
          id: "tx-001",
          amount: 49.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "credit_card",
          userId: 1,
          email: "john@example.com",
          description: "API Access - Premium Plan",
          createdAt: "2025-03-24T10:30:45Z",
          updatedAt: "2025-03-24T10:31:15Z",
        },
        {
          id: "tx-002",
          amount: 199.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "paypal",
          userId: 2,
          email: "jane@example.com",
          description: "API Access - Business Plan",
          createdAt: "2025-03-24T11:15:22Z",
          updatedAt: "2025-03-24T11:16:05Z",
        },
        {
          id: "tx-003",
          amount: 29.99,
          currency: "USD",
          status: "failed",
          paymentMethod: "credit_card",
          userId: 3,
          email: "bob@example.com",
          description: "API Access - Basic Plan",
          createdAt: "2025-03-24T12:05:33Z",
          updatedAt: "2025-03-24T12:05:45Z",
        },
        {
          id: "tx-004",
          amount: 99.99,
          currency: "USD",
          status: "pending",
          paymentMethod: "bank_transfer",
          userId: 4,
          email: "alice@example.com",
          description: "API Access - Standard Plan",
          createdAt: "2025-03-24T13:25:18Z",
          updatedAt: "2025-03-24T13:25:18Z",
        },
        {
          id: "tx-005",
          amount: 499.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "credit_card",
          userId: 5,
          email: "charlie@example.com",
          description: "API Access - Enterprise Plan",
          createdAt: "2025-03-24T14:10:05Z",
          updatedAt: "2025-03-24T14:10:45Z",
        },
        {
          id: "tx-006",
          amount: 29.99,
          currency: "USD",
          status: "refunded",
          paymentMethod: "paypal",
          userId: 6,
          email: "dave@example.com",
          description: "API Access - Basic Plan",
          createdAt: "2025-03-23T15:30:12Z",
          updatedAt: "2025-03-24T09:15:30Z",
        },
        {
          id: "tx-007",
          amount: 49.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "mobile_payment",
          userId: 7,
          email: "eve@example.com",
          description: "API Access - Premium Plan",
          createdAt: "2025-03-23T16:45:22Z",
          updatedAt: "2025-03-23T16:46:05Z",
        },
        {
          id: "tx-008",
          amount: 99.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "credit_card",
          userId: 8,
          email: "frank@example.com",
          description: "API Access - Standard Plan",
          createdAt: "2025-03-23T17:20:33Z",
          updatedAt: "2025-03-23T17:21:15Z",
        },
        {
          id: "tx-009",
          amount: 199.99,
          currency: "USD",
          status: "failed",
          paymentMethod: "bank_transfer",
          userId: 9,
          email: "grace@example.com",
          description: "API Access - Business Plan",
          createdAt: "2025-03-22T10:55:12Z",
          updatedAt: "2025-03-22T10:55:30Z",
        },
        {
          id: "tx-010",
          amount: 49.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "credit_card",
          userId: 10,
          email: "henry@example.com",
          description: "API Access - Premium Plan",
          createdAt: "2025-03-22T11:40:45Z",
          updatedAt: "2025-03-22T11:41:15Z",
        },
      ];

      const mockStats = {
        total: mockTransactions.length,
        successful: mockTransactions.filter(tx => tx.status === "successful").length,
        failed: mockTransactions.filter(tx => tx.status === "failed").length,
        refunded: mockTransactions.filter(tx => tx.status === "refunded").length,
        pending: mockTransactions.filter(tx => tx.status === "pending").length,
        daily: [
          { x: "2025-03-22", y: 2 },
          { x: "2025-03-23", y: 3 },
          { x: "2025-03-24", y: 5 },
        ],
      };

      setTransactions(mockTransactions);
      setStats(mockStats);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
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
    fetchTransactions();
  };

  const resetFilters = () => {
    setFilter({
      status: "all",
      paymentMethod: "all",
      startDate: "",
      endDate: "",
    });
    fetchTransactions();
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
        return colors.greenAccent[500];
      case "failed":
        return colors.redAccent[500];
      case "pending":
        return colors.blueAccent[300];
      case "refunded":
        return colors.grey[500];
      default:
        return colors.grey[100];
    }
  };

  const renderStatus = (params) => {
    const status = params.value;
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{
          backgroundColor: getStatusColor(status),
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      />
    );
  };

  const renderPaymentMethod = (params) => {
    const method = params.value;
    const label = method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return (
      <Chip
        label={label}
        size="small"
        variant="outlined"
        sx={{ borderColor: colors.grey[500] }}
      />
    );
  };

  const columns = [
    { field: "id", headerName: "Transaction ID", flex: 1.2 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => formatCurrency(params.value, params.row.currency),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: renderStatus,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1.2,
      renderCell: renderPaymentMethod,
    },
    { field: "email", headerName: "Customer", flex: 1.2 },
    { field: "description", headerName: "Description", flex: 1.5 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1.2,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString();
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TRANSACTIONS" subtitle="Payment Transaction History" />

      {/* Stats Cards */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        mb={3}
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" p={3} textAlign="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.greenAccent[500] }}>
              {stats.successful}
            </Typography>
            <Typography variant="body1">Successful Transactions</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" p={3} textAlign="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.redAccent[500] }}>
              {stats.failed}
            </Typography>
            <Typography variant="body1">Failed Transactions</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" p={3} textAlign="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.grey[500] }}>
              {stats.refunded}
            </Typography>
            <Typography variant="body1">Refunded Transactions</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" p={3} textAlign="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.blueAccent[300] }}>
              {stats.pending}
            </Typography>
            <Typography variant="body1">Pending Transactions</Typography>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box
        gridColumn="span 12"
        backgroundColor={colors.primary[400]}
        p={3}
        mb={3}
      >
        <Typography variant="h6" mb={1}>
          Daily Transaction Count
        </Typography>
        <Box height="300px">
          <ResponsiveLine
            data={[
              {
                id: "transactions",
                color: theme.palette.secondary.main,
                data: stats.daily,
              },
            ]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Date",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Transactions",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: colors.grey[100],
                  },
                },
                legend: {
                  text: {
                    fill: colors.grey[100],
                  },
                },
                ticks: {
                  line: {
                    stroke: colors.grey[100],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: colors.grey[100],
                  },
                },
              },
              legends: {
                text: {
                  fill: colors.grey[100],
                },
              },
              tooltip: {
                container: {
                  color: colors.primary[500],
                },
              },
            }}
          />
        </Box>
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
          label="Status"
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
          variant="filled"
          sx={{ gridColumn: "span 2" }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="successful">Successful</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="refunded">Refunded</MenuItem>
        </TextField>

        <TextField
          select
          label="Payment Method"
          name="paymentMethod"
          value={filter.paymentMethod}
          onChange={handleFilterChange}
          variant="filled"
          sx={{ gridColumn: "span 2" }}
        >
          <MenuItem value="all">All Methods</MenuItem>
          <MenuItem value="credit_card">Credit Card</MenuItem>
          <MenuItem value="paypal">PayPal</MenuItem>
          <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
          <MenuItem value="mobile_payment">Mobile Payment</MenuItem>
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

      {/* Transactions Table */}
      <Box
        height="60vh"
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
          rows={transactions}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          initialState={{
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Transactions;