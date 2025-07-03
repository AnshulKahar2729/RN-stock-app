import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import TopStockCard from '../TopStockCard';
import { TopStock } from '../../types/stock';

interface ViewAllStockItemProps {
  item: TopStock;
}

const ViewAllStockItem = memo<ViewAllStockItemProps>(({ item }) => (
  <View style={styles.itemWrapper}>
    <TopStockCard stock={item} />
  </View>
));

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
});

ViewAllStockItem.displayName = 'ViewAllStockItem';

export default ViewAllStockItem; 