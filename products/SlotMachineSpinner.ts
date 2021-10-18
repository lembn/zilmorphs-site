import Big from "big.js";
import { randomBytes } from "crypto";
import { BN } from "@zilliqa-js/zilliqa";
import {
  CustomADT,
  List,
  Uint128,
  ByStr20,
  ByStr33,
  ByStr64,
  signWithAccount,
  concatHashed,
} from "boost-zil";
import { Account } from "@zilliqa-js/account";
import { Signable } from "boost-zil/lib/signable/shared";

const maxUint256 = new Big("2").pow(256).sub(1);
const one = new Big(1);
const zero = new Big(0);

//target: ByStr20, morphStat: number, spinNum: number,
export interface ThresholdJSON {
  from: string;
  to: string;
  ticketMultiplier: number;
  ticketPrice: string;
  winAmt: string;
  morphBonus: string;
  tierIndex: number;
  target: string;
  morphStat: number;
  spinNum: number;
  slotMachineAddr: string;
}

export class Threshold {
  winReward: Big;
  static signBatchThresholdJSON(
    adminAcc: Account,
    ...thresholds: ThresholdJSON[]
  ) {
    thresholds.sort((a, b) => a.spinNum - b.spinNum);
    return thresholds.map(Threshold.signThresholdJSON(adminAcc));
  }
  private static signThresholdJSON(adminAcc: Account) {
    return (json: ThresholdJSON) => {
      const morphStat = json.morphStat;
      if (morphStat > 100) {
        throw new Error("invalid morph stat");
      }
      // disount denominator is 100 00 thus
      const discount = new Big(morphStat).mul(100).toFixed(0);
      return new Threshold(
        new Big(json.from),
        new Big(json.to),
        json.ticketMultiplier,
        new Big(json.ticketPrice),
        json.tierIndex
      ).toMetaTx(
        new ByStr20(json.target),
        new Uint128(discount),
        new Uint128(json.spinNum.toString()),
        adminAcc,
        new ByStr20(json.slotMachineAddr)
      );
    };
  }
  constructor(
    public from: Big,
    public to: Big,
    public ticketMultiplier: number,
    public ticketPrice: Big,
    public tierIndex: number
  ) {
    this.winReward = ticketPrice.mul(ticketMultiplier);
  }
  // range 0 to 1
  isWithinThreshold(roll: Big) {
    // first assert roll within range 0 to 1
    if (roll.lt(zero) || roll.gt(one)) {
      throw new Error("roll invalid range");
    }
    if (roll.gte(this.from) && roll.lte(this.to)) {
      // within range
      return true;
    } else {
      return false;
    }
  }
  toString() {
    return JSON.stringify(
      {
        from: this.from.toString(),
        to: this.to.toString(),
        ticketMultiplier: this.ticketMultiplier,
        tierIndex: this.tierIndex,
        winReward: this.winReward,
        ticketPrice: this.ticketPrice,
      },
      null,
      2
    );
  }
  toJSON(
    target: ByStr20,
    morphStat: number,
    spinNum: number,
    slotMachineAddr: ByStr20,
    cut: number
  ): ThresholdJSON {
    // disount denominator is 100 00 thus
    const discount = new Big(morphStat).mul(100);
    const morphBonusFraction = discount.div(10000);
    const cutFraction = new Big(cut).div(10000);
    const morphBonus = this.winReward.mul(morphBonusFraction);
    return {
      from: this.from.toString(),
      to: this.to.toString(),
      ticketMultiplier: this.ticketMultiplier,
      tierIndex: this.tierIndex,
      ticketPrice: this.ticketPrice.toString(),
      morphStat,
      target: target.toSend(),
      spinNum,
      slotMachineAddr: slotMachineAddr.toSend(),
      morphBonus: morphBonus.toFixed(0),
      winAmt: this.winReward
        .sub(cutFraction.mul(this.winReward))
        .add(morphBonus)
        .toFixed(0),
    };
  }
  toMetaTx(
    target: ByStr20,
    discount: Uint128,
    spinNum: Uint128,
    admin: Account,
    slotMachineAddr: ByStr20
  ): {
    data: CustomADT<[Uint128, Uint128, Uint128, ByStr64]>;
    chequeHash: string;
    spinNum: number;
  } {
    // ByStr20 Uint128 Uint128 Uint128 ByStr20
    // Signable target (discount spin_num win_tier) _this_address;
    const toSign: Signable[] = [
      target,
      discount,
      spinNum,
      new Uint128(this.tierIndex.toString()),
      slotMachineAddr,
    ];
    const chequeHash = concatHashed(
      ...[
        target,
        discount,
        spinNum,
        new Uint128(this.tierIndex.toString()),
        slotMachineAddr,
      ].map((t) => t.toHash())
    );
    const signature = signWithAccount(chequeHash, admin);
    //create data object
    toSign.shift();
    toSign.pop();
    toSign.push(signature);

    // last time I checked ts I know how to count to 4
    return {
      data: new CustomADT(
        ...(toSign as unknown as [Uint128, Uint128, Uint128, ByStr64])
      ),
      chequeHash,
      spinNum: parseInt(spinNum.toSend()),
    };
  }
}

/**
 * A slot machine that has the same expected take value
 * for each of its win tiers
 */
export class SlotMachineSpinner {
  private winTiersLength: number;
  winTierAndChance: {
    ticketMultiplier: number;
    chance: Big;
    tierIndex: number;
  }[] = [];
  // a list with thresholds for which a number from 0 to 1 has to land in order
  // to consider the ticket a winning one
  winThresholds: Threshold[];
  private getWinChangeForWinTier(timesTicketPrice: number) {
    return new Big(1)
      .sub(this.percentageProfit)
      .div(this.winTiersLength)
      .mul(new Big(1).div(timesTicketPrice));
  }
  constructor(
    public winTiers: number[],
    public percentageProfit: number,
    public ticketPrice: Big,
    public thisAddress: ByStr20
  ) {
    this.winTiersLength = winTiers.length;
    this.winTierAndChance = winTiers.map((w, i) => ({
      tierIndex: i + 1,
      ticketMultiplier: w,
      chance: this.getWinChangeForWinTier(w),
    }));
    // need to sort the chance
    this.winTierAndChance.sort((a, b) => a.chance.sub(b.chance).toNumber());
    const thresholds: Threshold[] = [];
    let curfrom = new Big(0);
    for (const tier of this.winTierAndChance) {
      thresholds.push(
        new Threshold(
          curfrom,
          curfrom.add(tier.chance),
          tier.ticketMultiplier,
          ticketPrice,
          tier.tierIndex
        )
      );
      curfrom = curfrom.add(tier.chance);
    }
    // loosing tier
    thresholds.push(new Threshold(curfrom, one, 0, ticketPrice, 0));
    this.winThresholds = thresholds;
    this.winTierAndChance.map((i) =>
      console.log(
        `win ${i.ticketMultiplier} chance ${i.chance
          .mul(new Big(100))
          .toFixed(3)}%`
      )
    );
  }
  getRandom() {
    const thirtytwo = randomBytes(32);
    const uint256 = new Big(
      new BN(thirtytwo.toString("hex"), "hex").toString()
    );
    const normalizedOne = uint256.div(maxUint256);
    return normalizedOne;
  }
  // stat from 100 to 0
  // if stat.
  spin(target: ByStr20, morphStat: number, spinNum: number, cut: number) {
    const random = this.getRandom();
    for (const threshold of this.winThresholds) {
      if (threshold.isWithinThreshold(random)) {
        return threshold.toJSON(
          target,
          morphStat,
          spinNum,
          this.thisAddress,
          cut
        );
      }
    }
    throw new Error("impossible event");
  }
  getWinTiers() {
    return new List(
      this.winThresholds.map(
        (t) =>
          new CustomADT(
            new Uint128(t.tierIndex.toString()),
            new Uint128(t.winReward.toString())
          )
      )
    );
  }
}
