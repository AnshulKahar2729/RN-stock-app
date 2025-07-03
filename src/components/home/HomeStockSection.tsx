import React, { memo, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TopStock } from '../../types/stock';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';
import { EmptyStockGrid } from '../EmptyStockGrid';
import HomeSectionHeader from './HomeSectionHeader';
import HomeStockList from './HomeStockList';

interface HomeStockSectionProps {
  title: string;
  data: TopStock[];
  error: any;
  onViewAllPress: () => void;
  onRetry: () => void;
  keyPrefix: string;
}

const HomeStockSection = memo<HomeStockSectionProps>(({
  title,
  data,
  error,
  onViewAllPress,
  onRetry,
  keyPrefix,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const displayedData = useMemo(() => data.slice(0, 4), [data]);

  const handleViewAllPress = useCallback(() => {
    onViewAllPress();
  }, [onViewAllPress]);

  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  return (
    <View style={styles.section}>
      <HomeSectionHeader
        title={title}
        onViewAllPress={handleViewAllPress}
      />

      {displayedData.length > 0 ? (
        <HomeStockList data={displayedData} keyPrefix={keyPrefix} />
      ) : (
        <EmptyStockGrid
          message={
            error
              ? `Failed to load ${title.toLowerCase()} data`
              : `No ${title.toLowerCase()} data available`
          }
          error={error?.message || null}
          loadStockData={handleRetry}
        />
      )}
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: 10,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
  });

HomeStockSection.displayName = 'HomeStockSection';

export default HomeStockSection; 