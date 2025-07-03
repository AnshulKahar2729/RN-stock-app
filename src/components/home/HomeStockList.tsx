import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { TopStock } from '../../types/stock';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';
import HomeStockCard from './HomeStockCard';

interface HomeStockListProps {
  data: TopStock[];
  keyPrefix: string;
}

const HomeStockList = memo<HomeStockListProps>(({ data, keyPrefix }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TopStock>) => (
      <HomeStockCard item={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: TopStock) => `${keyPrefix}-${item.ticker}`,
    [keyPrefix]
  );

  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      scrollEnabled={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={4}
      initialNumToRender={4}
      contentContainerStyle={styles.listContainer}
    />
  );
});

const getStyles = (_theme: Theme) =>
  StyleSheet.create({
    listContainer: {
      flexGrow: 1,
      gap: 12,
    },
  });

HomeStockList.displayName = 'HomeStockList';

export default HomeStockList; 