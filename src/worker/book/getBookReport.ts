import { AxiosInstance } from "axios"

type TReport = {
  amounts: {
      investment: {
          ratioAmount: number
          ratioUsdAmount: number
          ratioBrlAmount: number
      }
      withdraw: {
          ratioAmount: number
          ratioUsdAmount: number
          ratioBrlAmount: number
      }
  }
  users: {}
}

const getAmounts = (type: string, report: TReport, book: TBook) => {
  report.amounts[type].ratioAmount = report.amounts[type].ratioAmount + book.ratio

  let ratioUsdAmount = book.ratio / book.usdRatioPrice
  report.amounts[type].ratioUsdAmount = report.amounts[type].ratioUsdAmount + ratioUsdAmount
  
  let ratioBrlAmount = book.ratio / (book.usdRatioPrice / book.usdBrlPrice)
  report.amounts[type].ratioBrlAmount = report.amounts[type].ratioBrlAmount + ratioBrlAmount
}

const getUserAmounts = (userId: string, type: string, report: TReport, book: TBook) => {
  report.users[userId][type].usd = report.users[userId][type].usd + (book.ratio / book.usdRatioPrice)
  report.users[userId][type].brl = report.users[userId][type].brl + book.ratio * (book.usdRatioPrice / book.usdBrlPrice)
  report.users[userId][type].ratio = report.users[userId][type].ratio + book.ratio
}

const getBookReport = async (api: AxiosInstance) => {
  console.log(`[araucaria-balance] Get cash book report ...`)
  const book: Array<TBook> = await api.get('/book/select')
    .then(response => response.data)
    .catch(error => {
      console.log(error.message)
    })
  const report = {
    proportional: 0,
    amounts: {
      investment: {
        ratioAmount: 0,
        ratioUsdAmount: 0,
        ratioBrlAmount: 0
      },
      withdraw: {
        ratioAmount: 0,
        ratioUsdAmount: 0,
        ratioBrlAmount: 0
      },
      ratioResult: {
        ratioAmount: 0,
        ratioUsdAmount: 0,
        ratioBrlAmount: 0
      }
    },
    users: {}
  }
  
  for (let i = 0; i < book.length; i++) {
    if(!report.users[book[i].userOriginId]){
      report.users[book[i].userOriginId] = {
        results:  { usd: 0, brl: 0, ratio: 0},
        investment: { usd: 0, brl: 0, ratio: 0},
        withdraw: { usd: 0, brl: 0, ratio: 0},
        transferOrigin: { usd: 0, brl: 0, ratio: 0},
        transferTarget: { usd: 0, brl: 0, ratio: 0}
      }
    }
    if(!report.users[book[i].userTargetId] && book[i].userTargetId !== null){
      report.users[book[i].userTargetId] = {
        results: { usd: 0, brl: 0, ratio: 0},
        investment: { usd: 0, brl: 0, ratio: 0},
        withdraw: { usd: 0, brl: 0, ratio: 0},
        transferOrigin: { usd: 0, brl: 0, ratio: 0},
        transferTarget: { usd: 0, brl: 0, ratio: 0}
      }
    }
    if(book[i].typeRecord === 'investment'){
      if(!report.amounts['investment']){
        report.amounts['investment'] = {
          ratioAmount: 0,
          ratioUsdAmount: 0,
          ratioBrlAmount: 0
        }
      }
      getAmounts('investment', report, book[i])
      getUserAmounts(book[i].userOriginId, 'investment', report, book[i])
    }
    if(book[i].typeRecord === 'withdraw'){
      if(!report.amounts['withdraw']){
        report.amounts['withdraw'] = {
          ratioAmount: 0,
          ratioUsdAmount: 0,
          ratioBrlAmount: 0
        }
      }
      getAmounts('withdraw', report, book[i])
      getUserAmounts(book[i].userOriginId, 'withdraw', report, book[i])
    }
    if(book[i].typeRecord === 'transfer'){
      getUserAmounts(book[i].userOriginId, 'transferOrigin', report, book[i])
      getUserAmounts(book[i].userTargetId, 'transferTarget', report, book[i])
    }
  }

  // Amounts results
  report.amounts.ratioResult.ratioAmount = report.amounts.investment.ratioAmount - report.amounts.withdraw.ratioAmount
  report.amounts.ratioResult.ratioUsdAmount = report.amounts.investment.ratioUsdAmount - report.amounts.withdraw.ratioUsdAmount
  report.amounts.ratioResult.ratioBrlAmount = report.amounts.investment.ratioBrlAmount - report.amounts.withdraw.ratioBrlAmount



  // Calculando valores finais
  for (const key in report.users) {
    const ratioAmount = report.users[key].investment.ratio - report.users[key].withdraw.ratio + report.users[key].transferTarget.ratio - report.users[key].transferOrigin.ratio
    const ratioUsdAmount = report.users[key].investment.usd - report.users[key].withdraw.usd + report.users[key].transferTarget.usd - report.users[key].transferOrigin.usd
    const ratioBrlAmount = report.users[key].investment.brl - report.users[key].withdraw.brl + report.users[key].transferTarget.brl - report.users[key].transferOrigin.brl
    report.users[key].results.ratio = ratioAmount
    report.users[key].results.usd = ratioUsdAmount
    report.users[key].results.brl = ratioBrlAmount
  }

  // Calculando proporção nos aportes
  let totalRatio = 0
  for (const key in report.users) {
    totalRatio = totalRatio + report.users[key].results.ratio
  }
  for (const key in report.users) {
    report.users[key].aportProportional = report.users[key].results.ratio / totalRatio
  }

  
  console.log(report)

  // for (const key in report.users) {
  //   console.log('\n')
  //   console.log('User', key)
  //   console.log('Results', 'USD', report.users[key].results.usd, 'BRL', report.users[key].results.brl, 'RATIO', report.users[key].results.ratio)
  //   console.log('Investment', 'USD', report.users[key].investment.usd, 'BRL', report.users[key].investment.brl, 'RATIO', report.users[key].investment.ratio)
  //   console.log('Withdraw', 'USD', report.users[key].withdraw.usd, 'BRL', report.users[key].withdraw.brl, 'RATIO', report.users[key].withdraw.ratio)
  //   console.log('transferOrigin', 'USD', report.users[key].transferOrigin.usd, 'BRL', report.users[key].transferOrigin.brl, 'RATIO', report.users[key].transferOrigin.ratio)
  //   console.log('transferTarget', 'USD', report.users[key].transferTarget.usd, 'BRL', report.users[key].transferTarget.brl, 'RATIO', report.users[key].transferTarget.ratio)
  // }
  
  global.detailedConsole && console.log(`[araucaria-balance] Get cash book report done`)
  global.detailedConsole && console.log('\n')
  return report
}

export default getBookReport