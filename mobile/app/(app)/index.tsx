import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { getMyGroups, createGroup, joinGroup } from "../../src/api/groups";
import type { UserGroupResponse } from "../../src/types";
import { theme } from "../../src/theme";

export default function DashboardScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<UserGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [modalType, setModalType] = useState<"none" | "create" | "join">(
    "none",
  );
  const [inputValue, setInputValue] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [successCode, setSuccessCode] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getMyGroups();
      setGroups(data);
    } catch {
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalType("none");
    setInputValue("");
    setModalError("");
    setSuccessCode("");
  };

  const handleCreateGroup = async () => {
    if (!inputValue.trim()) {
      setModalError("Please enter a group name.");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      const result = await createGroup(inputValue);
      setSuccessCode(result.joinCode);
      fetchGroups();
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Failed to create group.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!inputValue.trim()) {
      setModalError("Please enter a join code.");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      await joinGroup(inputValue);
      setSuccessCode("joined");
      fetchGroups();
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Failed to join group.");
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
      <Text style={styles.groupCodeLabel}>
        Code: <Text style={styles.groupCode}>{item.joinCode}</Text>
      </Text>
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
        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={() => setModalType("create")}
        >
          <Text style={styles.actionBtnTextPrimary}>＋ Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={() => setModalType("join")}
        >
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
            <Text style={styles.emptyDesc}>
              Create a new group to start splitting expenses with friends, or
              join an existing group with a code.
            </Text>
          </View>
        }
      />

      <Modal visible={modalType !== "none"} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "create" ? "Create Group" : "Join Group"}
            </Text>

            {successCode ? (
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={styles.successTitle}>
                  {modalType === "create"
                    ? "Group Created!"
                    : "Joined Successfully!"}
                </Text>
                {modalType === "create" && (
                  <>
                    <Text style={styles.successDesc}>
                      Share this code with friends:
                    </Text>
                    <Text style={styles.successCode}>{successCode}</Text>
                  </>
                )}
                <TouchableOpacity
                  style={styles.modalBtnPrimary}
                  onPress={closeModal}
                >
                  <Text style={styles.modalBtnTextPrimary}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {modalError ? (
                  <Text style={styles.error}>{modalError}</Text>
                ) : null}
                <Text style={styles.label}>
                  {modalType === "create" ? "Group Name" : "Join Code"}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={
                    modalType === "create"
                      ? "e.g., Trip to Hawaii"
                      : "Enter the group code"
                  }
                  placeholderTextColor={theme.colors.textSecondary}
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalBtnSecondary}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalBtnTextSecondary}>Cancel</Text>
                  </TouchableOpacity>
                  <View style={{ width: theme.spacing.md }} />
                  <TouchableOpacity
                    style={[
                      styles.modalBtnPrimary,
                      modalLoading && { opacity: 0.7 },
                    ]}
                    onPress={
                      modalType === "create"
                        ? handleCreateGroup
                        : handleJoinGroup
                    }
                    disabled={modalLoading}
                  >
                    {modalLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalBtnTextPrimary}>
                        {modalType === "create" ? "Create" : "Join"}
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
    backgroundColor: theme.colors.bgPrimary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bgPrimary,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    fontSize: 15,
  },
  error: {
    color: theme.colors.danger,
    margin: theme.spacing.md,
    textAlign: "center",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    padding: theme.spacing.md,
    gap: 12, // Wygodny odstęp między przyciskami na ekranie telefonu
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    padding: 14,
    borderRadius: 12, // Nowoczesne, zaokrąglone rogi przycisków
    alignItems: "center",
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.bgSecondary, // Wykorzystanie drugiego tła zamiast przezroczystości
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionBtnTextPrimary: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  actionBtnTextSecondary: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  groupCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 20, // Więcej przestrzeni wewnątrz karty grupy
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    // Brak ordynarnych ramek – głębię budujemy subtelnym cieniem natywnym
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  groupIcon: {
    fontSize: 22,
    opacity: 0.9,
  },
  groupArrow: {
    fontSize: 18,
    color: theme.colors.accent, // Kolor akcentu dla strzałki przejścia
    fontWeight: "bold",
  },
  groupName: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  groupCodeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  groupCode: {
    color: theme.colors.accent,
    fontWeight: "600",
    backgroundColor: "rgba(99, 102, 241, 0.1)", // Delikatne, czytelne podświetlenie kodu
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: "center",
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  emptyDesc: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.8)", // Ciemny podkład pod modal spójny z tłem
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.bgSecondary,
    padding: 24,
    borderRadius: 20,
    // Usunięta jasna ramka modala, na telefonie sam cień zrobi robotę
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22, // Minimalnie mniejszy, bardziej elegancki
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase", // Małe, gęste litery wyglądają bardzo pro
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.03)", // Bardzo delikatne, nowoczesne rozjaśnienie
    borderWidth: 1,
    borderColor: theme.colors.borderInput,
    borderRadius: 12,
    padding: 16, // Więcej miejsca na palec
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginBottom: theme.spacing.xl,
  },
  modalActions: {
    flexDirection: "row",
  },
  modalBtnPrimary: {
    flex: 1.3, // Główny przycisk jest teraz odrobinę szerszy niż Cancel
    backgroundColor: theme.colors.accent,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  modalBtnSecondary: {
    flex: 1,
    backgroundColor: "transparent", // Brak tła
    borderWidth: 0, // Całkowicie usunięta ramka, przycisk jest "czysty"
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnTextPrimary: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBtnTextSecondary: {
    color: theme.colors.textSecondary, // Tekst Cancel jest teraz stonowany i nie krzyczy
    fontWeight: "600",
    fontSize: 16,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successIcon: {
    fontSize: 54,
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  successDesc: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontSize: 15,
  },
  successCode: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.accent,
    marginBottom: theme.spacing.xl,
    letterSpacing: 1,
  },
});
