# I. FungibleToken documentation

#### UpdateOwner()

 Transitions transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `newOwner` | `ByStr20`          |

#### ClaimOwner()

transition

**No Arguments**



#### IncreaseAllowance()

 @dev: Increase the allowance of an approved_spender over the caller tokens. Only token_owner allowed to invoke. param spender: Address of the designated approved_spender. param amount: Number of tokens to be increased as allowance for the approved_spender. transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `spender` | `ByStr20`          |
| @param | `amount` | `Uint128`          |

#### DecreaseAllowance()

 @dev: Decrease the allowance of an approved_spender over the caller tokens. Only token_owner allowed to invoke. param spender: Address of the designated approved_spender. param amount: Number of tokens to be decreased as allowance for the approved_spender. transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `spender` | `ByStr20`          |
| @param | `amount` | `Uint128`          |

#### Transfer()

 @dev: Moves an amount tokens from _sender to the recipient. Used by token_owner. @dev: Balance of recipient will increase. Balance of _sender will decrease. @param to: Address of the recipient whose balance is increased. @param amount: Amount of tokens to be sent. transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `to` | `ByStr20`          |
| @param | `amount` | `Uint128`          |

#### TransferFrom()

 @dev: Move a given amount of tokens from one address to another using the allowance mechanism. The caller must be an approved_spender. @dev: Balance of recipient will increase. Balance of token_owner will decrease. @param from: Address of the token_owner whose balance is decreased. @param to: Address of the recipient whose balance is increased. @param amount: Amount of tokens to be transferred. transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `from` | `ByStr20`          |
| @param | `to` | `ByStr20`          |
| @param | `amount` | `Uint128`          |

#### Burn()

 @dev: Burn existing tokens. Only contract self can burn. @param burn_account: Address of the token_owner whose balance is to decrease. @param amount: Number of tokens to be burned. transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `burn_account` | `ByStr20`          |
| @param | `amount` | `Uint128`          |

#### ChangeLockProxy()

transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `addr` | `ByStr20`          |