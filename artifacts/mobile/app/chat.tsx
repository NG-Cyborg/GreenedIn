import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const SYSTEM_PROMPT = `You are Alabi, an expert agricultural AI assistant for GreenedIn — a platform for African farmers. 
You specialize in:
- Crop farming, poultry, and livestock in West and East Africa
- Soil health, pest management, irrigation, and fertilization
- Farm financial planning and cost management
- Post-harvest handling and market strategies
- Nigerian, Ghanaian, and East African farming conditions

Always give practical, actionable advice tailored to small and medium-scale African farmers. Be warm, encouraging, and concise. 
When discussing prices or quantities, use Nigerian Naira (₦) as the default currency unless the user specifies otherwise.
Never use emojis in your responses.`;

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello${user ? `, ${user.firstName}` : ""}! I am Alabi, your agricultural AI assistant. I can help you with crop farming, livestock management, pest control, soil health, and farm financial planning. What would you like to know today?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString() + "u",
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const assistantMsg: Message = {
      id: Date.now().toString() + "a",
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    const chatHistory = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const baseUrl = domain ? `https://${domain}` : "";
      const resp = await fetch(`${baseUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!resp.ok) throw new Error("API error");

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                const captured = fullContent;
                const capturedId = assistantMsg.id;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === capturedId ? { ...m, content: captured } : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      const capturedId = assistantMsg.id;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === capturedId
            ? {
                ...m,
                content:
                  "I apologize, I am having trouble connecting right now. Please check your internet connection and try again.",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
          {
            backgroundColor: isUser ? colors.primary : colors.card,
            borderColor: isUser ? colors.primary : colors.border,
          },
        ]}
      >
        {!isUser && (
          <View style={[styles.aiAvatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.aiAvatarText}>A</Text>
          </View>
        )}
        <View style={styles.bubbleContent}>
          {!isUser && (
            <Text style={[styles.aiName, { color: colors.accent }]}>Alabi</Text>
          )}
          <Text
            style={[
              styles.bubbleText,
              { color: isUser ? colors.primaryForeground : colors.foreground },
            ]}
          >
            {item.content}
            {isStreaming && item.id.endsWith("a") && item === messages[messages.length - 1] && (
              <Text style={{ color: colors.accent }}>|</Text>
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 8,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={[styles.alaIcon, { backgroundColor: colors.accent }]}>
          <Text style={styles.alaIconText}>A</Text>
        </View>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Alabi</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Agricultural AI Assistant
          </Text>
        </View>
        <View style={[styles.activeDot, { backgroundColor: colors.accent }]} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: 12 },
          ]}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Alabi anything about farming..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { backgroundColor: !input.trim() || isStreaming ? colors.muted : colors.primary },
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isStreaming}
            activeOpacity={0.85}
          >
            <Feather
              name="send"
              size={18}
              color={!input.trim() || isStreaming ? colors.mutedForeground : colors.primaryForeground}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { padding: 4 },
  alaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  alaIconText: {
    fontSize: 16,
    fontFamily: "Geist_700Bold",
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: "auto",
  },
  keyboardView: { flex: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    gap: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  aiAvatarText: {
    fontSize: 12,
    fontFamily: "Geist_700Bold",
    color: "#FFFFFF",
  },
  bubbleContent: { flex: 1, gap: 2 },
  aiName: {
    fontSize: 11,
    fontFamily: "Geist_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    lineHeight: 21,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
