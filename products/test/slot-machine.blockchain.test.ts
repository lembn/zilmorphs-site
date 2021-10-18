import {
  ByStr20,
  ByStr33,
  createAccount,
  CustomADT,
  List,
  Uint128,
  sendZIL,
  SDKResolvers,
} from "boost-zil";
import { Account } from "@zilliqa-js/account";
import { isolatedServer, getResolversFromAccount } from "boost-zil/lib/testing";
import { SlotMachine } from "../src/SlotMachine/build/bind";
import { Long } from "@zilliqa-js/zilliqa";
import { SlotMachineSpinner, Threshold } from "../SlotMachineSpinner";
import Big from "big.js";

let admin: ByStr20;
let adminPubKey: ByStr33;
let adminAcc: Account;
let slotMachine: ReturnType<typeof SlotMachine>;
let fundingAccount: ReturnType<typeof createAccount>;
let resolvers: SDKResolvers;

const limit = Long.fromString("60000");

describe("on blockchain", async () => {
  before(async () => {
    await isolatedServer.start();
    adminAcc = new Account(isolatedServer.submitterPrivateKey);
    admin = new ByStr20(adminAcc.address);
    adminPubKey = new ByStr33(adminAcc.publicKey);
    resolvers = getResolversFromAccount(adminAcc);
    slotMachine = SlotMachine(resolvers);
    fundingAccount = createAccount();
  });
  after(async () => {
    await isolatedServer.kill();
  });
  it("works lol", async () => {
    const ticketPrice = Uint128.zil("10");
    const vault = createAccount();
    const { address: slotMachineAddr } = await slotMachine
      .deploy(
        limit,
        adminPubKey,
        vault.address,
        ticketPrice,
        // 30% cut
        new Uint128("3000")
      )
      .send();

    const callMachine = slotMachine.calls(slotMachineAddr)(limit);

    // FUND AS ADMIN
    await callMachine.AddFunds(Uint128.zil("1000")).send();

    // SETUP SLOT MACHINE
    const spinner = new SlotMachineSpinner(
      [2, 3, 7, 42],
      0,
      new Big(ticketPrice.toSend()),
      slotMachineAddr
    );

    // SET WIN TIERS
    await callMachine.SetWinTiers(spinner.getWinTiers()).send();

    const stats = [];

    for (let x = 0; x < 1; x++) {
      const anon = createAccount();
      await sendZIL(resolvers, anon.address, Uint128.zil("300"));

      const anonResolvers = getResolversFromAccount(anon.account);
      const anonSlotMachine = SlotMachine(anonResolvers).calls(slotMachineAddr)(
        Long.fromString("60000")
      );
      // buy ten tickets
      await anonSlotMachine.AddFunds(Uint128.zil("100")).send();
      // stat is the morph stat
      const morphStat = Math.floor(Math.random() * 100);
      const tenSpins = new Array(10)
        .fill(1)
        .map((i, spinNum) =>
          spinner.spin(anon.address, morphStat, spinNum, 3000)
        );
      console.log(tenSpins);
      // console.log()
      const signed = Threshold.signBatchThresholdJSON(adminAcc, ...tenSpins);

      await anonSlotMachine
        .ClaimSpins(anon.address, new List(signed.map((s) => s.data)))
        .send();
      stats.push(
        new Big((await slotMachine.balance(slotMachineAddr)).toSend())
          .div(new Big(10).pow(12))
          .toFixed(2)
      );
    }
    console.log(`Summary stats ${stats}`);
    console.log(
      `Fees ${new Big((await slotMachine.balance(vault.address)).toSend())
        .div(new Big(10).pow(12))
        .toFixed(2)}`
    );
  });
});
