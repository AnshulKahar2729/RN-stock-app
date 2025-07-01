export interface TopStock {
  change_amount: string;
  change_percentage: string;
  price: string;
  ticker: string;
  volume: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: TopStock[];
}
