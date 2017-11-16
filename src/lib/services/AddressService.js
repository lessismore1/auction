import { eth } from "decentraland-commons";
import {
  AddressState,
  DistrictEntry,
  LockedBalanceEvent,
  ReturnTransaction
} from "../models";

const LAND_MANA_COST = 1000;
const BEFORE_NOVEMBER_DISCOUNT = 1.15;
const AFTER_NOVEMBER_DISCOUNT = 1.1;

const fillByMonth = items => {
  const months = new Array(12).fill(0);
  const groups = months.reduce(
    (obj, _, index) => Object.assign(obj, { [index + 1]: 0 }),
    {}
  );

  for (let { month, mana } of items) {
    groups[month] = parseInt(mana, 10);
  }
  return groups;
};

const calculateTotalForMonths = (
  monthlyLockedBalancesToDistricts,
  monthlyLockedBalancesTotal,
  months
) => {
  return months.reduce((total, index) => {
    return (
      total +
      monthlyLockedBalancesTotal[index] -
      monthlyLockedBalancesToDistricts[index]
    );
  }, 0);
};

export default class AddressService {
  constructor() {}

  static async lockedMANABalanceOf(address) {
    // get MANA locked to districts
    const monthlyLockedBalancesToDistricts = await DistrictEntry.getMonthlyLockedBalanceByAddress(
      address,
      LAND_MANA_COST
    ).then(balances => fillByMonth(balances));

    // get total MANA locked to terraform
    const monthlyLockedBalancesTotal = await LockedBalanceEvent.getMonthlyLockedBalanceByAddress(
      address
    ).then(balances => fillByMonth(balances));

    // adjust MANA balances to bonuses
    const beforeNovBalanceToAuction = calculateTotalForMonths(
      monthlyLockedBalancesToDistricts,
      monthlyLockedBalancesTotal,
      [9, 10]
    );
    const afterNovBalanceToAuction = calculateTotalForMonths(
      monthlyLockedBalancesToDistricts,
      monthlyLockedBalancesTotal,
      [11, 12, 1]
    );

    // total MANA locked in districts
    const totalLockedToDistricts = Object.values(
      monthlyLockedBalancesToDistricts
    ).reduce((total, value) => total + value, 0);

    // total MANA locked
    return (
      Math.floor(beforeNovBalanceToAuction * BEFORE_NOVEMBER_DISCOUNT) +
      Math.floor(afterNovBalanceToAuction * AFTER_NOVEMBER_DISCOUNT) +
      totalLockedToDistricts
    );
  }
}
