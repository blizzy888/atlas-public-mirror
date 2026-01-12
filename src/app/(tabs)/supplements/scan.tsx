import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { Flashlight } from "lucide-react-native";

import { colors, spacing, typography } from "@/styles";
import { Button } from "@/components/ui";
import { extractFromLabel } from "@/lib/api/labelExtractionService";
import { setExtractionDraft } from "@/lib";

export default function ScanLabel() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [preview, setPreview] = useState<{ uri: string; base64: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [torch, setTorch] = useState<boolean>(false);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted && !permission.canAskAgain) return;
    if (!permission.granted) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.status]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>We need access to your camera</Text>
        {permission.canAskAgain ? (
          <Button title="Grant Permission" onPress={requestPermission} />
        ) : (
          <Button title="Open Settings" onPress={() => Linking.openSettings()} />
        )}
      </View>
    );
  }

  const handleCapture = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!cameraRef.current || !isCameraReady) return;

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.9,
        exif: false,
      });

      if (photo?.uri && photo.base64) {
        const processedBase64 = photo.base64.startsWith("data:image/")
          ? photo.base64
          : `data:image/jpeg;base64,${photo.base64}`;
        setPreview({ uri: photo.uri, base64: processedBase64 });
      }
    } catch {
      Alert.alert("Capture Failed", "Please try again with better lighting.");
    }
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreview(null);
    setIsAnalyzing(false);
  };

  const handleAnalyze = async () => {
    if (!preview?.base64) return;

    setIsAnalyzing(true);
    try {
      const extracted = await extractFromLabel(preview.base64);
      setExtractionDraft(extracted);
      router.replace("./review");
    } catch (error) {
      Alert.alert(
        "Analysis Failed",
        error instanceof Error ? error.message : "Please try again with a clearer photo."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Scan Label" }} />

      {preview ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview.uri }} style={styles.preview} resizeMode="contain" />

          {isAnalyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator color={colors.white} size="large" />
              <Text style={styles.analyzingText}>Analyzing label…</Text>
            </View>
          )}

          <View style={styles.previewActions}>
            <View style={styles.previewActionButton}>
              <Button
                title="Retake"
                variant="secondary"
                onPress={handleRetake}
                disabled={isAnalyzing}
                fullWidth
              />
            </View>
            <View style={styles.previewActionButton}>
              <Button
                title="Analyze"
                onPress={handleAnalyze}
                isLoading={isAnalyzing}
                disabled={isAnalyzing}
                fullWidth
              />
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Camera View */}
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            enableTorch={torch}
            onCameraReady={() => setIsCameraReady(true)}
            onMountError={() => {
              Alert.alert("Camera Error", "Unable to start the camera.");
            }}
          />

          <View style={styles.cameraControls}>
            <Pressable
              style={[styles.controlButton, torch && styles.controlButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTorch(!torch);
              }}
              accessibilityLabel="Toggle torch"
            >
              <Flashlight size={24} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.scanningGuide}>
            <View style={styles.guideFrame}>
              <View style={[styles.guideCorner, styles.guideCornerTL]} />
              <View style={[styles.guideCorner, styles.guideCornerTR]} />
              <View style={[styles.guideCorner, styles.guideCornerBL]} />
              <View style={[styles.guideCorner, styles.guideCornerBR]} />
            </View>

            <Text style={styles.guideText}>Position the supplement label within the frame</Text>
            <Text style={styles.guideSubtext}>
              Make sure the label is well-lit and clearly visible
            </Text>
          </View>

          <View style={styles.captureContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                pressed && styles.captureButtonPressed,
              ]}
              onPress={handleCapture}
              disabled={!isCameraReady}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.screen,
  },
  permissionText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },

  // Camera View
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    top: spacing.screen + spacing.xl,
    right: spacing.screen,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.black + "80",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white + "30",
  },
  controlButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // Scanning Guide
  scanningGuide: {
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing.screen,
  },
  guideFrame: {
    width: 280,
    height: 220,
    position: "relative",
    marginBottom: spacing.xl,
  },
  guideCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: colors.primary,
  },
  guideCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  guideCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  guideCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  guideCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  guideText: {
    ...typography.heading,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  guideSubtext: {
    ...typography.body,
    color: colors.white + "DD",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Capture Controls
  captureContainer: {
    position: "absolute",
    bottom: spacing.screen,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.border,
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },

  // Preview Mode
  previewContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  preview: {
    flex: 1,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black + "CC",
    alignItems: "center",
    justifyContent: "center",
  },
  analyzingText: {
    ...typography.body,
    color: colors.white,
    marginTop: spacing.md,
    fontWeight: "600",
  },
  previewActions: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.screen,
  },
  previewActionButton: {
    flex: 1,
  },
});
