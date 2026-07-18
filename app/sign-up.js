import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../src/services/supabaseClient";
import { COLORS, FONTS, RADIUS, SPACING } from "../src/theme/theme";

export default function SignUpRoute() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    if (!email || password.length < 6) {
      setError("Enter an email and a password of at least 6 characters");
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      router.replace("/");
    } else {
      // Email confirmation is required by your Supabase project settings.
      setDone(true);
    }
  };

  if (done) {
    return (
      <View style={styles.safeArea}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.info}>We sent a confirmation link to {email}. Confirm it, then come back and log in.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/login")} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Go to Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Text style={styles.title}>Sign Up</Text>
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
        placeholder="Password (min 6 characters)"
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading} activeOpacity={0.85}>
        {loading ? <ActivityIndicator color="#1A1A2E" /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark, padding: SPACING.lg, justifyContent: "center" },
  title: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 24, marginBottom: 24, textAlign: "center" },
  info: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 13, textAlign: "center", marginBottom: 24, lineHeight: 20 },
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

// FILE LOCATION: app/sign-up.js (NEW file)
