// Copyright 2020, M. Burruss, All Rights Reserved.
"use strict";
/************************************
 *  IMPORTS
 ************************************/
const mathjs = require('mathjs')


/************************************
 *  CONSTANTS
 ************************************/

const CurrentRevenue = 24578; // in millions

const Last10KRevenue = 21461;
const YearsSinceLast10K = 0.75;

const OperatingIncomeOrEBIT = -69;
const Last10KOperatingIncomeOrEBIT = -388;

const CurrentInterestExpense = 685;
const Last10KCurrentInterestExpense = 663;

const CurrentBookValueEquity = 6618;
const Last10KCurrentBookValueEquity = 4923.2;

const CurrentBookValueOfDebt = 13419;
const Last10KCurrentBookValueOfDebt = 13827.3;

const hasRnD = true;
const hasOperatingLeaseCommitments = true;

const CashAndMarketableSecurities = 6514;
const Last10KCashAndMarketableSecurities = 3685.6;

const CrossHoldingsAndNonOperatingAssets = null;
const Last10KCrossHoldingsAndNonOperatingAssets = null;

const MinorityInterests = null;
const Last10KMinorityInterests = null;

const SharesOutstanding = 177; // in millions
const StockPrice = 581;

const EffectiveTaxRate = .25;
const MarginalTaxRate = .25;

const AnnualizedDividendYield = 0.0;
/************************************
 *  ADJUSTABLE CONSTANTS
 ************************************/

let RevenueGrowthRateDuration = 5; // years
let RevenueGrowthRate = 0.25;
let EBITRateDuration = 10;
let EBITRate = 0.12;
let ConvergenceYear = 5;

let SalesToCapitalRation = [
    {
        start: 1,
        end: 5,
        ratio: 3
    },
    {
        start: 6,
        end: 10,
        ratio: 5
    },
]

/************************************
 *  RESEARCH CONSTANTS
 ************************************/

const RiskFreeRate = 0.0175;
const InitialCostCapital = 0.07;

const hasOutstandingOptions = true;
const OutstandingOptions = 32;
const AverageStrikePrice = 350;
const AverageMaturity = 5;
const StockPriceVolatility = 0.4; // standard deviation of the % daily change (maybe annualize)


/************************************
 *  DCF ASSUMPTIONS (All be Overidden)
 ************************************/

let ExpectedCostOfCapital = RiskFreeRate + 0.045; // default (After EBIT Duration)
ExpectedCostOfCapital = 0.074; // set

let ExpectedReturnOnCapital = ExpectedCostOfCapital; // default (After EBIT Duration)
ExpectedCostOfCapital = 0.12;

let ChanceOfFailure = 0.0; // default (After EBIT Duration)
ChanceOfFailure = 0.1;

let DistressProceedsTo = 'V'; // V = estimated fair value of company and B = book value of capital
let DistressProceedsPercentage = 0.5; // how much of proceeds you get

let IgnoreMarginalTaxRate = false; // use effective marginal rate

let LossesPriorYear = 0; // default
LossesPriorYear = 250;

let GrowthRatePerpetuity = RiskFreeRate; // default
GrowthRatePerpetuity = 0.01;

let TrappedCash = 0.0; // default
TrappedCash = 140;

let TrappedCashTaxRate = 0.0
TrappedCashTaxRate = 0.15;

/************************************
 *  HELPER FUNCTIONS
 ************************************/

function cdfNormal (x, mean=0, standardDeviation=1) {
    return (1 - mathjs.erf((mean - x ) / (Math.sqrt(2) * standardDeviation))) / 2
  }

/************************************
 *  DCF FUNCTIONS
 ************************************/
  
const OptionValue = () =>{
    let iterations = 1000;
    let delta = 0.001;
    let Sadj = AverageStrikePrice;
    let Sadj_prev = null;
    let ValueOptionsOutstanding = null;
    for (let i = 0; i < iterations; ++i){
        if (Sadj_prev && Math.abs(Sadj_prev - Sadj) < delta){
            break;
        }
        let Kadj = AverageStrikePrice;
        let DividendAdjustedRate = RiskFreeRate - AnnualizedDividendYield;
        let d1 = (Math.log(Sadj/Kadj) + ((DividendAdjustedRate + (StockPriceVolatility**2)/2)*AverageMaturity)) / Math.sqrt(StockPriceVolatility**2*AverageMaturity);
        let d2 = d1 - StockPriceVolatility*Math.sqrt(AverageMaturity)
        let Cum1 = cdfNormal(d1);
        let Cum2 = cdfNormal(d2);
        let ValuePerOption = Math.exp(-1.0*AnnualizedDividendYield * AverageMaturity)*Sadj*Cum1 - Math.exp(-1*RiskFreeRate*AverageMaturity)*Kadj*Cum2;
        ValueOptionsOutstanding = ValuePerOption * OutstandingOptions;
        Sadj = (StockPrice*SharesOutstanding+ValuePerOption*OutstandingOptions) / (SharesOutstanding+OutstandingOptions);
    }
    return {
        "ValueOptionsOutstanding": ValueOptionsOutstanding
    };
};

const CostOfCapital = () => {
    
}


