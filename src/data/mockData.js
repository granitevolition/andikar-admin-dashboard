// Mock data for development and testing

export const mockTransactions = [
  {
    txId: "tx-001",
    user: "johndoe",
    date: "2025-03-24",
    cost: "43.95",
  },
  {
    txId: "tx-002",
    user: "janedoe",
    date: "2025-03-23",
    cost: "133.45",
  },
  {
    txId: "tx-003",
    user: "absmith",
    date: "2025-03-23",
    cost: "52.35",
  },
  {
    txId: "tx-004",
    user: "tmiller",
    date: "2025-03-22",
    cost: "21.55",
  },
  {
    txId: "tx-005",
    user: "bwilson",
    date: "2025-03-21",
    cost: "300.90",
  },
  {
    txId: "tx-006",
    user: "jmoore",
    date: "2025-03-20",
    cost: "43.95",
  },
  {
    txId: "tx-007",
    user: "ctaylor",
    date: "2025-03-20",
    cost: "110.95",
  },
];

export const mockApiData = [
  {
    id: "humanize",
    color: "hsl(104, 70%, 50%)",
    data: [
      { x: "Jan", y: 1200 },
      { x: "Feb", y: 1500 },
      { x: "Mar", y: 1800 },
      { x: "Apr", y: 2100 },
      { x: "May", y: 2400 },
      { x: "Jun", y: 2700 },
      { x: "Jul", y: 3000 },
    ],
  },
  {
    id: "detect",
    color: "hsl(291, 70%, 50%)",
    data: [
      { x: "Jan", y: 800 },
      { x: "Feb", y: 1000 },
      { x: "Mar", y: 1300 },
      { x: "Apr", y: 1500 },
      { x: "May", y: 1700 },
      { x: "Jun", y: 2000 },
      { x: "Jul", y: 2300 },
    ],
  },
];

export const mockUsers = [
  {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    full_name: "John Doe",
    is_active: true,
    role: "admin",
    created_at: "2025-01-15T09:30:00Z"
  },
  {
    id: 2,
    username: "janedoe",
    email: "jane@example.com",
    full_name: "Jane Doe",
    is_active: true,
    role: "user",
    created_at: "2025-01-20T10:15:00Z"
  },
  {
    id: 3,
    username: "bobsmith",
    email: "bob@example.com",
    full_name: "Bob Smith",
    is_active: false,
    role: "user",
    created_at: "2025-02-05T14:25:00Z"
  },
];

export const mockApiKeys = [
  {
    id: 1,
    key: "andk_1abc123def456",
    name: "Production Key",
    permissions: ["humanize", "detect"],
    user_id: 1,
    created_at: "2025-02-15T09:30:00Z",
    last_used: "2025-03-23T14:45:00Z",
    status: "active"
  },
  {
    id: 2,
    key: "andk_2xyz789uvw012",
    name: "Development Key",
    permissions: ["humanize"],
    user_id: 1,
    created_at: "2025-02-20T11:15:00Z",
    last_used: "2025-03-24T08:30:00Z",
    status: "active"
  },
  {
    id: 3,
    key: "andk_3pqr456stu789",
    name: "Test Key",
    permissions: ["detect", "humanize", "payments"],
    user_id: 2,
    created_at: "2025-03-01T16:20:00Z",
    last_used: null,
    status: "inactive"
  },
];

export const mockLogs = [
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
  }
];

export const mockTransactionData = [
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
  }
];