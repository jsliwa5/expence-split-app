import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getGroupMembers } from '../../../../src/api/groups';
import { addExpense } from '../../../../src/api/expenses';
import type { GroupMemberResponse, AddExpenseRequest } from '../../../../src/types';
import { theme } from '../../../../src/theme';

type SplitState = {
  selected: boolean;
  amount: string;
};

type ItemState = {
  id: string;
  name: string;
  price: string;
  splits: Record<string, SplitState>;
};

export default function AddExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [items, setItems] = useState<ItemState[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getGroupMembers(id)
      .then((m: any) => {
        setMembers(m);
        setItems([{
          id: Math.random().toString(),
          name: '',
          price: '',
          splits: initializeSplits(m)
        }]);
      })
      .catch((err: any) => setError(err.response?.data?.message || 'Error loading members'))
      .finally(() => setLoading(false));
  }, [id]);

  const initializeSplits = (membersList: GroupMemberResponse[]): Record<string, SplitState> => {
    const splits: Record<string, SplitState> = {};
    membersList.forEach(m => {
      splits[m.userId] = { selected: true, amount: '' };
    });
    return splits;
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        name: '',
        price: '',
        splits: initializeSplits(members)
      }
    ]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleItemChange = (itemId: string, field: keyof ItemState, value: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleSplitChange = (itemId: string, debtorId: string, field: keyof SplitState, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        splits: {
          ...item.splits,
          [debtorId]: {
            ...item.splits[debtorId],
            [field]: value
          }
        }
      };
    }));
  };

  const handleSplitEqually = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const price = parseFloat(item.price) || 0;
      const selectedDebtors = Object.entries(item.splits)
        .filter(([_, split]) => split.selected)
        .map(([debtorId]) => debtorId);
      
      if (selectedDebtors.length === 0) return item;

      const splitAmount = Math.floor((price / selectedDebtors.length) * 100) / 100;
      const remainder = Math.round((price - splitAmount * selectedDebtors.length) * 100) / 100;

      const newSplits = { ...item.splits };
      selectedDebtors.forEach((debtorId, index) => {
        newSplits[debtorId] = {
          ...newSplits[debtorId],
          amount: (splitAmount + (index === 0 ? remainder : 0)).toFixed(2)
        };
      });

      return { ...item, splits: newSplits };
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  };

  const validate = (): boolean => {
    if (!description.trim()) {
      setError('Please enter a description.');
      return false;
    }
    if (items.length === 0) {
      setError('Add at least one item.');
      return false;
    }
    
    for (const item of items) {
      if (!item.name.trim()) {
        setError('Each item must have a name.');
        return false;
      }
      const price = parseFloat(item.price);
      if (isNaN(price) || price <= 0) {
        setError(`Invalid price for item "${item.name}".`);
        return false;
      }
      
      const splitsSum = Object.values(item.splits).reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
      if (Math.abs(splitsSum - price) > 0.01) {
        setError(`Splits sum (${splitsSum.toFixed(2)}) does not match price (${price.toFixed(2)}) for "${item.name}". Use "Split Equally" or adjust manually.`);
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || !id) return;

    setSubmitting(true);
    
    const requestData: AddExpenseRequest = {
      groupId: id,
      description,
      totalAmount: calculateTotal(),
      items: items.map(item => ({
        name: item.name,
        price: parseFloat(item.price),
        splits: Object.entries(item.splits)
          .filter(([_, split]) => split.selected && parseFloat(split.amount) > 0)
          .map(([debtorId, split]) => ({
            debtorId,
            amount: parseFloat(split.amount)
          }))
      }))
    };

    try {
      await addExpense(requestData);
      router.back();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Groceries, Dinner"
          placeholderTextColor={theme.colors.textSecondary}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.itemsHeader}>
        <Text style={styles.itemsTitle}>Items</Text>
        <TouchableOpacity style={styles.addBtnSmall} onPress={handleAddItem}>
          <Text style={styles.addBtnTextSmall}>＋ Add Item</Text>
        </TouchableOpacity>
      </View>

      {items.map((item, index) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Item #{index + 1}</Text>
            {items.length > 1 && (
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Pizza"
                placeholderTextColor={theme.colors.textSecondary}
                value={item.name}
                onChangeText={(val) => handleItemChange(item.id, 'name', val)}
              />
            </View>
            <View style={{ width: theme.spacing.md }} />
            <View style={styles.flex1}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={item.price}
                onChangeText={(val) => handleItemChange(item.id, 'price', val)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.splitsSection}>
            <View style={styles.splitsHeader}>
              <Text style={styles.splitsTitle}>Splits</Text>
              <TouchableOpacity onPress={() => handleSplitEqually(item.id)}>
                <Text style={styles.splitEqText}>Split Equally</Text>
              </TouchableOpacity>
            </View>
            
            {members.map(member => (
              <View key={member.userId} style={styles.splitRow}>
                <View style={styles.splitToggle}>
                  <Switch
                    value={item.splits[member.userId]?.selected || false}
                    onValueChange={(val) => handleSplitChange(item.id, member.userId, 'selected', val)}
                    trackColor={{ false: theme.colors.borderInput, true: theme.colors.accentHover }}
                    thumbColor={item.splits[member.userId]?.selected ? theme.colors.accent : '#f4f3f4'}
                  />
                  <Text style={styles.memberName}>
                    {[member.firstName, member.lastName].filter(Boolean).join(' ') || member.username}
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.splitAmountInput, !item.splits[member.userId]?.selected && styles.inputDisabled]}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={item.splits[member.userId]?.amount || ''}
                  onChangeText={(val) => handleSplitChange(item.id, member.userId, 'amount', val)}
                  keyboardType="numeric"
                  editable={item.splits[member.userId]?.selected}
                />
              </View>
            ))}
          </View>
        </View>
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {calculateTotal().toFixed(2)} PLN</Text>
        <TouchableOpacity 
          style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Save Expense</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bgPrimary,
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
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
  },
  inputDisabled: {
    opacity: 0.5,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  itemsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  addBtnSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  addBtnTextSmall: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  itemCard: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  removeText: {
    color: theme.colors.danger,
  },
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  flex1: {
    flex: 1,
  },
  splitsSection: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderInput,
    paddingTop: theme.spacing.md,
  },
  splitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  splitsTitle: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  splitEqText: {
    color: theme.colors.accent,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  splitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberName: {
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  splitAmountInput: {
    width: 100,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
  },
  totalText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
