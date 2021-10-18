import { ByStr20, createAccount, Uint128 } from "boost-zil";
import { SlotMachineSpinner } from "../SlotMachineSpinner";
import Big from "big.js";

describe("local", async () => {
  it("spinner follows distribution", async () => {
    // const spinner = new SlotMachineSpinner(
    //   [2, 3, 7, 42],
    //   0,
    //   new Big(Uint128.zil("10").toSend())
    // );

    // spinner.winThresholds.forEach((t) => console.log(t.toString()));

    // const l = spinner.getWinTiers();
    // l.setContractAddress(createAccount().address);
    // l.setADTname("234");
    // // l.setADTname
    // console.log(l.toSend());
    const ticketPrice = Uint128.zil("10");
    // const spinner = new SlotMachineSpinner(
    //   [2, 3, 7, 42],
    //   0,
    //   new Big(ticketPrice.toSend())
    // );

    // let sum = new Big(0);
    // const iterations = 10;
    // for (let x = 0; x < iterations; x++) {
    //   if (x % 10000 == 0) {
    //     console.log(`at ${x}`);
    //   }
    //   const tenSpins = new Array(10).fill(1).map((i) => spinner.spin());
    //   const won = tenSpins.reduce(
    //     (prev, cur) => prev.add(cur.winReward),
    //     new Big(0)
    //   );
    //   console.log(`Won ${won.div(new Big(10).pow(12)).toFixed(3)}`);
    //   sum = sum.add(won);
    // }
    // console.log(
    //   `On average won: ${sum
    //     .div(iterations)
    //     .div(new Big(10).pow(12))
    //     .toFixed(3)}`
    // );
  });
});
