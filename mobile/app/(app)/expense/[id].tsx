import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getExpenseDetails } from "../../../src/api/expenses";
import { getGroupMembers } from "../../../src/api/groups";
import type { ExpenseDetailsResponse, GroupMemberResponse } from "../../../src/types";
import { theme } from "../../../src/theme";

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState<ExpenseDetailsResponse | null>(null);
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getExpenseDetails(id)
      .then((data) => {
        setExpense(data);
        return getGroupMembers(data.groupId);
      })
      .then((m) => {
        setMembers(m);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load expense details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const names = useMemo(() => {
    const map: Record<string, string> = {};
    members.forEach((m) => {
      const name = [m.firstName, m.lastName].filter(Boolean).join(" ");
      map[m.userId] = name || m.username;
    });
    return map;
  }, [members]);

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

  if (error || !expense) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Expense not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{expense.description}</Text>
        <Text style={styles.totalAmount}>{formatAmount(expense.totalAmount)}</Text>
        <Text style={styles.payerInfo}>
          Paid by <Text style={styles.payerName}>{names[expense.payerId] || "Unknown"}</Text>
        </Text>
        <Text style={styles.dateInfo}>
          {new Date(expense.createdAt).toLocaleDateString()} at {new Date(expense.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {expense.receiptUrl && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Receipt</Text>
          <Image source={{ uri: expense.receiptUrl }} style={styles.receiptImage} resizeMode="cover" />
        </View>
      )}

      <Text style={styles.itemsHeader}>Items</Text>

      {expense.items.map((item, index) => (
        <View key={item.itemId || index.toString()} style={styles.card}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatAmount(item.price)}</Text>
          </View>
          
          <View style={styles.splitsContainer}>
            <Text style={styles.splitsLabel}>Split between:</Text>
            {item.splits.map((split, sIdx) => (
              <View key={split.debtorId || sIdx.toString()} style={styles.splitRow}>
                <Text style={styles.splitName}>
                  {names[split.debtorId] || "Unknown"}
                </Text>
                <Text style={styles.splitAmount}>
                  {formatAmount(split.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  headerCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.colors.accent,
    marginBottom: 16,
  },
  payerInfo: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginBottom: 4,
  },
  payerName: {
    color: theme.colors.textPrimary,
    fontWeight: "bold",
  },
  dateInfo: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  receiptImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  itemsHeader: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.textPrimary,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    flex: 1,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.textPrimary,
  },
  splitsContainer: {
    marginTop: 4,
  },
  splitsLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  splitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  splitName: {
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  splitAmount: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
});
