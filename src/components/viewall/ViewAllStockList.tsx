import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { TopStock } from '../../types/stock';
import ViewAllStockItem from './ViewAllStockItem';
import ViewAllLoadingScreen from './ViewAllLoadingScreen';
import ViewAllErrorScreen from './ViewAllErrorScreen';
import ViewAllEmptyScreen from './ViewAllEmptyScreen';

interface ViewAllStockListProps {
  data: TopStock[];
  isLoading: boolean;
  isError: boolean;
  type: 'gainers' | 'losers';
}

const ViewAllStockList = memo<ViewAllStockListProps>(({
  data,
  isLoading,
  isError,
  type,
}) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TopStock>) => (
      <ViewAllStockItem item={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: TopStock) => item.ticker,
    []
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return <ViewAllLoadingScreen />;
    }
    if (isError) {
      return <ViewAllErrorScreen type={type} />;
    }
    return <ViewAllEmptyScreen type={type} />;
  }, [isLoading, isError, type]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 120,
      offset: 120 * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={6}
      windowSize={10}
    />
  );
});

ViewAllStockList.displayName = 'ViewAllStockList';

export default ViewAllStockList; 