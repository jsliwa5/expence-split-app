import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getGroupDetails,
  getGroupMembers,
  getGroupSummary,
} from "../../../src/api/groups";
import { getGroupExpenses, deleteExpense } from "../../../src/api/expenses";
import type {
  UserGroupResponse,
  GroupMemberResponse,
  GroupSummaryResponse,
  ExpenseSummaryResponse,
} from "../../../src/types";
import { theme } from "../../../src/theme";

type Tab = "expenses" | "balances" | "members";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("expenses");
  const [group, setGroup] = useState<UserGroupResponse | null>(null);
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [summary, setSummary] = useState<GroupSummaryResponse | null>(null);
  const [expenses, setExpenses] = useState<ExpenseSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const names = useMemo(() => {
    const map: Record<string, string> = {};
    members.forEach((m) => {
      const name = [m.firstName, m.lastName].filter(Boolean).join(" ");
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
    Alert.alert("Copied", "Join code copied to clipboard!");
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(expenseId);
            try {
              await deleteExpense(expenseId);
              setExpenses((prev) =>
                prev.filter((e) => e.expenseId !== expenseId),
              );
              if (id) {
                const s = await getGroupSummary(id);
                setSummary(s);
              }
            } catch (err) {
              console.error(err);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
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
        <Text style={styles.codeLabel}>
          Join Code: <Text style={styles.codeValue}>{group.joinCode}</Text> 📋
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push(`/(app)/group/${id}/add-expense` as any)}
      >
        <Text style={styles.addBtnText}>＋ Add Expense</Text>
      </TouchableOpacity>

      <View style={styles.tabsContainer}>
        {(["expenses", "balances", "members"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    if (activeTab === "expenses") {
      if (expenses.length === 0) {
        return <Text style={styles.emptyText}>No expenses yet.</Text>;
      }
      return expenses.map((expense) => (
        <View key={expense.expenseId} style={styles.card}>
          <View style={styles.expenseMain}>
            <Text style={styles.expenseTitle}>{expense.description}</Text>
            <Text style={styles.expenseAmount}>
              {formatAmount(expense.totalAmount)}
            </Text>
          </View>
          <View style={styles.expenseSub}>
            <Text style={styles.expensePayer}>
              Paid by {names[expense.payerId] || "Unknown"}
            </Text>
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

    if (activeTab === "balances") {
      if (!summary || summary.transactions.length === 0) {
        return <Text style={styles.emptyText}>Everyone is settled up! 🎉</Text>;
      }
      return summary.transactions.map((t: any, i: number) => (
        <View key={i} style={styles.card}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceTextContainer}>
              <Text style={styles.balanceDebtor} numberOfLines={1}>
                {names[t.fromUserId] || "Unknown"}
              </Text>
              <Text style={styles.balanceActionText}>owes</Text>
              <Text style={styles.balanceCreditor} numberOfLines={1}>
                {names[t.toUserId] || "Unknown"}
              </Text>
            </View>
            <Text style={styles.balanceAmount}>{formatAmount(t.amount)}</Text>
          </View>
        </View>
      ));
    }

    if (activeTab === "members") {
      return members.map((m) => (
        <View key={m.userId} style={styles.card}>
          <Text style={styles.memberName}>
            {[m.firstName, m.lastName].filter(Boolean).join(" ") || m.username}
          </Text>
          <Text style={styles.memberUsername}>@{m.username}</Text>
        </View>
      ));
    }
  };

  return (
    <FlatList
      data={[{ key: "content" }]}
      renderItem={() => (
        <View style={styles.contentContainer}>{renderContent()}</View>
      )}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bgPrimary,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: "500",
  },
  headerContainer: {
    padding: 24, // Zwiększony padding dla lepszego oddechu u góry
    paddingBottom: 0, // Zakładki muszą kleić się do dołu headera
  },
  groupName: {
    fontSize: 32, // Minimalnie większy i grubszy tytuł
    fontWeight: "900",
    color: theme.colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  codeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)", // Nowoczesne, dyskretne tło zamiast solidnej karty
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  codeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  codeValue: {
    color: theme.colors.accent,
    fontWeight: "800",
    letterSpacing: 1,
  },
  addBtn: {
    backgroundColor: theme.colors.accent,
    padding: 16,
    borderRadius: 14, // Zaokrąglony, wygodny do klikania przycisk główny
    alignItems: "center",
    marginBottom: 24,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)", // Subtelna linia na dole zakładek
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 3, // Grubsza linia podświetlenia aktywnej zakładki
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: theme.colors.accent,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontWeight: "600",
    fontSize: 15,
  },
  tabTextActive: {
    color: theme.colors.textPrimary, // Jasny tekst dla aktywnej zakładki
    fontWeight: "800",
  },
  contentContainer: {
    padding: 24,
    paddingTop: 20,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    // Usunięte ramki (borderWidth), głębia zrobiona natywnym cieniem
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  expenseMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    flex: 1, // Pozwala kwocie zawsze być po prawej
    marginRight: 10,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.textPrimary,
  },
  expenseSub: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  expensePayer: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  deleteText: {
    color: theme.colors.danger,
    fontWeight: "700",
    fontSize: 14,
    padding: 4, // Zwiększa pole kliknięcia dla wygody kciuka
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  balanceDebtor: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    maxWidth: "40%", // Blokuje tekst przed wejściem na słowo 'owes'
  },
  balanceActionText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginHorizontal: 6,
    fontStyle: "italic",
  },
  balanceCreditor: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    maxWidth: "40%",
  },
  balanceName: {
    color: theme.colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  balanceArrow: {
    color: theme.colors.textSecondary,
    marginHorizontal: 8,
    fontSize: 14,
  },
  balanceAmount: {
    color: "#10B981",
    fontWeight: "900",
    fontSize: 15,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  memberName: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  memberUsername: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
