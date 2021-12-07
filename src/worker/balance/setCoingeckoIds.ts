const setCoingeckoIds = async (exchangeSelected: string, filteredBalance: Balances, coinList: Array<Coin>) => {
  console.log(`[coinway-balance] ${exchangeSelected} - Setting Coingecko Ids ...`)
  let filteredBalanceIds: string = ''
  // Varrendo todo o vetor de coins da CoinGecko, e extraindo os ids para as moedas da exchange selecionada
  coinList.map(coin => {
    for (const key in filteredBalance) {
      if (key.toLowerCase() === coin.symbol) {
        filteredBalance[key] = {
          ...filteredBalance[key],
          coinGeckoId: coin.id
        }
        filteredBalanceIds = filteredBalanceIds.concat(coin.id, ',')
      }
    }
  })
  global.detailedConsole && console.log(`[coinway-balance] ${exchangeSelected} - Set Coingecko Ids done`)
  global.detailedConsole && console.log(filteredBalance)
  global.detailedConsole && console.log('\n')

  return {
    filteredBalanceWithIds: filteredBalance,
    filteredBalanceIds
  }
}

export default setCoingeckoIds