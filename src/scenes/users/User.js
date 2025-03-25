import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const User = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [apiUsage, setApiUsage] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // In a real application, we would call the API
      // const userResponse = await axios.get(\`\${process.env.REACT_APP_API_URL}/users/\${id}\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });
      // setUser(userResponse.data);
      
      // const keysResponse = await axios.get(\`\${process.env.REACT_APP_API_URL}/api-keys?user_id=\${id}\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });
      // setApiKeys(keysResponse.data);
      
      // const transactionsResponse = await axios.get(\`\${process.env.REACT_APP_API_URL}/transactions?user_id=\${id}\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });
      // setTransactions(transactionsResponse.data);
      
      // const usageResponse = await axios.get(\`\${process.env.REACT_APP_API_URL}/api-usage?user_id=\${id}\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });
      // setApiUsage(usageResponse.data);

      // For now, let's set mock data
      setUser({
        id: parseInt(id),
        username: "johndoe",
        email: "john@example.com",
        full_name: "John Doe",
        is_active: true,
        role: "admin",
        created_at: "2025-01-15T09:30:00Z",
        last_login: "2025-03-24T14:22:15Z",
        api_quota: 10000,
        api_usage: 4256,
        profile: {
          company: "Acme Inc.",
          phone: "+1234567890",
          location: "New York, USA",
          bio: "Lead Developer at Acme Inc. specializing in AI and NLP.",
        }
      });

      setApiKeys([
        {
          id: 1,
          key: "andk_1abc123def456",
          name: "Production Key",
          permissions: ["humanize", "detect"],
          created_at: "2025-02-15T09:30:00Z",
          last_used: "2025-03-23T14:45:00Z",
          status: "active"
        },
        {
          id: 2,
          key: "andk_2xyz789uvw012",
          name: "Development Key",
          permissions: ["humanize"],
          created_at: "2025-02-20T11:15:00Z",
          last_used: "2025-03-24T08:30:00Z",
          status: "active"
        },
      ]);

      setTransactions([
        {
          id: "tx-001",
          amount: 49.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "credit_card",
          description: "API Access - Premium Plan",
          createdAt: "2025-03-15T10:30:45Z",
        },
        {
          id: "tx-002",
          amount: 49.99,
          currency: "USD",
          status: "successful",
          paymentMethod: "credit_card",
          description: "API Access - Premium Plan (Renewal)",
          createdAt: "2025-02-15T10:25:33Z",
        },
      ]);

      setApiUsage([
        {
          id: "usage_humanize",
          label: "Humanize API",
          value: 2850,
          color: "hsl(104, 70%, 50%)"
        },
        {
          id: "usage_detect",
          label: "Detect API",
          value: 1406,
          color: "hsl(162, 70%, 50%)"
        },
      ]);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data. Please try again.");
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    // Navigate to the edit form or open a modal
    navigate(`/users/${id}/edit`);
  };

  const handleStatusToggle = () => {
    const newStatus = !user.is_active;
    const action = newStatus ? "activate" : "deactivate";
    
    setConfirmDialog({
      open: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} this user? ${newStatus ? 'They will regain access to the system.' : 'They will lose access to the system.'}`,
      action: () => toggleUserStatus(newStatus),
    });
  };

  const handleDeleteClick = () => {
    setConfirmDialog({
      open: true,
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.",
      action: deleteUser,
    });
  };

  const toggleUserStatus = async (newStatus) => {
    try {
      // In a real application, we would call the API
      // await axios.patch(\`\${process.env.REACT_APP_API_URL}/users/\${id}\`, 
      //   { is_active: newStatus },
      //   {
      //     headers: {
      //       Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //     }
      //   }
      // );
      
      // For now, just update our local state
      setUser({
        ...user,
        is_active: newStatus
      });
      
      setConfirmDialog({ open: false, title: "", message: "", action: null });
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status. Please try again.");
    }
  };

  const deleteUser = async () => {
    try {
      // In a real application, we would call the API
      // await axios.delete(\`\${process.env.REACT_APP_API_URL}/users/\${id}\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });
      
      setConfirmDialog({ open: false, title: "", message: "", action: null });
      // Redirect back to users list
      navigate("/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const apiKeyColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    { 
      field: "key", 
      headerName: "API Key", 
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value.substring(0, 8)}•••••••••••
        </Typography>
      ),
    },
    { 
      field: "permissions", 
      headerName: "Permissions", 
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {params.value.map((permission) => (
            <Chip
              key={permission}
              label={permission}
              size="small"
              sx={{
                backgroundColor: 
                  permission === 'humanize' ? colors.greenAccent[600] :
                  permission === 'detect' ? colors.blueAccent[500] :
                  colors.redAccent[600],
                color: colors.grey[100]
              }}
            />
          ))}
        </Box>
      ),
    },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          size="small"
          sx={{
            backgroundColor: params.value === 'active' 
              ? colors.greenAccent[600]
              : colors.redAccent[600],
            color: colors.grey[100]
          }}
        />
      ),
    },
    { 
      field: "created_at", 
      headerName: "Created", 
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
    { 
      field: "last_used", 
      headerName: "Last Used", 
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
  ];

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: params.row.currency,
        }).format(params.value)
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          size="small"
          sx={{
            backgroundColor: 
              params.value === 'successful' ? colors.greenAccent[600] :
              params.value === 'failed' ? colors.redAccent[600] :
              params.value === 'pending' ? colors.blueAccent[300] :
              colors.grey[500],
            color: colors.grey[100]
          }}
        />
      ),
    },
    { field: "description", headerName: "Description", flex: 1.5 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="USER DETAILS" subtitle="View user information" />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button
          onClick={() => navigate("/users")}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate("/users")} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Header
            title="USER DETAILS"
            subtitle={`${user.username} - ${user.email}`}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEditClick}
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color={user.is_active ? "error" : "success"}
            onClick={handleStatusToggle}
            startIcon={user.is_active ? <BlockIcon /> : <CheckCircleIcon />}
            sx={{ mr: 1 }}
          >
            {user.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteClick}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* User Profile Card */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                mb={3}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: colors.greenAccent[500],
                    fontSize: "3rem",
                    mb: 2,
                  }}
                >
                  {user.full_name?.charAt(0) || user.username.charAt(0)}
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {user.full_name || user.username}
                </Typography>
                <Typography variant="body1" color={colors.grey[300]}>
                  {user.email}
                </Typography>
                <Chip
                  label={user.is_active ? "Active" : "Inactive"}
                  sx={{
                    backgroundColor: user.is_active ? colors.greenAccent[600] : colors.redAccent[600],
                    color: colors.grey[100],
                    mt: 1,
                  }}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem>
                  <ListItemText
                    primary="Username"
                    secondary={user.username}
                    primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                    secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Role"
                    secondary={user.role}
                    primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                    secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Joined"
                    secondary={formatDate(user.created_at)}
                    primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                    secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Login"
                    secondary={formatDate(user.last_login)}
                    primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                    secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                  />
                </ListItem>
                {user.profile?.company && (
                  <ListItem>
                    <ListItemText
                      primary="Company"
                      secondary={user.profile.company}
                      primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                      secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                    />
                  </ListItem>
                )}
                {user.profile?.location && (
                  <ListItem>
                    <ListItemText
                      primary="Location"
                      secondary={user.profile.location}
                      primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                      secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                    />
                  </ListItem>
                )}
                {user.profile?.phone && (
                  <ListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={user.profile.phone}
                      primaryTypographyProps={{ color: colors.grey[300], variant: "body2" }}
                      secondaryTypographyProps={{ color: colors.grey[100], variant: "body1" }}
                    />
                  </ListItem>
                )}
              </List>

              {user.profile?.bio && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color={colors.grey[300]}>
                    Bio
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {user.profile.bio}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: colors.primary[400], mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">API Usage</Typography>
                <Box>
                  <Typography variant="body2" color={colors.grey[300]}>
                    {user.api_usage} / {user.api_quota} requests
                  </Typography>
                  <Typography variant="body2" color={colors.greenAccent[500]}>
                    {Math.round((user.api_usage / user.api_quota) * 100)}% of quota used
                  </Typography>
                </Box>
              </Box>

              <Box display="flex">
                <Box flex="1" height="300px">
                  <ResponsivePie
                    data={apiUsage}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor={colors.grey[100]}
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: colors.grey[100],
                        itemDirection: "left-to-right",
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: "circle",
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemTextColor: colors.grey[100],
                            },
                          },
                        ],
                      },
                    ]}
                  />
                </Box>
                <Box
                  flex="1"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pl: 2,
                  }}
                >
                  <Typography variant="body1" mb={2}>
                    Current usage breakdown:
                  </Typography>
                  <List>
                    {apiUsage.map((item) => (
                      <ListItem key={item.id} disableGutters>
                        <Box
                          width={16}
                          height={16}
                          bgcolor={item.color}
                          borderRadius="50%"
                          mr={1}
                        />
                        <ListItemText
                          primary={`${item.label}: ${item.value} requests`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
              >
                <Tab label="API Keys" />
                <Tab label="Transactions" />
              </Tabs>

              {tabValue === 0 && (
                <Box
                  height="300px"
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
                  }}
                >
                  <DataGrid
                    rows={apiKeys}
                    columns={apiKeyColumns}
                    pageSize={5}
                    autoHeight
                  />
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box
                  height="300px"
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
                  }}
                >
                  <DataGrid
                    rows={transactions}
                    columns={transactionColumns}
                    pageSize={5}
                    autoHeight
                    getRowId={(row) => row.id}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={confirmDialog.action} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;