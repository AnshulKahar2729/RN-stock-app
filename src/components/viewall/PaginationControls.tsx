import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  progressAnim: Animated.Value;
}

const PaginationControls = memo<PaginationControlsProps>(({
  page,
  totalPages,
  startItem,
  endItem,
  totalItems,
  canGoPrevious,
  canGoNext,
  onPreviousPage,
  onNextPage,
  progressAnim,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handlePreviousPage = useCallback(() => {
    onPreviousPage();
  }, [onPreviousPage]);

  const handleNextPage = useCallback(() => {
    onNextPage();
  }, [onNextPage]);

  if (totalPages <= 1) return null;

  return (
    <View style={styles.paginationContainer}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: theme.primary,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.paginationContent}>
        {/* Left: Info */}
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationStats}>
            {startItem}-{endItem} of {totalItems}
          </Text>
          <Text style={styles.paginationProgress}>
            Page {page} of {totalPages}
          </Text>
        </View>

        {/* Center: Page indicator */}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {page}/{totalPages}
          </Text>
        </View>

        {/* Right: Controls */}
        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              !canGoPrevious && styles.paginationButtonDisabled,
            ]}
            onPress={handlePreviousPage}
            disabled={!canGoPrevious}
            activeOpacity={0.7}
          >
            <Icon
              name="chevron-left"
              size={16}
              color={!canGoPrevious ? theme.subtext : theme.card}
            />
            <Text
              style={[
                styles.paginationButtonText,
                !canGoPrevious && styles.paginationButtonTextDisabled,
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              !canGoNext && styles.paginationButtonDisabled,
            ]}
            onPress={handleNextPage}
            disabled={!canGoNext}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.paginationButtonText,
                !canGoNext && styles.paginationButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Icon
              name="chevron-right"
              size={16}
              color={!canGoNext ? theme.subtext : theme.card}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    paginationContainer: {
      paddingVertical: 16,
      paddingHorizontal: 8,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: 8,
      borderRadius: 12,
      marginHorizontal: 8,
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressBackground: {
      height: 4,
      backgroundColor: theme.background,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    paginationContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    paginationInfo: {
      flex: 1,
    },
    paginationStats: {
      fontSize: theme.font.size.sm,
      color: theme.text,
      fontWeight: theme.font.weight.medium as any,
      marginBottom: 2,
    },
    paginationProgress: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
      fontWeight: theme.font.weight.regular as any,
    },
    pageIndicator: {
      backgroundColor: theme.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageIndicatorText: {
      fontSize: theme.font.size.sm,
      color: theme.text,
      fontWeight: theme.font.weight.bold as any,
    },
    paginationControls: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
      gap: 8,
    },
    paginationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 4,
    },
    paginationButtonDisabled: {
      backgroundColor: theme.border,
    },
    paginationButtonText: {
      fontSize: theme.font.size.sm,
      color: theme.card,
      fontWeight: theme.font.weight.medium as any,
    },
    paginationButtonTextDisabled: {
      color: theme.subtext,
    },
  });

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls; 