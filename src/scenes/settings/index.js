import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  useTheme,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const initialSystemSettings = {
  apiBaseUrl: "https://web-production-a617.up.railway.app",
  rateLimitPerMinute: 60,
  maxUsersPerAccount: 10,
  enablePublicRegistration: true,
  enableAuditLogs: true,
  systemMaintenanceMode: false,
  smtpServer: "smtp.example.com",
  smtpPort: 587,
  smtpUsername: "notifications@andikar.com",
  smtpPassword: "password123",
  adminEmail: "admin@andikar.com",
};

const settingsSchema = yup.object().shape({
  apiBaseUrl: yup.string().url("Must be a valid URL").required("Required"),
  rateLimitPerMinute: yup.number().positive("Must be positive").required("Required"),
  maxUsersPerAccount: yup.number().positive("Must be positive").integer("Must be an integer").required("Required"),
  enablePublicRegistration: yup.boolean(),
  enableAuditLogs: yup.boolean(),
  systemMaintenanceMode: yup.boolean(),
  smtpServer: yup.string().required("Required"),
  smtpPort: yup.number().positive("Must be positive").integer("Must be an integer").required("Required"),
  smtpUsername: yup.string().email("Must be a valid email").required("Required"),
  smtpPassword: yup.string().required("Required"),
  adminEmail: yup.string().email("Must be a valid email").required("Required"),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Required"),
});

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    smtpPassword: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // In a real application, we would call the API
      // const response = await axios.get(\`\${process.env.REACT_APP_API_URL}/settings\`, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });
      // setSystemSettings(response.data);

      // For demo, we'll just use the initial settings
      setSystemSettings(initialSystemSettings);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setSnackbarMessage("Failed to fetch settings");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const handleSystemSettingsSave = async (values) => {
    try {
      // In a real application, we would call the API
      // await axios.put(\`\${process.env.REACT_APP_API_URL}/settings\`, values, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });

      // For demo purposes, we'll just update our local state
      setSystemSettings(values);
      setSnackbarMessage("Settings saved successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Error saving settings:", err);
      setSnackbarMessage("Failed to save settings");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handlePasswordChange = async (values, { resetForm }) => {
    try {
      // In a real application, we would call the API
      // await axios.put(\`\${process.env.REACT_APP_API_URL}/auth/change-password\`, {
      //   currentPassword: values.currentPassword,
      //   newPassword: values.newPassword
      // }, {
      //   headers: {
      //     Authorization: \`Bearer \${localStorage.getItem('token')}\`
      //   }
      // });

      resetForm();
      setSnackbarMessage("Password changed successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Error changing password:", err);
      setSnackbarMessage("Failed to change password");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <Box m="20px">
      <Header title="SETTINGS" subtitle="Manage Application Settings" />

      <Grid container spacing={3}>
        {/* System Settings */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ bgcolor: colors.primary[400], mb: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                System Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Formik
                onSubmit={handleSystemSettingsSave}
                initialValues={systemSettings}
                validationSchema={settingsSchema}
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
                    <Box
                      display="grid"
                      gap="30px"
                      gridTemplateColumns="repeat(12, 1fr)"
                    >
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="API Base URL"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.apiBaseUrl}
                        name="apiBaseUrl"
                        error={!!touched.apiBaseUrl && !!errors.apiBaseUrl}
                        helperText={touched.apiBaseUrl && errors.apiBaseUrl}
                        sx={{ gridColumn: "span 12" }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="Rate Limit (per minute)"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.rateLimitPerMinute}
                        name="rateLimitPerMinute"
                        error={
                          !!touched.rateLimitPerMinute &&
                          !!errors.rateLimitPerMinute
                        }
                        helperText={
                          touched.rateLimitPerMinute &&
                          errors.rateLimitPerMinute
                        }
                        sx={{ gridColumn: "span 6" }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="Max Users Per Account"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.maxUsersPerAccount}
                        name="maxUsersPerAccount"
                        error={
                          !!touched.maxUsersPerAccount &&
                          !!errors.maxUsersPerAccount
                        }
                        helperText={
                          touched.maxUsersPerAccount &&
                          errors.maxUsersPerAccount
                        }
                        sx={{ gridColumn: "span 6" }}
                      />

                      <Box
                        sx={{
                          gridColumn: "span 12",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={values.enablePublicRegistration}
                              onChange={handleChange}
                              name="enablePublicRegistration"
                              color="secondary"
                            />
                          }
                          label="Enable Public Registration"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={values.enableAuditLogs}
                              onChange={handleChange}
                              name="enableAuditLogs"
                              color="secondary"
                            />
                          }
                          label="Enable Audit Logs"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={values.systemMaintenanceMode}
                              onChange={handleChange}
                              name="systemMaintenanceMode"
                              color="secondary"
                            />
                          }
                          label="System Maintenance Mode"
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{ gridColumn: "span 12", mt: 2 }}
                      >
                        SMTP Settings
                      </Typography>

                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="SMTP Server"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.smtpServer}
                        name="smtpServer"
                        error={!!touched.smtpServer && !!errors.smtpServer}
                        helperText={touched.smtpServer && errors.smtpServer}
                        sx={{ gridColumn: "span 8" }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="number"
                        label="SMTP Port"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.smtpPort}
                        name="smtpPort"
                        error={!!touched.smtpPort && !!errors.smtpPort}
                        helperText={touched.smtpPort && errors.smtpPort}
                        sx={{ gridColumn: "span 4" }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="SMTP Username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.smtpUsername}
                        name="smtpUsername"
                        error={!!touched.smtpUsername && !!errors.smtpUsername}
                        helperText={
                          touched.smtpUsername && errors.smtpUsername
                        }
                        sx={{ gridColumn: "span 6" }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type={showPassword.smtpPassword ? "text" : "password"}
                        label="SMTP Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.smtpPassword}
                        name="smtpPassword"
                        error={
                          !!touched.smtpPassword && !!errors.smtpPassword
                        }
                        helperText={
                          touched.smtpPassword && errors.smtpPassword
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  toggleShowPassword("smtpPassword")
                                }
                                edge="end"
                              >
                                {showPassword.smtpPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ gridColumn: "span 6" }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Admin Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.adminEmail}
                        name="adminEmail"
                        error={!!touched.adminEmail && !!errors.adminEmail}
                        helperText={touched.adminEmail && errors.adminEmail}
                        sx={{ gridColumn: "span 12" }}
                      />
                    </Box>

                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={<SaveIcon />}
                      >
                        Save Settings
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Change */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ bgcolor: colors.primary[400], height: "100%" }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Formik
                onSubmit={handlePasswordChange}
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={passwordSchema}
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
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="20px"
                    >
                      <TextField
                        fullWidth
                        variant="filled"
                        type={showPassword.currentPassword ? "text" : "password"}
                        label="Current Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.currentPassword}
                        name="currentPassword"
                        error={
                          !!touched.currentPassword && !!errors.currentPassword
                        }
                        helperText={
                          touched.currentPassword && errors.currentPassword
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  toggleShowPassword("currentPassword")
                                }
                                edge="end"
                              >
                                {showPassword.currentPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type={showPassword.newPassword ? "text" : "password"}
                        label="New Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.newPassword}
                        name="newPassword"
                        error={!!touched.newPassword && !!errors.newPassword}
                        helperText={touched.newPassword && errors.newPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  toggleShowPassword("newPassword")
                                }
                                edge="end"
                              >
                                {showPassword.newPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        variant="filled"
                        type={showPassword.confirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.confirmPassword}
                        name="confirmPassword"
                        error={
                          !!touched.confirmPassword && !!errors.confirmPassword
                        }
                        helperText={
                          touched.confirmPassword && errors.confirmPassword
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  toggleShowPassword("confirmPassword")
                                }
                                edge="end"
                              >
                                {showPassword.confirmPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Box display="flex" justifyContent="end" mt="20px">
                        <Button
                          type="submit"
                          color="secondary"
                          variant="contained"
                          disabled={isSubmitting}
                        >
                          Change Password
                        </Button>
                      </Box>
                    </Box>
                  </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;