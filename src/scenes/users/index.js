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
  Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialValues = {
  username: "",
  email: "",
  full_name: "",
  password: "",
  is_active: true,
  role: "user",
};

const userSchema = yup.object().shape({
  username: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  full_name: yup.string(),
  password: yup.string().required("Required").min(6, "Password must be at least 6 characters"),
  is_active: yup.boolean(),
  role: yup.string(),
});

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleOpenDialog = (user = null) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteConfirm = (user) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
      setLoading(false);
    }
  };

  const handleCreateUser = async (values, actions) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUsers([...users, response.data]);
      setSuccessMessage("User created successfully");
      handleCloseDialog();
      actions.resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. " + (err.response?.data?.detail || "Please try again."));
    }
  };

  const handleUpdateUser = async (values, actions) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/${selectedUser.id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? response.data : user
      );
      
      setUsers(updatedUsers);
      setSuccessMessage("User updated successfully");
      handleCloseDialog();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. " + (err.response?.data?.detail || "Please try again."));
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      
      setUsers(updatedUsers);
      setSuccessMessage("User deleted successfully");
      handleCloseDeleteConfirm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. " + (err.response?.data?.detail || "Please try again."));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "full_name", headerName: "Full Name", flex: 1 },
    {
      field: "is_active",
      headerName: "Status",
      flex: 0.5,
      renderCell: ({ row: { is_active } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              is_active
                ? colors.greenAccent[600]
                : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {is_active ? "Active" : "Inactive"}
            </Typography>
          </Box>
        );
      },
    },
    { field: "role", headerName: "Role", flex: 0.5 },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton onClick={() => navigate(`/users/${row.id}`)}>
              <Typography color={colors.grey[100]} sx={{ ml: "5px", mr: "5px" }}>
                View
              </Typography>
            </IconButton>
            <IconButton onClick={() => handleOpenDialog(row)}>
              <EditIcon />
            </IconButton>
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
        <Header title="USERS" subtitle="Managing the Users" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
          onClick={() => handleOpenDialog()}
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {successMessage}
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
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
        />
      </Box>

      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <Formik
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          initialValues={selectedUser || initialValues}
          validationSchema={userSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
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
                    label="Username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Full Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.full_name}
                    name="full_name"
                    error={!!touched.full_name && !!errors.full_name}
                    helperText={touched.full_name && errors.full_name}
                    sx={{ gridColumn: "span 4" }}
                  />
                  {!selectedUser && (
                    <TextField
                      fullWidth
                      variant="filled"
                      type="password"
                      label="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />
                  )}
                  <TextField
                    fullWidth
                    variant="filled"
                    select
                    label="Role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.role}
                    name="role"
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ gridColumn: "span 2" }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    select
                    label="Status"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.is_active}
                    name="is_active"
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ gridColumn: "span 2" }}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </TextField>
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
                  {selectedUser ? "Update" : "Create"}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.username}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;