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

type TBook = {
  id: string,
  date: Date,
  userOperatorId: string,
  userOriginId: string,
  userTargetId?: string,
  ratio: number,
  usdRatioPrice: number,
  usdBrlPrice: number,
  dateInsertion: Date,
  dateActivation?: Date,
  typeRecord: string,
  status: string,
  obs?: string,
  log?: Array<object>
}