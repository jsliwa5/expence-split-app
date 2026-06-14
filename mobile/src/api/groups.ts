import client from './client';
import type {
  UserGroupResponse,
  CreateGroupResponse,
  GroupMemberResponse,
  GroupSummaryResponse,
} from '../types';

export async function getMyGroups(): Promise<UserGroupResponse[]> {
  const response = await client.get<UserGroupResponse[]>('/api/group');
  return response.data;
}

export async function getGroupDetails(groupId: string): Promise<UserGroupResponse> {
  const response = await client.get<UserGroupResponse>(`/api/group/${groupId}`);
  return response.data;
}

export async function getGroupSummary(groupId: string): Promise<GroupSummaryResponse> {
  const response = await client.get<GroupSummaryResponse>(`/api/group/${groupId}/summary`);
  return response.data;
}

export async function getGroupMembers(groupId: string): Promise<GroupMemberResponse[]> {
  const response = await client.get<GroupMemberResponse[]>(`/api/group/${groupId}/members`);
  return response.data;
}

export async function createGroup(name: string): Promise<CreateGroupResponse> {
  const response = await client.post<CreateGroupResponse>('/api/group', { name });
  return response.data;
}

export async function joinGroup(joinCode: string): Promise<string> {
  const response = await client.post<string>('/api/group/join', { joinCode });
  return response.data;
}
