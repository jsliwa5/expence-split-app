import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getMyGroups, createGroup, joinGroup } from '../../src/api/groups';
import type { UserGroupResponse } from '../../src/types';
import { theme } from '../../src/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<UserGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [modalType, setModalType] = useState<'none' | 'create' | 'join'>('none');
  const [inputValue, setInputValue] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successCode, setSuccessCode] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getMyGroups();
      setGroups(data);
    } catch {
      setError('Failed to load groups.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalType('none');
    setInputValue('');
    setModalError('');
    setSuccessCode('');
  };

  const handleCreateGroup = async () => {
    if (!inputValue.trim()) {
      setModalError('Please enter a group name.');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const result = await createGroup(inputValue);
      setSuccessCode(result.joinCode);
      fetchGroups();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to create group.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!inputValue.trim()) {
      setModalError('Please enter a join code.');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      await joinGroup(inputValue);
      setSuccessCode('joined');
      fetchGroups();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to join group.');
    } finally {
      setModalLoading(false);
    }
  };

  const renderGroupItem = ({ item }: { item: UserGroupResponse }) => (
    <TouchableOpacity 
      style={styles.groupCard} 
      onPress={() => router.push(`/(app)/group/${item.groupId}`)}
    >
      <View style={styles.groupHeader}>
        <Text style={styles.groupIcon}>👥</Text>
        <Text style={styles.groupArrow}>→</Text>
      </View>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupCodeLabel}>Code: <Text style={styles.groupCode}>{item.joinCode}</Text></Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading your groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => setModalType('create')}>
          <Text style={styles.actionBtnTextPrimary}>＋ Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => setModalType('join')}>
          <Text style={styles.actionBtnTextSecondary}>🔗 Join Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.groupId}
        renderItem={renderGroupItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No groups yet</Text>
            <Text style={styles.emptyDesc}>Create a new group to start splitting expenses with friends, or join an existing group with a code.</Text>
          </View>
        }
      />

      <Modal visible={modalType !== 'none'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'create' ? 'Create Group' : 'Join Group'}
            </Text>

            {successCode ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={styles.successTitle}>
                  {modalType === 'create' ? 'Group Created!' : 'Joined Successfully!'}
                </Text>
                {modalType === 'create' && (
                  <>
                    <Text style={styles.successDesc}>Share this code with friends:</Text>
                    <Text style={styles.successCode}>{successCode}</Text>
                  </>
                )}
                <TouchableOpacity style={styles.modalBtnPrimary} onPress={closeModal}>
                  <Text style={styles.modalBtnTextPrimary}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {modalError ? <Text style={styles.error}>{modalError}</Text> : null}
                <Text style={styles.label}>
                  {modalType === 'create' ? 'Group Name' : 'Join Code'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={modalType === 'create' ? 'e.g., Trip to Hawaii' : 'Enter the group code'}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalBtnSecondary} onPress={closeModal}>
                    <Text style={styles.modalBtnTextSecondary}>Cancel</Text>
                  </TouchableOpacity>
                  <View style={{ width: theme.spacing.md }} />
                  <TouchableOpacity 
                    style={[styles.modalBtnPrimary, modalLoading && { opacity: 0.7 }]} 
                    onPress={modalType === 'create' ? handleCreateGroup : handleJoinGroup}
                    disabled={modalLoading}
                  >
                    {modalLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalBtnTextPrimary}>
                        {modalType === 'create' ? 'Create' : 'Join'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  error: {
    color: theme.colors.danger,
    margin: theme.spacing.md,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  actionBtnTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionBtnTextSecondary: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  groupCard: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
    marginBottom: theme.spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  groupIcon: {
    fontSize: 24,
  },
  groupArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  groupCodeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  groupCode: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptyDesc: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.bgSecondary,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontSize: 14,
  },
  input: {
    backgroundColor: theme.colors.bgPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
  },
  modalBtnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  modalBtnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  modalBtnTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBtnTextSecondary: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  successDesc: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  successCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: theme.spacing.lg,
  }
});
