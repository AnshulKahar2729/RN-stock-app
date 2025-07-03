import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import TopStockCard from '../TopStockCard';
import { useTheme } from '../../context/ThemeContext';
import { TopStock } from '../../types/stock';
import { Theme } from '../../utils';

interface HomeStockCardProps {
  item: TopStock;
}

const HomeStockCard = memo<HomeStockCardProps>(({ item }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.cardContainer}>
      <TopStockCard stock={item} />
    </View>
  );
});

const getStyles = (_theme: Theme) =>
  StyleSheet.create({
    cardContainer: {
      flex: 1,
      marginHorizontal: 6,
    },
  });

HomeStockCard.displayName = 'HomeStockCard';

export default HomeStockCard; 