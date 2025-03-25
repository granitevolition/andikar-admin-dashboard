import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const initialValues = {
  name: "",
  permissions: ["humanize", "detect"],
  user_id: "",
};

const apiKeySchema = yup.object().shape({
  name: yup.string().required("Required"),
  permissions: yup.array().min(1, "At least one permission is required"),
  user_id: yup.string().required("Required"),
});

const ApiKeys = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [newApiKey, setNewApiKey] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewApiKey(null);
  };

  const handleOpenDeleteConfirm = (apiKey) => {
    setSelectedApiKey(apiKey);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSelectedApiKey(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const copyApiKeyToClipboard = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    setSnackbarMessage("API Key copied to clipboard");
    setSnackbarOpen(true);
  };

  useEffect(() => {
    fetchApiKeys();
    fetchUsers();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api-keys`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApiKeys(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setError("Failed to fetch API keys. Please try again.");
      setApiKeys([]);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const handleCreateApiKey = async (values, actions) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api-keys`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const newKeyData = response.data;
      setApiKeys([...apiKeys, newKeyData]);
      setNewApiKey(newKeyData.key);
      actions.resetForm();
    } catch (err) {
      console.error("Error creating API key:", err);
      setError("Failed to create API key. Please try again.");
    }
  };

  const handleDeleteApiKey = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api-keys/${selectedApiKey.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const updatedApiKeys = apiKeys.filter(key => key.id !== selectedApiKey.id);
      
      setApiKeys(updatedApiKeys);
      handleCloseDeleteConfirm();
      
      setSnackbarMessage("API Key deleted successfully");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting API key:", err);
      setError("Failed to delete API key. Please try again.");
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown";
  };

  const formatPermissions = (permissions) => {
    return (
      <Box display="flex" gap={0.5} flexWrap="wrap">
        {permissions.map((permission) => (
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
    );
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "key",
      headerName: "API Key",
      flex: 1.5,
      renderCell: ({ row: { key } }) => {
        return (
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>
              {key.substring(0, 8)}•••••••••••
            </Typography>
            <IconButton
              size="small"
              onClick={() => copyApiKeyToClipboard(key)}
              sx={{ p: 0.5 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "permissions",
      headerName: "Permissions",
      flex: 1.5,
      renderCell: ({ row: { permissions } }) => formatPermissions(permissions),
    },
    {
      field: "user_id",
      headerName: "User",
      flex: 1,
      valueGetter: (params) => getUserName(params.row.user_id),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === "active"
                ? colors.greenAccent[600]
                : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status === "active" ? "Active" : "Inactive"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "last_used",
      headerName: "Last Used",
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : "Never";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Box>
            <IconButton onClick={() => handleOpenDeleteConfirm(row)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="API KEYS" subtitle="Manage API Keys for your services" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={handleOpenDialog}
          startIcon={<AddIcon />}
        >
          Create API Key
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          rows={apiKeys}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
        />
      </Box>

      {/* Create API Key Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New API Key
        </DialogTitle>
        {newApiKey ? (
          <>
            <DialogContent>
              <Box mb={2}>
                <Typography variant="body1" gutterBottom>
                  Your new API key has been created:
                </Typography>
                <Box
                  bgcolor={colors.primary[400]}
                  p={2}
                  borderRadius={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography variant="h5" fontFamily="monospace">
                    {newApiKey}
                  </Typography>
                  <IconButton onClick={() => copyApiKeyToClipboard(newApiKey)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
                  Make sure to copy your API key now. You won't be able to see it again!
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary" variant="contained">
                Done
              </Button>
            </DialogActions>
          </>
        ) : (
          <Formik
            onSubmit={handleCreateApiKey}
            initialValues={initialValues}
            validationSchema={apiKeySchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  >
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      name="name"
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      select
                      label="User"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.user_id}
                      name="user_id"
                      error={!!touched.user_id && !!errors.user_id}
                      helperText={touched.user_id && errors.user_id}
                      SelectProps={{
                        native: true,
                      }}
                      sx={{ gridColumn: "span 4" }}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </TextField>
                    <Box sx={{ gridColumn: "span 4" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Permissions
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {["humanize", "detect", "payments"].map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            onClick={() => {
                              const currentPermissions = [...values.permissions];
                              if (currentPermissions.includes(permission)) {
                                setFieldValue(
                                  "permissions",
                                  currentPermissions.filter((p) => p !== permission)
                                );
                              } else {
                                setFieldValue("permissions", [...currentPermissions, permission]);
                              }
                            }}
                            color={values.permissions.includes(permission) ? "primary" : "default"}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                      {!!touched.permissions && !!errors.permissions && (
                        <Typography color="error" variant="caption">
                          {errors.permissions}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Create
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the API key "{selectedApiKey?.name}"? This action cannot be undone and any applications using this key will no longer be able to access the APIs.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            onClick={handleDeleteApiKey}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiKeys;