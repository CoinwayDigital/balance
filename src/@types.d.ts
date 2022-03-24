type Balance = {
  total: number
  free: number
  used: number
  usdValue?: number
  coinGeckoId?: string
}

interface Balances {
  [key: string]: Balance
}

type Coin = {
  id: string
  name: string
  symbol: string
}

type TInvestmentData = {
  investmentsAmountUsd: number
  investmentsAmountBrl: number
}