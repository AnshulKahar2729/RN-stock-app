import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { fetchTopGainers, fetchTopLosers } from '../../services/api';
import TopStockCard from '../../components/TopStockCard';
import { TopStock } from '../../types/stock';
import { useRoute, RouteProp } from '@react-navigation/native';

const PAGE_SIZE = 10;

const ViewAllScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<{ params: { type: 'gainers' | 'losers' } }, 'params'>>();
  const [stocks, setStocks] = useState<TopStock[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetch =
      route.params.type === 'gainers' ? fetchTopGainers : fetchTopLosers;
    fetch().then(data => {
      setStocks(data);
      setLoading(false);
    });
  }, [route.params.type]);

  const paginatedStocks = stocks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const totalPages = Math.ceil(stocks.length / PAGE_SIZE);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {route.params.type === 'gainers' ? 'All Gainers' : 'All Losers'}
      </Text>

      {/* 
       */}
      <FlatList
        data={paginatedStocks}
        renderItem={({ item }) => <TopStockCard stock={item} />}
        keyExtractor={item => item.ticker}
        ListEmptyComponent={
          loading ? <Text>Loading...</Text> : <Text>No stocks found.</Text>
        }

      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 16,
        }}
      >
        <Button
          title="Prev"
          onPress={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        />
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        />
      </View>
    </View>
  );
};

export default ViewAllScreen;
