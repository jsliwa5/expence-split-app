// ── Auth ──────────────────────────────────────────────
export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  userId?: string;
  exp: number;
}

export interface User {
  email: string;
  token: string;
}

// ── Groups ────────────────────────────────────────────
export interface UserGroupResponse {
  groupId: string;
  name: string;
  joinCode: string;
}

export interface CreateGroupResponse {
  groupId: string;
  joinCode: string;
}

export interface GroupMemberResponse {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber?: string;
}

export interface DebtTransaction {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export interface GroupSummaryResponse {
  transactions: DebtTransaction[];
}

// ── Expenses ──────────────────────────────────────────
export interface ExpenseSummaryResponse {
  expenseId: string;
  payerId: string;
  description: string;
  totalAmount: number;
  createdAt: string;
}

export interface SplitDetails {
  debtorId: string;
  amount: number;
}

export interface ItemDetails {
  itemId: string;
  name: string;
  price: number;
  splits: SplitDetails[];
}

export interface ExpenseDetailsResponse {
  expenseId: string;
  groupId: string;
  payerId: string;
  description: string;
  totalAmount: number;
  createdAt: string;
  items: ItemDetails[];
}

export interface AddExpenseItem {
  name: string;
  price: number;
  splits: { debtorId: string; amount: number }[];
}

export interface AddExpenseRequest {
  groupId: string;
  description: string;
  totalAmount: number;
  items: AddExpenseItem[];
}

export interface UpdateExpenseRequest {
  description: string;
  totalAmount: number;
  items: AddExpenseItem[];
}
