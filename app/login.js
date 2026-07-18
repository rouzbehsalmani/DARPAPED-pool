import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../src/services/supabaseClient";
import { COLORS, FONTS, RADIUS, SPACING } from "../src/theme/theme";

export default function LoginRoute() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Enter your email and password");
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace("/");
  };

  return (
    <View style={styles.safeArea}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
        {loading ? <ActivityIndicator color="#1A1A2E" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/sign-up")}>
        <Text style={styles.link}>No account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark, padding: SPACING.lg, justifyContent: "center" },
  title: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 24, marginBottom: 24, textAlign: "center" },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    marginBottom: 12,
    fontFamily: FONTS.regular
  },
  error: { color: COLORS.danger, fontFamily: FONTS.regular, fontSize: 12, marginBottom: 12 },
  button: { backgroundColor: COLORS.gold, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#1A1A2E", fontFamily: FONTS.semiBold, fontSize: 14 },
  link: { color: COLORS.textMuted, fontFamily: FONTS.medium, fontSize: 13, textAlign: "center", textDecorationLine: "underline" }
});

// FILE LOCATION: app/login.js (NEW file)
