import client from './client';
import type {
  ExpenseSummaryResponse,
  ExpenseDetailsResponse,
  AddExpenseRequest,
  UpdateExpenseRequest,
} from '../types';

export async function getGroupExpenses(groupId: string): Promise<ExpenseSummaryResponse[]> {
  const response = await client.get<ExpenseSummaryResponse[]>(
    `/api/expense/${groupId}/expenses`,
  );
  return response.data;
}

export async function getExpenseDetails(expenseId: string): Promise<ExpenseDetailsResponse> {
  const response = await client.get<ExpenseDetailsResponse>(`/api/expense/${expenseId}`);
  return response.data;
}

export async function addExpense(data: AddExpenseRequest): Promise<string> {
  const response = await client.post<string>('/api/expense', data);
  return response.data;
}

export async function updateExpense(
  expenseId: string,
  data: UpdateExpenseRequest,
): Promise<void> {
  await client.put(`/api/expense/${expenseId}`, data);
}

export async function deleteExpense(expenseId: string): Promise<void> {
  await client.delete(`/api/expense/${expenseId}`);
}
