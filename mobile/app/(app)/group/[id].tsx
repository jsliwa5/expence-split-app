import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getGroupDetails, getGroupMembers, getGroupSummary } from '../../../src/api/groups';
import { getGroupExpenses, deleteExpense } from '../../../src/api/expenses';
import type { UserGroupResponse, GroupMemberResponse, GroupSummaryResponse, ExpenseSummaryResponse } from '../../../src/types';
import { theme } from '../../../src/theme';

type Tab = 'expenses' | 'balances' | 'members';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<Tab>('expenses');
  const [group, setGroup] = useState<UserGroupResponse | null>(null);
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [summary, setSummary] = useState<GroupSummaryResponse | null>(null);
  const [expenses, setExpenses] = useState<ExpenseSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const names = useMemo(() => {
    const map: Record<string, string> = {};
    members.forEach(m => {
      const name = [m.firstName, m.lastName].filter(Boolean).join(' ');
      map[m.userId] = name || m.username;
    });
    return map;
  }, [members]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getGroupDetails(id),
      getGroupMembers(id),
      getGroupSummary(id),
      getGroupExpenses(id),
    ])
      .then(([g, m, s, e]) => {
        setGroup(g);
        setMembers(m);
        setSummary(s);
        setExpenses(e);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyCode = async () => {
    if (!group) return;
    await Clipboard.setStringAsync(group.joinCode);
    Alert.alert('Copied', 'Join code copied to clipboard!');
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          setDeletingId(expenseId);
          try {
            await deleteExpense(expenseId);
            setExpenses(prev => prev.filter(e => e.expenseId !== expenseId));
            if (id) {
              const s = await getGroupSummary(id);
              setSummary(s);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setDeletingId(null);
          }
        }
      }
    ]);
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)} PLN`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Group not found</Text>
      </View>
    );
  }

  const renderTabHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.groupName}>{group.name}</Text>
      <TouchableOpacity style={styles.codeContainer} onPress={handleCopyCode}>
        <Text style={styles.codeLabel}>Join Code: <Text style={styles.codeValue}>{group.joinCode}</Text> 📋</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => router.push(`/(app)/group/${id}/add-expense` as any)}
      >
        <Text style={styles.addBtnText}>＋ Add Expense</Text>
      </TouchableOpacity>

      <View style={styles.tabsContainer}>
        {(['expenses', 'balances', 'members'] as Tab[]).map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'expenses') {
      if (expenses.length === 0) {
        return <Text style={styles.emptyText}>No expenses yet.</Text>;
      }
      return expenses.map(expense => (
        <View key={expense.expenseId} style={styles.card}>
          <View style={styles.expenseMain}>
            <Text style={styles.expenseTitle}>{expense.description}</Text>
            <Text style={styles.expenseAmount}>{formatAmount(expense.totalAmount)}</Text>
          </View>
          <View style={styles.expenseSub}>
            <Text style={styles.expensePayer}>Paid by {names[expense.payerId] || 'Unknown'}</Text>
            <TouchableOpacity 
              onPress={() => handleDeleteExpense(expense.expenseId)}
              disabled={deletingId === expense.expenseId}
            >
              {deletingId === expense.expenseId ? (
                <ActivityIndicator size="small" color={theme.colors.danger} />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ));
    }

    if (activeTab === 'balances') {
      if (!summary || summary.transactions.length === 0) {
        return <Text style={styles.emptyText}>Everyone is settled up! 🎉</Text>;
      }
      return summary.transactions.map((t: any, i: number) => (
        <View key={i} style={styles.card}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceName}>{names[t.fromUserId] || 'Unknown'}</Text>
            <Text style={styles.balanceArrow}>→</Text>
            <Text style={styles.balanceAmount}>{formatAmount(t.amount)}</Text>
            <Text style={styles.balanceArrow}>→</Text>
            <Text style={styles.balanceName}>{names[t.toUserId] || 'Unknown'}</Text>
          </View>
        </View>
      ));
    }

    if (activeTab === 'members') {
      return members.map(m => (
        <View key={m.userId} style={styles.card}>
          <Text style={styles.memberName}>{[m.firstName, m.lastName].filter(Boolean).join(' ') || m.username}</Text>
          <Text style={styles.memberUsername}>@{m.username}</Text>
        </View>
      ));
    }
  };

  return (
    <FlatList
      data={[{ key: 'content' }]}
      renderItem={() => <View style={styles.contentContainer}>{renderContent()}</View>}
      ListHeaderComponent={renderTabHeader}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bgPrimary,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 16,
  },
  headerContainer: {
    padding: theme.spacing.lg,
  },
  groupName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  codeContainer: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
  },
  codeLabel: {
    color: theme.colors.textSecondary,
  },
  codeValue: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderInput,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.accent,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: theme.colors.accent,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
  },
  expenseMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  expenseSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expensePayer: {
    color: theme.colors.textSecondary,
  },
  deleteText: {
    color: theme.colors.danger,
    fontWeight: 'bold',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceName: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  balanceArrow: {
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm,
  },
  balanceAmount: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberName: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberUsername: {
    color: theme.colors.textSecondary,
  }
});
