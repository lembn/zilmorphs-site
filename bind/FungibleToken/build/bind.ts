//@ts-nocheck
/** @format */

import { BN, Long } from "@zilliqa-js/util";
import { Transaction, TxParams } from "@zilliqa-js/account";
import { Contract } from "@zilliqa-js/contract";
import * as T from "boost-zil";
import { signTransition } from "boost-zil";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { ContractSubStateQueryCast, partialState } from "boost-zil";

/**
 * this string is the signature of the hash of the source code
 * that was used to generate this sdk
 */
export const contractSignature =
  "hash_0xcf2d8ae08ca752e441b5bbdae80bea866a39e8c49b307dd0ad6b95c702236995";
const sig: {
  contractSignature: "hash_0xcf2d8ae08ca752e441b5bbdae80bea866a39e8c49b307dd0ad6b95c702236995";
} = { contractSignature };

export const code = `
(* sourceCodeHash=0xcf2d8ae08ca752e441b5bbdae80bea866a39e8c49b307dd0ad6b95c702236995 *)
(* sourceCodeHashKey=hash_0xcf2d8ae08ca752e441b5bbdae80bea866a39e8c49b307dd0ad6b95c702236995 *)
scilla_version 0




import IntUtils
library FungibleToken

let one_msg = 
  fun (msg : Message) => 
  let nil_msg = Nil {Message} in
  Cons {Message} msg nil_msg

let two_msgs =
fun (msg1 : Message) =>
fun (msg2 : Message) =>
  let msgs_tmp = one_msg msg2 in
  Cons {Message} msg1 msgs_tmp


type Error =
| CodeIsSender
| CodeInsufficientFunds
| CodeInsufficientAllowance

let make_error =
  fun (result : Error) =>
    let result_code = 
      match result with
      | CodeIsSender              => Int32 -1
      | CodeInsufficientFunds     => Int32 -2
      | CodeInsufficientAllowance => Int32 -3
      end
    in
    { _exception : "Error"; code : result_code }
  
let zero = Uint128 0


type Unit =
| Unit

let get_val =
  fun (some_val: Option Uint128) =>
  match some_val with
  | Some val => val
  | None => zero
  end





contract FungibleToken
(
  contract_owner: ByStr20,
  name : String,
  symbol: String,
  decimals: Uint32,
  init_supply : Uint128
)



field total_supply : Uint128 = init_supply

field balances: Map ByStr20 Uint128 
  = let emp_map = Emp ByStr20 Uint128 in
    builtin put emp_map contract_owner init_supply

field allowances: Map ByStr20 (Map ByStr20 Uint128) 
  = Emp ByStr20 (Map ByStr20 Uint128)





procedure ThrowError(err : Error)
  e = make_error err;
  throw e
end

procedure IsNotSender(address: ByStr20)
  is_sender = builtin eq _sender address;
  match is_sender with
  | True =>
    err = CodeIsSender;
    ThrowError err
  | False =>
  end
end

procedure AuthorizedMoveIfSufficientBalance(from: ByStr20, to: ByStr20, amount: Uint128)
  o_from_bal <- balances[from];
  bal = get_val o_from_bal;
  can_do = uint128_le amount bal;
  match can_do with
  | True =>
    
    new_from_bal = builtin sub bal amount;
    balances[from] := new_from_bal;
    
    get_to_bal <- balances[to];
    new_to_bal = match get_to_bal with
    | Some bal => builtin add bal amount
    | None => amount
    end;
    balances[to] := new_to_bal
  | False =>
    
    err = CodeInsufficientFunds;
    ThrowError err
  end
end








transition IncreaseAllowance(spender: ByStr20, amount: Uint128)
  IsNotSender spender;
  some_current_allowance <- allowances[_sender][spender];
  current_allowance = get_val some_current_allowance;
  new_allowance = builtin add current_allowance amount;
  allowances[_sender][spender] := new_allowance;
  e = {_eventname : "IncreasedAllowance"; token_owner : _sender; spender: spender; new_allowance : new_allowance};
  event e
end




transition DecreaseAllowance(spender: ByStr20, amount: Uint128)
  IsNotSender spender;
  some_current_allowance <- allowances[_sender][spender];
  current_allowance = get_val some_current_allowance;
  new_allowance =
    let amount_le_allowance = uint128_le amount current_allowance in
      match amount_le_allowance with
      | True => builtin sub current_allowance amount
      | False => zero
      end;
  allowances[_sender][spender] := new_allowance;
  e = {_eventname : "DecreasedAllowance"; token_owner : _sender; spender: spender; new_allowance : new_allowance};
  event e
end





transition Transfer(to: ByStr20, amount: Uint128)
  AuthorizedMoveIfSufficientBalance _sender to amount;
  e = {_eventname : "TransferSuccess"; sender : _sender; recipient : to; amount : amount};
  event e;
  
  msg_to_recipient = {_tag : "RecipientAcceptTransfer"; _recipient : to; _amount : zero; 
                      sender : _sender; recipient : to; amount : amount};
  msg_to_sender = {_tag : "TransferSuccessCallBack"; _recipient : _sender; _amount : zero; 
                  sender : _sender; recipient : to; amount : amount};
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end






transition TransferFrom(from: ByStr20, to: ByStr20, amount: Uint128)
  o_spender_allowed <- allowances[from][_sender];
  allowed = get_val o_spender_allowed;
  can_do = uint128_le amount allowed;
  match can_do with
  | True =>
    AuthorizedMoveIfSufficientBalance from to amount;
    e = {_eventname : "TransferFromSuccess"; initiator : _sender; sender : from; recipient : to; amount : amount};
    event e;
    new_allowed = builtin sub allowed amount;
    allowances[from][_sender] := new_allowed;
    
    msg_to_recipient = {_tag: "RecipientAcceptTransferFrom"; _recipient : to; _amount: zero; 
                        initiator: _sender; sender : from; recipient: to; amount: amount};
    msg_to_sender = {_tag: "TransferFromSuccessCallBack"; _recipient: _sender; _amount: zero; 
                    initiator: _sender; sender: from; recipient: to; amount: amount};
    msgs = two_msgs msg_to_recipient msg_to_sender;
    send msgs
  | False =>
    err = CodeInsufficientAllowance;
    ThrowError err
  end
end`;

export type TXLog = (t: Transaction, msg: string) => void;

/**
 * will try to send a transaction to the contract
 * @warning WILL NOT THROW ERRORS IF CONTRACT SIGNATURES ARE INVALID
 */
const dangerousFromJSONDeploy =
  (txLink: TXLog) =>
  ({ getVersion, getZil }: SDKResolvers) =>
  async (t: Omit<Omit<DeployData, "isDeploy">, "code">, gasLimit: Long) => {
    const { zil, teardown } = await getZil(true);
    const gasPrice = await getMinGasPrice(zil);

    const contract = newContract(zil, code, t.data);
    const [tx, con] = await contract.deploy(
      {
        version: getVersion(),
        gasPrice,
        gasLimit,
      },
      33,
      1000
    );
    await teardown();
    txLink(tx, "Deploy");
    if (!con.address) {
      if (con.error) {
        throw new Error(JSON.stringify(con.error, null, 2));
      }
      throw new Error("Contract failed to deploy");
    }
    return { tx, contract: con, address: new T.ByStr20(con.address) };
  };

/**
 * will try to send a transaction to the contract
 * @warning WILL NOT THROW ERRORS IF CONTRACT SIGNATURES ARE INVALID
 */
const dangerousFromJSONCall =
  (txLink: TXLog) =>
  ({ getVersion, getZil }: SDKResolvers) =>
  async (t: Omit<CallData, "isDeploy">, gasLimit: Long) => {
    const { zil, teardown } = await getZil(true);
    const gasPrice = await getMinGasPrice(zil);
    const contract = getContract(
      zil,
      new T.ByStr20(t.contractAddress).toSend()
    );

    const tx = await contract.call(
      t.contractTransitionName,
      t.data,
      {
        version: getVersion(),
        amount: new BN(t.amount),
        gasPrice,
        gasLimit,
      },
      33,
      1000
    );
    await teardown();
    txLink(tx, t.contractTransitionName);
    return { tx };
  };

export interface SDKResolvers {
  getZil: (
    requireSigner?: boolean
  ) => Promise<{ zil: Zilliqa; teardown: () => Promise<void> }>;
  getVersion: () => number;
  getNetworkName: () => string;
  txLog?: TXLog;
}

const RED = "\x1B[31m%s\x1b[0m";
const CYAN = "\x1B[36m%s\x1b[0m";
const GREEN = "\x1B[32m%s\x1b[0m";
const MAGENTA = "\x1B[35m%s\x1b[0m";

interface Value {
  vname: string;
  type: string;
  value: string | ADTValue | ADTValue[] | string[];
}
interface ADTValue {
  constructor: string;
  argtypes: string[];
  arguments: Value[] | string[];
}

interface DeployData {
  isDeploy: boolean;
  /**
   * the signature hash of the source code of the contract that this data interacts with
   */
  contractSignature: string;
  /**
   * code of the contract to deploy
   */
  code: string;
  data: any[];
}
interface CallData {
  isDeploy: boolean;
  /**
   * the signature hash of the source code of the contract that this data interacts with
   */
  contractSignature: string;
  /**
   * contract to send the transaction to
   */
  contractAddress: string;
  /**
   * zil amount to send
   */
  amount: string;
  /**
   * the name of the transition called in the target contract
   */
  contractTransitionName: string;
  data: any[];
}
/**
 * general interface of the data returned by toJSON() on the transitions
 */
type TransactionData = DeployData | CallData;

function getContract(
  zil: Zilliqa,
  a: string
): Contract & {
  call: (
    transition: string,
    args: Value[],
    params: Pick<
      TxParams,
      "version" | "amount" | "gasPrice" | "gasLimit" | "nonce" | "pubKey"
    >,
    attempts?: number,
    interval?: number,
    toDs?: boolean
  ) => ReturnType<Contract["call"]>;
} {
  const address = new T.ByStr20(a).toSend();
  //@ts-ignore
  return zil.contracts.at(address);
}

function newContract(zil: Zilliqa, code: string, init: Value[]): Contract {
  //@ts-ignore
  return zil.contracts.new(code, init);
}

async function getMinGasPrice(zil: Zilliqa) {
  const res = await zil.blockchain.getMinimumGasPrice();
  if (!res.result) {
    throw "no gas price";
  }
  return new BN(res.result);
}

export const FungibleToken = (resolvers: SDKResolvers) => {
  const defaultTxLog = (t: Transaction, msg: string) => {
    const id = t.id;
    const url = `https://viewblock.io/zilliqa/tx/0x${id}?network=${getNetworkName()}`;
    console.log(MAGENTA, msg);
    const receipt = t.getReceipt();
    if (receipt) {
      if (receipt.success) {
        console.log(GREEN, "Success.");
        console.log(GREEN, JSON.stringify(receipt.event_logs, null, 2))
      } else {
        console.log(RED, "Failed.");
        // console.log(RED, JSON.stringify(receipt, null, 2))
        if (receipt.errors) {
          Object.entries(receipt.exceptions).map(([k, v]) => {
            console.log(RED, v);
          });
        }
      }
    }
    console.log(CYAN, url);
  };
  const { getZil, getVersion, getNetworkName } = resolvers;
  const txLink = resolvers.txLog ? resolvers.txLog : defaultTxLog;

  return {
    /**
     * will try to send a transaction to the contract
     * @warning WILL NOT THROW ERRORS IF CONTRACT SIGNATURES ARE INVALID
     */
    dangerousFromJSONDeploy: dangerousFromJSONDeploy(txLink)(resolvers),

    /**
     * will try to send a transaction to the contract
     * @warning WILL NOT THROW ERRORS IF CONTRACT SIGNATURES ARE INVALID
     */
    dangerousFromJSONCall: dangerousFromJSONCall(txLink)(resolvers),

    deploy: (
      gasLimit: Long,
      __contract_owner: T.ByStr20,
      __name: T.ScillaString,
      __symbol: T.ScillaString,
      __decimals: T.Uint32,
      __init_supply: T.Uint128
    ) => {
      const transactionData = {
        isDeploy: true,
        ...sig,
        data: [
          {
            type: `Uint32`,
            vname: `_scilla_version`,
            value: "0",
          },
          {
            type: `ByStr20`,
            vname: `contract_owner`,
            value: __contract_owner.toSend(),
          },
          {
            type: `String`,
            vname: `name`,
            value: __name.toSend(),
          },
          {
            type: `String`,
            vname: `symbol`,
            value: __symbol.toSend(),
          },
          {
            type: `Uint32`,
            vname: `decimals`,
            value: __decimals.toSend(),
          },
          {
            type: `Uint128`,
            vname: `init_supply`,
            value: __init_supply.toSend(),
          },
        ],
      };
      return {
        /**
         * get data needed to perform this transaction
         * */
        toJSON: () => transactionData,
        /**
         * send the transaction to the blockchain
         * */
        send: async () =>
          dangerousFromJSONDeploy(txLink)(resolvers)(transactionData, gasLimit),
      };
    },

    state: <
      E extends "true" | "false",
      Query extends ContractSubStateQueryCast<
        "total_supply" | "balances" | "allowances"
      >
    >(
      query: Query,
      includeInit: E
    ) => ({
      get: (...contractAddresses: T.ByStr20[]) =>
        partialState(async () => {
          return (await getZil()).zil;
        })<
          typeof query,
          typeof includeInit,
          {
            contractAddress: typeof contractAddresses[0];
            includeInit: typeof includeInit;
            query: typeof query;
          },
          {
            contract_owner: any;
            name: any;
            symbol: any;
            decimals: any;
            init_supply: any;
          }
        >(
          ...contractAddresses.map((c) => ({
            contractAddress: c,
            includeInit,
            query,
          }))
        ),
    }),

    /**
     * interface for scilla contract with source code hash:
     * 0xcf2d8ae08ca752e441b5bbdae80bea866a39e8c49b307dd0ad6b95c702236995
     */
    calls: (a: T.ByStr20) => (gasLimit: Long) => {
      const signer = signTransition(a);
      return {
        /**
         * returns a signer that given an account will sign transition params in such manner:
         * ...params, nonce, transition name, contract address
         * */
        sign_IncreaseAllowance: signer("IncreaseAllowance"),
        IncreaseAllowance: (__spender: T.ByStr20, __amount: T.Uint128) => {
          const transactionData = {
            isDeploy: false,
            ...sig,
            contractAddress: a.toSend(),
            contractTransitionName: `IncreaseAllowance`,
            data: [
              {
                type: `ByStr20`,
                vname: `spender`,
                value: __spender.toSend(),
              },
              {
                type: `Uint128`,
                vname: `amount`,
                value: __amount.toSend(),
              },
            ],
            amount: new BN(0).toString(),
          };
          return {
            /**
             * get data needed to perform this transaction
             * */
            toJSON: () => transactionData,
            /**
             * send the transaction to the blockchain
             * */
            send: async () =>
              dangerousFromJSONCall(txLink)(resolvers)(
                transactionData,
                gasLimit
              ),
          };
        },

        /**
         * returns a signer that given an account will sign transition params in such manner:
         * ...params, nonce, transition name, contract address
         * */
        sign_DecreaseAllowance: signer("DecreaseAllowance"),
        DecreaseAllowance: (__spender: T.ByStr20, __amount: T.Uint128) => {
          const transactionData = {
            isDeploy: false,
            ...sig,
            contractAddress: a.toSend(),
            contractTransitionName: `DecreaseAllowance`,
            data: [
              {
                type: `ByStr20`,
                vname: `spender`,
                value: __spender.toSend(),
              },
              {
                type: `Uint128`,
                vname: `amount`,
                value: __amount.toSend(),
              },
            ],
            amount: new BN(0).toString(),
          };
          return {
            /**
             * get data needed to perform this transaction
             * */
            toJSON: () => transactionData,
            /**
             * send the transaction to the blockchain
             * */
            send: async () =>
              dangerousFromJSONCall(txLink)(resolvers)(
                transactionData,
                gasLimit
              ),
          };
        },

        /**
         * returns a signer that given an account will sign transition params in such manner:
         * ...params, nonce, transition name, contract address
         * */
        sign_Transfer: signer("Transfer"),
        Transfer: (__to: T.ByStr20, __amount: T.Uint128) => {
          const transactionData = {
            isDeploy: false,
            ...sig,
            contractAddress: a.toSend(),
            contractTransitionName: `Transfer`,
            data: [
              {
                type: `ByStr20`,
                vname: `to`,
                value: __to.toSend(),
              },
              {
                type: `Uint128`,
                vname: `amount`,
                value: __amount.toSend(),
              },
            ],
            amount: new BN(0).toString(),
          };
          return {
            /**
             * get data needed to perform this transaction
             * */
            toJSON: () => transactionData,
            /**
             * send the transaction to the blockchain
             * */
            send: async () =>
              dangerousFromJSONCall(txLink)(resolvers)(
                transactionData,
                gasLimit
              ),
          };
        },

        /**
         * returns a signer that given an account will sign transition params in such manner:
         * ...params, nonce, transition name, contract address
         * */
        sign_TransferFrom: signer("TransferFrom"),
        TransferFrom: (
          __from: T.ByStr20,
          __to: T.ByStr20,
          __amount: T.Uint128
        ) => {
          const transactionData = {
            isDeploy: false,
            ...sig,
            contractAddress: a.toSend(),
            contractTransitionName: `TransferFrom`,
            data: [
              {
                type: `ByStr20`,
                vname: `from`,
                value: __from.toSend(),
              },
              {
                type: `ByStr20`,
                vname: `to`,
                value: __to.toSend(),
              },
              {
                type: `Uint128`,
                vname: `amount`,
                value: __amount.toSend(),
              },
            ],
            amount: new BN(0).toString(),
          };
          return {
            /**
             * get data needed to perform this transaction
             * */
            toJSON: () => transactionData,
            /**
             * send the transaction to the blockchain
             * */
            send: async () =>
              dangerousFromJSONCall(txLink)(resolvers)(
                transactionData,
                gasLimit
              ),
          };
        },
      };
    },
  };
};
