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
    "hash_0x61a78357331fc23ed15e2b617b817b811d80ff32b41ba06fe59f4fdd59ca25c7";
const sig: {
    contractSignature: "hash_0x61a78357331fc23ed15e2b617b817b811d80ff32b41ba06fe59f4fdd59ca25c7";
} = { contractSignature };

export const code = `
(* sourceCodeHash=0x61a78357331fc23ed15e2b617b817b811d80ff32b41ba06fe59f4fdd59ca25c7 *)
(* sourceCodeHashKey=hash_0x61a78357331fc23ed15e2b617b817b811d80ff32b41ba06fe59f4fdd59ca25c7 *)
scilla_version 0




import BoolUtils IntUtils
library Zilmorphs


type Dummy =
| Dummy

type Operation =
| Add
| Sub


let none = None {ByStr20}
let zero = Uint256 0
let one = Uint256 1
let false = False
let true = True
let verdad = Dummy
let add_operation = Add
let sub_operation = Sub


let one_msg =
  fun (msg : Message) =>
    let nil_msg = Nil {Message} in
    Cons {Message} msg nil_msg

let two_msgs =
  fun (msg1 : Message) =>
  fun (msg2 : Message) =>
    let msgs_tmp = one_msg msg2 in
    Cons {Message} msg1 msgs_tmp

let get_uint256 =
  fun (option_uint256: Option Uint256) =>
    match option_uint256 with
    | Some val => val
    | None => zero
    end

let is_giveaway_minter =
  fun (address: ByStr20) =>
  fun (giveaway_address: Option ByStr20) =>
    match giveaway_address with
    | Some val =>
      let is_giveaway = builtin eq address val in
      match is_giveaway with
      | True => True
      | False => False
      end
    | None => False
    end

let get_id =
  fun (is_giveaway: Bool) =>
  fun (current_reserved: Uint256) =>
  fun (current_public: Uint256) =>
  fun (reserved_supply: Uint256) =>
    match is_giveaway with
    | True =>
      builtin add current_reserved one
    | False =>
      let current_id = builtin add reserved_supply current_public in
      builtin add current_id one
    end


type Error =
  | CodeNotContractOwner
  | CodeIsSelf
  | CodeTokenExists
  | CodeNotMinter
  | CodeNotApproved
  | CodeNotTokenOwner
  | CodeNotFound
  | CodeNotOperator
  | CodeNotOwnerOrOperator
  | CodeNotApprovedSpenderOrOperator
  | CodeNotPendingOwner
  | CodePendingOwnerNotEmpty
  | CodeTokenLocked
  | CodeTokenAlreadyUnlocked
  | CodeMaxSupplyExceeded
  | CodeMaxReservedSupplyExceeded
  | CodeMaxPublicSupplyExceeded

let make_error =
  fun (result : Error) =>
    let result_code =
      match result with
      | CodeNotContractOwner             => Int32 -1
      | CodeIsSelf                       => Int32 -2
      | CodeTokenExists                  => Int32 -3
      | CodeNotMinter                    => Int32 -4
      | CodeNotApproved                  => Int32 -5
      | CodeNotTokenOwner                => Int32 -6
      | CodeNotFound                     => Int32 -7
      | CodeNotOperator                  => Int32 -8
      | CodeNotOwnerOrOperator           => Int32 -9
      | CodeNotApprovedSpenderOrOperator => Int32 -10
      | CodeNotPendingOwner              => Int32 -11
      | CodePendingOwnerNotEmpty         => Int32 -12
      | CodeTokenLocked                  => Int32 -13
      | CodeTokenAlreadyUnlocked         => Int32 -14
      | CodeMaxSupplyExceeded            => Int32 -15
      | CodeMaxReservedSupplyExceeded    => Int32 -16
      | CodeMaxPublicSupplyExceeded      => Int32 -17
      end
    in
    { _exception : "Error"; code : result_code }





contract Zilmorphs
(
  contract_owner: ByStr20,
  name : String,
  symbol: String,
  max_supply: Uint256,
  reserved_supply: Uint256,
  provenance_hash: ByStr32
)




field current_owner : Option ByStr20 = Some {ByStr20} contract_owner


field pending_owner : Option ByStr20 = none


field minters: Map ByStr20 Dummy = Emp ByStr20 Dummy


field giveaway_minter: Option ByStr20 = none


field token_owners: Map Uint256 ByStr20 = Emp Uint256 ByStr20


field is_token_locked: Bool = True


field owned_token_count: Map ByStr20 Uint256 = Emp ByStr20 Uint256



field token_approvals: Map Uint256 ByStr20 = Emp Uint256 ByStr20


field operator_approvals: Map ByStr20 (Map ByStr20 Dummy)
                            = Emp ByStr20 (Map ByStr20 Dummy)


field token_uris: Map Uint256 String = Emp Uint256 String


field total_supply: Uint256 = Uint256 0


field total_reserved: Uint256 = Uint256 0


field total_public: Uint256 = Uint256 0


field public_supply: Uint256 = builtin sub max_supply reserved_supply


field base_uri: String = "https://api.thebear.market/metadata/"


procedure ThrowError(err : Error)
  e = make_error err;
  throw e
end



procedure IsNotSelf(address_a: ByStr20, address_b: ByStr20)
  is_self = builtin eq address_a address_b;
  match is_self with
  | False =>
  | True =>
    err = CodeIsSelf;
    ThrowError err
  end
end

procedure IsMinter(address: ByStr20)
  is_minter <- exists minters[address];
  match is_minter with
  | True =>
  | False =>
    err = CodeNotMinter;
    ThrowError err
  end
end

procedure IsContractOwner()
  maybe_current_owner <- current_owner;
  match maybe_current_owner with
  | Some current_contract_owner =>
    is_owner = builtin eq current_contract_owner _sender;
    match is_owner with
    | True =>
    | False =>
      err = CodeNotContractOwner;
      ThrowError err
    end
  | None =>
    err = CodeNotContractOwner;
    ThrowError err
  end
end

procedure IsPendingOwner(address: ByStr20)
  maybe_pending_owner <- pending_owner;
  match maybe_pending_owner with
  | Some current_pending_owner =>
    is_pending_owner = builtin eq current_pending_owner address;
    match is_pending_owner with
    | True =>
    | False =>
      err = CodeNotPendingOwner;
      ThrowError err
    end
  | None =>
    err = CodeNotPendingOwner;
    ThrowError err
  end
end

procedure IsTokenOwner(token_id: Uint256, address: ByStr20)
  some_token_owner <- token_owners[token_id];
  match some_token_owner with
  | Some addr =>
    is_token_owner = builtin eq addr address;
    match is_token_owner with
    | True =>
    | False =>
      err = CodeNotTokenOwner;
      ThrowError err
    end
  | None =>
    err = CodeNotFound;
    ThrowError err
  end
end


procedure IsApprovedForAll(token_owner: ByStr20, operator: ByStr20)
  is_operator_approved <- exists operator_approvals[token_owner][operator];
  match is_operator_approved with
  | True =>
  | False =>
    err = CodeNotOperator;
    ThrowError err
  end
end

procedure IsOwnerOrOperator(token_owner: ByStr20)
  is_token_owner = builtin eq _sender token_owner;
  is_approved_for_all <- exists operator_approvals[token_owner][_sender];
  is_authorized = orb is_token_owner is_approved_for_all;
  match is_authorized with
  | True =>
  | False =>
    err = CodeNotOwnerOrOperator;
    ThrowError err
  end
end

procedure IsApprovedSpenderOrOperator(token_id: Uint256, token_owner: ByStr20)
  some_token_approval <- token_approvals[token_id];
  is_approved = match some_token_approval with
    | None => False
    | Some approved_address =>
      builtin eq _sender approved_address
    end;
  is_operator <- exists operator_approvals[token_owner][_sender];
  is_authorized = orb is_approved is_operator;
  match is_authorized with
  | True =>
  | False =>
    err = CodeNotApprovedSpenderOrOperator;
    ThrowError err
  end
end

procedure IsTransferable(sender: ByStr20)
  token_locked <- is_token_locked;
  match token_locked with
  | False =>
  | True =>
    is_owner = builtin eq sender contract_owner;
    match is_owner with
    | True =>
    | False =>
      err = CodeTokenLocked;
      ThrowError err
    end
  end
end

procedure IsNotExceedingMaxSupply()
  current_supply <- total_supply;
  is_not_exceeding = uint256_le current_supply max_supply;
  match is_not_exceeding with
    | True =>
    | False =>
      err = CodeMaxSupplyExceeded;
      ThrowError err
  end
end

procedure IsTokenNotExist(token_id: Uint256)
  token_exist <- exists token_owners[token_id];
  match token_exist with
  | False =>
  | True =>
    err = CodeTokenExists;
    ThrowError err
  end
end

procedure NoPendingOwner()
  maybe_pending_owner <- pending_owner;
  match maybe_pending_owner with
  | Some p =>
    err = CodePendingOwnerNotEmpty;
    ThrowError err
  | None =>
  end
end



procedure UpdateTokenCount(operation: Operation, address: ByStr20)
  match operation with
  | Add =>
    some_to_count <- owned_token_count[address];
    new_to_count =
      let current_count = get_uint256 some_to_count in
      builtin add current_count one;
    owned_token_count[address] := new_to_count;
    current_supply <- total_supply;
    new_supply = builtin add current_supply one;
    total_supply := new_supply;
    IsNotExceedingMaxSupply
  | Sub =>
    some_from_count <- owned_token_count[address];
    new_from_count =
      let current_count = get_uint256 some_from_count in
        let is_zero = builtin eq current_count zero in
          match is_zero with
          | True => zero
          | False => builtin sub current_count one
          end;
    owned_token_count[address] := new_from_count;
    current_supply <- total_supply;
    new_supply = builtin sub current_supply one;
    total_supply := new_supply
  end
end

procedure UpdateTokenURI(token_id: Uint256)
  token_exist <- exists token_owners[token_id];
  match token_exist with
  | False =>
    err = CodeNotFound;
    ThrowError err
  | True =>
    base <- base_uri;
    token_id_string = builtin to_string token_id;
    token_uri = builtin concat base token_id_string;
    token_uris[token_id] := token_uri
  end
end

procedure CheckAndSetSupply(is_reserved_token: Bool)
  match is_reserved_token with
  | True =>
    current_total_reserved <- total_reserved;
    sufficient_reserved_supply = uint256_lt current_total_reserved reserved_supply;
    match sufficient_reserved_supply with
      | True =>
        new_total_reserved = builtin add current_total_reserved one;
        total_reserved := new_total_reserved
      | False =>
        err = CodeMaxReservedSupplyExceeded;
        ThrowError err
      end
  | False =>
    current_total_public <- total_public;
    max_public_supply <- public_supply;
    sufficient_public_supply = uint256_lt current_total_public max_public_supply;
    match sufficient_public_supply with
      | True =>
        new_total_public = builtin add current_total_public one;
        total_public := new_total_public
      | False =>
        err = CodeMaxPublicSupplyExceeded;
        ThrowError err
      end
  end
end




transition BalanceOf(address: ByStr20)
  some_bal <- owned_token_count[address];
  balance = get_uint256 some_bal;
  msg_to_sender = { _tag : "BalanceOfCallBack"; _recipient : _sender; _amount : Uint128 0;
                   balance : balance};
  msgs = one_msg msg_to_sender;
  send msgs
end


transition TotalSupply()
  current_supply <- total_supply;
  msg_to_sender = { _tag : "TotalSupplyCallBack"; _recipient : _sender; _amount : Uint128 0;
                   total_supply : current_supply};
  msgs = one_msg msg_to_sender;
  send msgs
end


transition Name()
  msg_to_sender = { _tag : "NameCallBack"; _recipient : _sender; _amount : Uint128 0;
                   name : name};
  msgs = one_msg msg_to_sender;
  send msgs
end


transition Symbol()
  msg_to_sender = { _tag : "SymbolCallBack"; _recipient : _sender; _amount : Uint128 0;
                   symbol : symbol};
  msgs = one_msg msg_to_sender;
  send msgs
end


transition GetApproved(token_id: Uint256)
  some_token_approval <- token_approvals[token_id];
  match some_token_approval with
  | Some addr =>
    msg_to_sender = { _tag : "GetApprovedCallBack"; _recipient : _sender; _amount : Uint128 0;
                      approved_addr : addr; token_id : token_id};
    msgs = one_msg msg_to_sender;
    send msgs
  | None =>
    err = CodeNotApproved;
    ThrowError err
  end
end


transition GetTokenURI(token_id: Uint256)
  some_token_uri <- token_uris[token_id];
  match some_token_uri with
  | Some token_uri =>
    msg_to_sender = { _tag : "GetTokenURICallBack"; _recipient : _sender; _amount : Uint128 0;
                      token_uri : token_uri};
    msgs = one_msg msg_to_sender;
    send msgs
  | None =>
    err = CodeNotFound;
    ThrowError err
  end
end


transition CheckTokenOwner(token_id: Uint256, address: ByStr20)
  IsTokenOwner token_id address;
  msg_to_sender = { _tag : "IsOwnerCallBack"; _recipient : _sender; _amount : Uint128 0};
  msgs = one_msg msg_to_sender;
  send msgs
end


transition CheckApprovedForAll(token_owner: ByStr20, operator: ByStr20)
  IsApprovedForAll token_owner operator;
  msg_to_sender = { _tag : "IsApprovedForAllCallBack"; _recipient : _sender; _amount : Uint128 0};
  msgs = one_msg msg_to_sender;
  send msgs
end





transition ConfigureMinter(minter: ByStr20)
  IsContractOwner;
  some_minter <- minters[minter];
  match some_minter with
  | Some Dummy =>
    
    delete minters[minter];
    e = {_eventname: "RemovedMinterSuccess"; minter: minter};
    event e
  | None =>
    
    minters[minter] := verdad;
    e = {_eventname: "AddMinterSuccess"; minter: minter};
    event e
  end
end




transition Mint(to: ByStr20, token_uri: String)
  
  IsMinter _sender;

  
  gm <- giveaway_minter;
  current_reserved <- total_reserved;
  current_public <- total_public;
  is_giveaway = is_giveaway_minter _sender gm;
  token_id = get_id is_giveaway current_reserved current_public reserved_supply;

  
  CheckAndSetSupply is_giveaway;
  IsTokenNotExist token_id;
  token_owners[token_id] := to;

  
  UpdateTokenCount add_operation to;
  UpdateTokenURI token_id;
  actual_token_uri <- token_uris[token_id];
  match actual_token_uri with
  | None =>
    err = CodeNotFound;
    ThrowError err
  | Some uri =>
    
    e = {_eventname: "MintSuccess"; by: _sender; recipient: to;
    token_id: token_id; token_uri: uri};
    event e;
    
    msg_to_recipient = { _tag : "RecipientAcceptMint"; _recipient : to; _amount : Uint128 0 };
    msg_to_sender = { _tag : "MintCallBack"; _recipient : _sender; _amount : Uint128 0;
                      recipient : to; token_id : token_id; token_uri : uri };
    msgs = two_msgs msg_to_recipient msg_to_sender;
    send msgs
  end
end



transition Burn(token_id: Uint256)
  
  some_token_owner <- token_owners[token_id];
  match some_token_owner with
  | None =>
    err = CodeNotFound;
    ThrowError err
  | Some token_owner =>
    IsOwnerOrOperator token_owner;
    
    delete token_owners[token_id];
    delete token_approvals[token_id];
    delete token_uris[token_id];
    
    UpdateTokenCount sub_operation token_owner;
    e = {_eventname: "BurnSuccess"; initiator: _sender; burn_address: token_owner; token: token_id};
    event e;
    msg_to_sender = { _tag : "BurnCallBack"; _recipient : _sender; _amount : Uint128 0;
                      initiator : _sender; burn_address : token_owner; token_id : token_id };
    msgs = one_msg msg_to_sender;
    send msgs
  end
end





transition SetApprove(to: ByStr20, token_id: Uint256)
  some_token_owner <- token_owners[token_id];
  match some_token_owner with
  | None =>
    err = CodeNotFound;
    ThrowError err
  | Some token_owner =>
    IsOwnerOrOperator token_owner;
    is_approved <- exists token_approvals[token_id];
    match is_approved with
    | True =>
      
      delete token_approvals[token_id];
      e = {_eventname: "RemoveApprovalSuccess"; initiator: _sender; removed_spender: to; token_id: token_id};
      event e;
      msg_to_sender = { _tag : "RemoveApprovalSuccessCallBack"; _recipient : _sender; _amount : Uint128 0;
                        removed_spender : to; token_id : token_id };
      msgs = one_msg msg_to_sender;
      send msgs
    | False =>
      
      token_approvals[token_id] := to;
      e = {_eventname: "AddApprovalSuccess"; initiator: _sender; approved_addr: to; token: token_id};
      event e;
      msg_to_sender = { _tag : "AddApprovalSuccessCallBack"; _recipient : _sender; _amount : Uint128 0;
                        approved_spender : to; token_id : token_id };
      msgs = one_msg msg_to_sender;
      send msgs
    end
  end
end



transition SetApprovalForAll(to: ByStr20)
  IsNotSelf to _sender;
  is_operator <- exists operator_approvals[_sender][to];
  match is_operator with
  | False =>
    
    operator_approvals[_sender][to] := verdad;
    e = {_eventname: "AddApprovalForAllSuccess"; initiator: _sender; operator: to};
    event e
  | True =>
    
    delete operator_approvals[_sender][to];
    e = {_eventname: "RemoveApprovalForAllSuccess"; initiator: _sender; operator: to};
    event e
  end;
  new_status = negb is_operator;
  msg_to_sender = { _tag : "SetApprovalForAllSuccessCallBack"; _recipient : _sender; _amount : Uint128 0;
                    operator : to; status : new_status};
  msgs = one_msg msg_to_sender;
  send msgs
end




transition Transfer(to: ByStr20, token_id: Uint256)
  IsNotSelf to _sender;
  IsTokenOwner token_id _sender;
  IsTransferable _sender;
  
  token_owners[token_id] := to;
  
  delete token_approvals[token_id];
  
  UpdateTokenCount sub_operation _sender;
  
  UpdateTokenCount add_operation to;
  e = {_eventname: "TransferSuccess"; from: _sender; recipient: to; token: token_id};
  event e;
  msg_to_recipient = { _tag : "RecipientAcceptTransfer"; _recipient : to; _amount : Uint128 0;
                      from : _sender; recipient : to; token_id : token_id };
  msg_to_sender = { _tag : "TransferSuccessCallBack"; _recipient : _sender; _amount : Uint128 0;
                    from : _sender; recipient : to; token_id : token_id };
  msgs = two_msgs msg_to_recipient msg_to_sender;
  send msgs
end




transition TransferFrom(to: ByStr20, token_id: Uint256)
  IsTransferable _sender;
  some_token_owner <- token_owners[token_id];
  match some_token_owner with
  | None =>
    err = CodeNotFound;
    ThrowError err
  | Some token_owner =>
    IsNotSelf to token_owner;
    IsApprovedSpenderOrOperator token_id token_owner;
    
    token_owners[token_id] := to;
    
    delete token_approvals[token_id];
    
    UpdateTokenCount sub_operation token_owner;
    
    UpdateTokenCount add_operation to;
    e = {_eventname: "TransferFromSuccess"; from: token_owner; recipient: to; token: token_id};
    event e;
    msg_to_recipient = { _tag : "RecipientAcceptTransferFrom"; _recipient : to; _amount : Uint128 0;
                        from : token_owner; recipient : to; token_id : token_id };
    msg_to_sender = { _tag : "TransferFromSuccessCallBack"; _recipient : _sender; _amount : Uint128 0;
                      from : token_owner; recipient : to; token_id : token_id };
    msgs = two_msgs msg_to_recipient msg_to_sender;
    send msgs
  end
end





transition TransferOwnership(new_owner: ByStr20)
  IsContractOwner;
  o = Some {ByStr20} new_owner;
  pending_owner := o;
  e = {_eventname : "OwnershipTransferInitiated"; current_owner : _sender; pending_owner : new_owner};
  event e
end


transition AcceptOwnership()
  IsPendingOwner _sender;
  previous_current_owner <- current_owner;
  o = Some {ByStr20} _sender;
  current_owner := o;
  pending_owner := none;
  e = {_eventname : "OwnershipTransferAccepted"; previous_current_owner : previous_current_owner; current_owner : _sender};
  event e
end


transition RevokeOwnership()
  IsContractOwner;
  NoPendingOwner;
  current_owner := none;
  e = {_eventname : "OwnershipRevoked"; current_owner : _sender};
  event e
end




transition UnlockTokens()
  IsContractOwner;
  token_locked <- is_token_locked;
  match token_locked with
  | False =>
    err = CodeTokenAlreadyUnlocked;
    ThrowError err
  | True =>
    is_token_locked := false;
    e = {_eventname: "TokensUnlocked"};
    event e;
    msg_to_sender = { _tag : "UnlockTokensSuccessCallBack"; _recipient : _sender; _amount : Uint128 0};
    msgs = one_msg msg_to_sender;
    send msgs
  end
end



transition UpdateBaseURI(new_base_uri: String)
  IsContractOwner;
  base_uri := new_base_uri;
  e = {_eventname: "BaseURIUpdated"; base_uri: new_base_uri};
  event e
end



transition UpdateTokenURIs(token_ids: List (Uint256))
  IsContractOwner;
  forall token_ids UpdateTokenURI;
  e = {_eventname: "TokenURIsUpdated"; token_ids: token_ids};
  event e
end



transition SetGiveawayMinter(address: ByStr20)
  IsContractOwner;
  gm = Some {ByStr20} address;
  giveaway_minter := gm
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
        const [tx, con] = await contract.deploy({
            version: getVersion(),
            gasPrice,
            gasLimit,
        });
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

        const tx = await contract.call(t.contractTransitionName, t.data, {
            version: getVersion(),
            amount: new BN(t.amount),
            gasPrice,
            gasLimit,
        });
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

export const Zilmorphs = (resolvers: SDKResolvers) => {
    const defaultTxLog = (t: Transaction, msg: string) => {
      console.log(t)
      //@ts-ignore
      const id = t.ID;
      const url = `https://viewblock.io/zilliqa/tx/0x${id}?network=${getNetworkName()}`;
      console.log(MAGENTA, msg);
      // const receipt = t.getReceipt();
      // if (receipt) {
      //   if (receipt.success) {
      //     console.log(GREEN, "Success.");
      //     console.log(GREEN, JSON.stringify(receipt.event_logs, null, 2))
      //   } else {
      //     console.log(RED, "Failed.");
      //     // console.log(RED, JSON.stringify(receipt, null, 2))
      //     if (receipt.errors) {
      //       Object.entries(receipt.exceptions).map(([k, v]) => {
      //         console.log(RED, v);
      //       });
      //     }
      //   }
      // }
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
            __max_supply: T.Uint256,
            __reserved_supply: T.Uint256,
            __provenance_hash: T.ByStr
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
                        type: `Uint256`,
                        vname: `max_supply`,
                        value: __max_supply.toSend(),
                    },
                    {
                        type: `Uint256`,
                        vname: `reserved_supply`,
                        value: __reserved_supply.toSend(),
                    },
                    {
                        type: `ByStr32`,
                        vname: `provenance_hash`,
                        value: __provenance_hash.toSend(),
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
                    dangerousFromJSONDeploy(txLink)(resolvers)(
                        transactionData,
                        gasLimit
                    ),
            };
        },

        state: <
            E extends "true" | "false",
            Query extends ContractSubStateQueryCast<
                | "current_owner"
                | "pending_owner"
                | "minters"
                | "giveaway_minter"
                | "token_owners"
                | "is_token_locked"
                | "owned_token_count"
                | "token_approvals"
                | "operator_approvals"
                | "token_uris"
                | "total_supply"
                | "total_reserved"
                | "total_public"
                | "public_supply"
                | "base_uri"
            >
        >(
            query: Query,
            includeInit: E
        ) => ({
            get: (...contractAddresses: T.ByStr20[]) =>
                //@ts-ignore
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
                        max_supply: any;
                        reserved_supply: any;
                        provenance_hash: any;
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
         * 0x61a78357331fc23ed15e2b617b817b811d80ff32b41ba06fe59f4fdd59ca25c7
         */
        calls: (a: T.ByStr20) => (gasLimit: Long) => {
            const signer = signTransition(a);
            return {
                /**
                 * returns a signer that given an account will sign transition params in such manner:
                 * ...params, nonce, transition name, contract address
                 * */
                sign_BalanceOf: signer("BalanceOf"),
                BalanceOf: (__address: T.ByStr20) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `BalanceOf`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `address`,
                                value: __address.toSend(),
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
                sign_TotalSupply: signer("TotalSupply"),
                TotalSupply: () => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `TotalSupply`,
                        data: [],
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
                sign_Name: signer("Name"),
                Name: () => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `Name`,
                        data: [],
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
                sign_Symbol: signer("Symbol"),
                Symbol: () => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `Symbol`,
                        data: [],
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
                sign_GetApproved: signer("GetApproved"),
                GetApproved: (__token_id: T.Uint256) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `GetApproved`,
                        data: [
                            {
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
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
                sign_GetTokenURI: signer("GetTokenURI"),
                GetTokenURI: (__token_id: T.Uint256) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `GetTokenURI`,
                        data: [
                            {
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
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
                sign_CheckTokenOwner: signer("CheckTokenOwner"),
                CheckTokenOwner: (
                    __token_id: T.Uint256,
                    __address: T.ByStr20
                ) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `CheckTokenOwner`,
                        data: [
                            {
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
                            },
                            {
                                type: `ByStr20`,
                                vname: `address`,
                                value: __address.toSend(),
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
                sign_CheckApprovedForAll: signer("CheckApprovedForAll"),
                CheckApprovedForAll: (
                    __token_owner: T.ByStr20,
                    __operator: T.ByStr20
                ) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `CheckApprovedForAll`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `token_owner`,
                                value: __token_owner.toSend(),
                            },
                            {
                                type: `ByStr20`,
                                vname: `operator`,
                                value: __operator.toSend(),
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
                sign_ConfigureMinter: signer("ConfigureMinter"),
                ConfigureMinter: (__minter: T.ByStr20) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `ConfigureMinter`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `minter`,
                                value: __minter.toSend(),
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
                sign_Mint: signer("Mint"),
                Mint: (__to: T.ByStr20, __token_uri: T.ScillaString) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `Mint`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `to`,
                                value: __to.toSend(),
                            },
                            {
                                type: `String`,
                                vname: `token_uri`,
                                value: __token_uri.toSend(),
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
                sign_Burn: signer("Burn"),
                Burn: (__token_id: T.Uint256) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `Burn`,
                        data: [
                            {
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
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
                sign_SetApprove: signer("SetApprove"),
                SetApprove: (__to: T.ByStr20, __token_id: T.Uint256) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `SetApprove`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `to`,
                                value: __to.toSend(),
                            },
                            {
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
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
                sign_SetApprovalForAll: signer("SetApprovalForAll"),
                SetApprovalForAll: (__to: T.ByStr20) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `SetApprovalForAll`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `to`,
                                value: __to.toSend(),
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
                Transfer: (__to: T.ByStr20, __token_id: T.Uint256) => {
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
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
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
                TransferFrom: (__to: T.ByStr20, __token_id: T.Uint256) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `TransferFrom`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `to`,
                                value: __to.toSend(),
                            },
                            {
                                type: `Uint256`,
                                vname: `token_id`,
                                value: __token_id.toSend(),
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
                sign_TransferOwnership: signer("TransferOwnership"),
                TransferOwnership: (__new_owner: T.ByStr20) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `TransferOwnership`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `new_owner`,
                                value: __new_owner.toSend(),
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
                sign_AcceptOwnership: signer("AcceptOwnership"),
                AcceptOwnership: () => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `AcceptOwnership`,
                        data: [],
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
                sign_RevokeOwnership: signer("RevokeOwnership"),
                RevokeOwnership: () => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `RevokeOwnership`,
                        data: [],
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
                sign_UnlockTokens: signer("UnlockTokens"),
                UnlockTokens: () => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `UnlockTokens`,
                        data: [],
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
                sign_UpdateBaseURI: signer("UpdateBaseURI"),
                UpdateBaseURI: (__new_base_uri: T.ScillaString) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `UpdateBaseURI`,
                        data: [
                            {
                                type: `String`,
                                vname: `new_base_uri`,
                                value: __new_base_uri.toSend(),
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
                sign_UpdateTokenURIs: signer("UpdateTokenURIs"),
                UpdateTokenURIs: (__token_ids: T.List<T.Uint256>) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `UpdateTokenURIs`,
                        data: [
                            {
                                type: `List (Uint256)`,
                                vname: `token_ids`,
                                value: __token_ids.toSend(),
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
                sign_SetGiveawayMinter: signer("SetGiveawayMinter"),
                SetGiveawayMinter: (__address: T.ByStr20) => {
                    const transactionData = {
                        isDeploy: false,
                        ...sig,
                        contractAddress: a.toSend(),
                        contractTransitionName: `SetGiveawayMinter`,
                        data: [
                            {
                                type: `ByStr20`,
                                vname: `address`,
                                value: __address.toSend(),
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
