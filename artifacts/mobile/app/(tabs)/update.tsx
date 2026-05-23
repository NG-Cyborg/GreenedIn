import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useCommunity, type CommunityPost } from "@/context/CommunityContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useCourseProgress } from "@/context/CourseProgressContext";
import { t } from "@/constants/i18n";
import { useColors } from "@/hooks/useColors";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { OfflineBanner } from "@/components/OfflineBanner";
import { courses } from "@/constants/courses";
import { commodities } from "@/constants/marketData";

type Tab = "knowledge" | "community" | "marketplace";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function PostCard({
  post,
  onVote,
  onBookmark,
  onOpen,
}: {
  post: CommunityPost;
  onVote: (dir: "up" | "down") => void;
  onBookmark: () => void;
  onOpen: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onOpen}
      activeOpacity={0.85}
    >
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {post.author.charAt(0)}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.foreground }]}>{post.author}</Text>
          <Text style={[styles.authorRole, { color: colors.mutedForeground }]}>
            {post.role} · {timeAgo(post.createdAt)}
          </Text>
        </View>
        <TouchableOpacity onPress={onBookmark} style={styles.bookmarkBtn}>
          <Feather
            name={post.bookmarked ? "bookmark" : "bookmark"}
            size={16}
            color={post.bookmarked ? colors.accent : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.postQuestion, { color: colors.foreground }]}>{post.question}</Text>
      <View style={styles.postMeta}>
        <View style={styles.voteRow}>
          <TouchableOpacity
            style={[styles.voteBtn, { backgroundColor: post.userVote === "up" ? "#EBF7E6" : colors.secondary }]}
            onPress={() => onVote("up")}
            activeOpacity={0.7}
          >
            <Feather name="thumbs-up" size={13} color={post.userVote === "up" ? colors.accent : colors.mutedForeground} />
            <Text style={[styles.voteCount, { color: post.userVote === "up" ? colors.accent : colors.mutedForeground }]}>
              {post.upvotes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteBtn, { backgroundColor: post.userVote === "down" ? "#FFF0F0" : colors.secondary }]}
            onPress={() => onVote("down")}
            activeOpacity={0.7}
          >
            <Feather name="thumbs-down" size={13} color={post.userVote === "down" ? "#E53935" : colors.mutedForeground} />
            <Text style={[styles.voteCount, { color: post.userVote === "down" ? "#E53935" : colors.mutedForeground }]}>
              {post.downvotes}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.metaItem}>
          <Feather name="message-circle" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {post.comments.length} {post.comments.length === 1 ? "reply" : "replies"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function AskModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (q: string) => void;
}) {
  const colors = useColors();
  const [question, setQuestion] = useState("");
  const submit = () => {
    if (!question.trim()) return;
    onSubmit(question.trim());
    setQuestion("");
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Ask the Community</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
            Ask a farming question — other farmers and experts will reply.
          </Text>
          <TextInput
            style={[styles.askInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
            value={question}
            onChangeText={setQuestion}
            placeholder="E.g. What fertilizer should I use for maize at 4 weeks?"
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoFocus
          />
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: question.trim() ? colors.primary : colors.muted }]}
            onPress={submit}
            disabled={!question.trim()}
            activeOpacity={0.85}
          >
            <Text style={[styles.submitBtnText, { color: question.trim() ? colors.primaryForeground : colors.mutedForeground }]}>
              Post Question
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CommentModal({
  post,
  visible,
  onClose,
  onComment,
}: {
  post: CommunityPost | null;
  visible: boolean;
  onClose: () => void;
  onComment: (postId: string, text: string) => void;
}) {
  const colors = useColors();
  const { user } = useApp();
  const [text, setText] = useState("");
  if (!post) return null;
  const submit = () => {
    if (!text.trim()) return;
    onComment(post.id, text.trim());
    setText("");
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.commentBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]} numberOfLines={2}>
              {post.question}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
            {post.comments.length === 0 && (
              <Text style={[styles.noComments, { color: colors.mutedForeground }]}>
                No replies yet. Be the first to respond.
              </Text>
            )}
            {post.comments.map((c) => (
              <View key={c.id} style={[styles.commentItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.commentAvatar, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.avatarText, { color: colors.primary, fontSize: 12 }]}>
                    {c.author.charAt(0)}
                  </Text>
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentMeta}>
                    <Text style={[styles.commentAuthor, { color: colors.foreground }]}>{c.author}</Text>
                    <Text style={[styles.commentTime, { color: colors.mutedForeground }]}>
                      {timeAgo(c.createdAt)}
                    </Text>
                  </View>
                  <Text style={[styles.commentRole, { color: colors.mutedForeground }]}>{c.role}</Text>
                  <Text style={[styles.commentText, { color: colors.foreground }]}>{c.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={[styles.commentInputRow, { borderTopColor: colors.border }]}>
            <TextInput
              style={[styles.commentInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
              value={text}
              onChangeText={setText}
              placeholder="Write a reply..."
              placeholderTextColor={colors.mutedForeground}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}
              onPress={submit}
              disabled={!text.trim()}
            >
              <Feather name="send" size={16} color={text.trim() ? "#FFFFFF" : colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function AddProductModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colors = useColors();
  const { user } = useApp();
  const { addProduct } = useMarketplace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState(user ? `${user.countryCode} ${user.phone}` : "");
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price || !location.trim()) return;
    setLoading(true);
    await addProduct({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      currency: "NGN",
      location: location.trim(),
      imageUri,
      sellerName: user ? `${user.firstName} ${user.surname}` : "Anonymous",
      sellerPhone: phone.trim(),
    });
    setName(""); setDescription(""); setPrice(""); setLocation("");
    setImageUri(undefined);
    setLoading(false);
    onClose();
  };

  const isValid = name.trim() && price && location.trim();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.modalOverlayScroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.productModal, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>List a Product / Service</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.imagePicker, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.pickedImage} />
              ) : (
                <View style={styles.imagePickerInner}>
                  <Feather name="image" size={28} color={colors.mutedForeground} />
                  <Text style={[styles.imagePickerText, { color: colors.mutedForeground }]}>
                    Tap to add a photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.formFields}>
              {[
                { label: "Product / Service Name *", value: name, set: setName, placeholder: "E.g. Fresh Broiler Chickens", key: "p1" },
                { label: "Location *", value: location, set: setLocation, placeholder: "E.g. Lagos, Nigeria", key: "p2" },
                { label: "Price (NGN) *", value: price, set: setPrice, placeholder: "E.g. 5000", key: "p3", numeric: true },
                { label: "Seller Phone Number", value: phone, set: setPhone, placeholder: "Your contact number", key: "p4" },
              ].map((f) => (
                <View key={f.key} style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.foreground }]}>{f.label}</Text>
                  <TextInput
                    style={[styles.formInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
                    value={f.value}
                    onChangeText={f.set}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType={f.numeric ? "numeric" : "default"}
                  />
                </View>
              ))}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: colors.foreground }]}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your product or service..."
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: isValid ? colors.primary : colors.muted }]}
              onPress={handleSubmit}
              disabled={!isValid || loading}
              activeOpacity={0.85}
            >
              <Text style={[styles.submitBtnText, { color: isValid ? colors.primaryForeground : colors.mutedForeground }]}>
                {loading ? "Listing..." : "List Product / Service"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function UpdateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, user } = useApp();
  const { posts, addPost, addComment, vote, toggleBookmark } = useCommunity();
  const { products } = useMarketplace();
  const { getCourseProgress } = useCourseProgress();
  const params = useLocalSearchParams<{ tab?: string }>();

  const [activeTab, setActiveTab] = useState<Tab>(
    (params.tab as Tab) || "knowledge"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showAsk, setShowAsk] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  useEffect(() => {
    if (params.tab && ["knowledge", "community", "marketplace"].includes(params.tab)) {
      setActiveTab(params.tab as Tab);
    }
  }, [params.tab]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const tabs: { key: Tab; label: string }[] = [
    { key: "knowledge", label: t(language, "knowledgeHub") },
    { key: "community", label: t(language, "askCommunity") },
    { key: "marketplace", label: t(language, "marketplace") },
  ];

  const filteredCourses = courses.filter(
    (c) =>
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAsk = async (question: string) => {
    const author = user ? `${user.firstName} ${user.surname}` : "Anonymous";
    const role = user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : "Community Member";
    await addPost(question, author, role);
  };

  const handleComment = async (postId: string, text: string) => {
    const author = user ? `${user.firstName} ${user.surname}` : "Anonymous";
    const role = user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : "Community Member";
    await addComment(postId, text, author, role);
    const updated = posts.find((p) => p.id === postId);
    if (updated) setSelectedPost(updated);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <OfflineBanner />
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {t(language, "update")}
        </Text>
        <View style={[styles.tabs, { backgroundColor: colors.secondary }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && {
                  backgroundColor: colors.card,
                  shadowColor: "#000",
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 2,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab.key ? colors.primary : colors.mutedForeground,
                    fontFamily: activeTab === tab.key ? "Geist_600SemiBold" : "Geist_400Regular",
                  },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === "knowledge" && (
        <>
          <View style={[styles.searchBar, { paddingHorizontal: 16, paddingVertical: 12 }]}>
            <View style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.searchText, { color: colors.foreground }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search courses..."
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {filteredCourses.map((course) => {
              const progress = getCourseProgress(course.id, course.lessonList.length);
              return (
                <TouchableOpacity
                  key={course.id}
                  style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push(`/course/${course.id}`)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.courseIcon, { backgroundColor: colors.secondary }]}>
                    <Feather name="book-open" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.courseInfo}>
                    <View style={styles.courseMetaRow}>
                      <Text style={[styles.courseLevel, { color: colors.accent }]}>
                        {course.level.toUpperCase()}
                      </Text>
                      <Text style={[styles.courseCat, { color: colors.mutedForeground }]}>
                        {course.category}
                      </Text>
                    </View>
                    <Text style={[styles.courseTitle, { color: colors.foreground }]} numberOfLines={2}>
                      {course.title}
                    </Text>
                    <Text style={[styles.courseInstructor, { color: colors.mutedForeground }]}>
                      {course.instructor}
                    </Text>
                    <View style={styles.courseStats}>
                      <View style={styles.statItem}>
                        <Feather name="clock" size={11} color={colors.mutedForeground} />
                        <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                          {course.duration}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Feather name="layers" size={11} color={colors.mutedForeground} />
                        <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                          {course.lessonList.length} lessons
                        </Text>
                      </View>
                    </View>
                    {progress > 0 && (
                      <View style={styles.progressRow}>
                        <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
                          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
                        </View>
                        <Text style={[styles.progressPct, { color: colors.accent }]}>{progress}%</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}

      {activeTab === "community" && (
        <>
          <View style={[styles.communityActions, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowAsk(true)}
              activeOpacity={0.85}
            >
              <Feather name="edit-2" size={15} color={colors.primaryForeground} />
              <Text style={[styles.postBtnText, { color: colors.primaryForeground }]}>Ask a question</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onVote={(dir) => vote(post.id, dir)}
                onBookmark={() => toggleBookmark(post.id)}
                onOpen={() => setSelectedPost(post)}
              />
            ))}
          </ScrollView>
        </>
      )}

      {activeTab === "marketplace" && (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.addProductBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddProduct(true)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color={colors.primaryForeground} />
            <Text style={[styles.addProductText, { color: colors.primaryForeground }]}>
              + Product / Service
            </Text>
          </TouchableOpacity>

          <Text style={[styles.marketSubhead, { color: colors.mutedForeground }]}>
            Live commodity prices — Nigerian markets
          </Text>
          <View style={styles.marketGrid}>
            {commodities.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </View>

          {products.length > 0 && (
            <>
              <Text style={[styles.marketSubhead, { color: colors.mutedForeground, marginTop: 16 }]}>
                Products & Services from the community
              </Text>
              <View style={styles.productList}>
                {products.map((product) => (
                  <View
                    key={product.id}
                    style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  >
                    {product.imageUri && (
                      <Image source={{ uri: product.imageUri }} style={styles.productImage} />
                    )}
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>
                      <Text style={[styles.productPrice, { color: colors.accent }]}>
                        NGN {product.price.toLocaleString()}
                      </Text>
                      {product.description ? (
                        <Text style={[styles.productDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                          {product.description}
                        </Text>
                      ) : null}
                      <View style={styles.productMeta}>
                        <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                        <Text style={[styles.productMetaText, { color: colors.mutedForeground }]}>
                          {product.location}
                        </Text>
                      </View>
                      <View style={styles.productMeta}>
                        <Feather name="user" size={12} color={colors.mutedForeground} />
                        <Text style={[styles.productMetaText, { color: colors.mutedForeground }]}>
                          {product.sellerName} · {product.sellerPhone}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}

      <AskModal visible={showAsk} onClose={() => setShowAsk(false)} onSubmit={handleAsk} />
      <AddProductModal visible={showAddProduct} onClose={() => setShowAddProduct(false)} />
      <CommentModal
        post={selectedPost}
        visible={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onComment={handleComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Lora_700Bold",
  },
  tabs: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 11,
    textAlign: "center",
  },
  searchBar: {},
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  courseCard: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 14,
    alignItems: "flex-start",
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseMetaRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  courseLevel: {
    fontSize: 10,
    fontFamily: "Geist_600SemiBold",
    letterSpacing: 0.4,
  },
  courseCat: {
    fontSize: 10,
    fontFamily: "Geist_400Regular",
  },
  courseTitle: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
    lineHeight: 20,
  },
  courseInstructor: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  courseStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#5CB840",
    borderRadius: 2,
  },
  progressPct: {
    fontSize: 10,
    fontFamily: "Geist_600SemiBold",
    minWidth: 28,
    textAlign: "right",
  },
  communityActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  postBtnText: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  postCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "Geist_700Bold",
  },
  authorInfo: { flex: 1, gap: 2 },
  authorName: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  authorRole: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  bookmarkBtn: { padding: 4 },
  postQuestion: {
    fontSize: 14,
    fontFamily: "Lora_400Regular",
    lineHeight: 21,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  voteRow: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  voteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  voteCount: {
    fontSize: 12,
    fontFamily: "Geist_600SemiBold",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  marketSubhead: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    paddingBottom: 8,
  },
  marketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  addProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  addProductText: {
    fontSize: 14,
    fontFamily: "Geist_600SemiBold",
  },
  productList: {
    gap: 12,
  },
  productCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 180,
  },
  productInfo: {
    padding: 14,
    gap: 5,
  },
  productName: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  productPrice: {
    fontSize: 16,
    fontFamily: "Geist_700Bold",
  },
  productDesc: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 19,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  productMetaText: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalOverlayScroll: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  modalBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  commentBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    maxHeight: "85%",
    gap: 12,
  },
  productModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    marginTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Lora_600SemiBold",
    lineHeight: 24,
  },
  modalSub: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 20,
  },
  askInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
    minHeight: 110,
    lineHeight: 22,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
  },
  commentsList: {
    maxHeight: 300,
  },
  noComments: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    paddingVertical: 20,
  },
  commentItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  commentBody: { flex: 1, gap: 3 },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentAuthor: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
  },
  commentTime: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  commentRole: {
    fontSize: 11,
    fontFamily: "Geist_400Regular",
  },
  commentText: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
    lineHeight: 19,
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePicker: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 14,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagePickerInner: {
    alignItems: "center",
    gap: 8,
  },
  imagePickerText: {
    fontSize: 13,
    fontFamily: "Geist_400Regular",
  },
  pickedImage: {
    width: "100%",
    height: "100%",
  },
  formFields: { gap: 12 },
  formField: { gap: 6 },
  formLabel: {
    fontSize: 13,
    fontFamily: "Geist_500Medium",
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  formTextArea: {
    minHeight: 80,
    lineHeight: 20,
  },
});
