# I. Zilmorphs documentation

#### BalanceOf()

 ZRC-1 Getters @dev: Get number of NFTs assigned to a token_owner transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `address` | `ByStr20`          |

#### TotalSupply()

 @dev: Get total supply of NFTs minted transition

**No Arguments**



#### Name()

 @dev: Get name of the NFTs transition

**No Arguments**



#### Symbol()

 @dev: Get name of the NFTs transition

**No Arguments**



#### GetApproved()

 @dev: Get approved_addr for token_id transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `token_id` | `Uint256`          |

#### GetTokenURI()

 @dev: Get the token_uri of a certain token_id transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `token_id` | `Uint256`          |

#### CheckTokenOwner()

 @dev: Check if a token_id is owned by a token_owner transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `token_id` | `Uint256`          |
| @param | `address` | `ByStr20`          |

#### CheckApprovedForAll()

 @dev: Check if address is operator for token_owner transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `token_owner` | `ByStr20`          |
| @param | `operator` | `ByStr20`          |

#### ConfigureMinter()

 ZRC-1 transitions @dev: Add or remove approved minters. Only contract_owner can approve minters. @param: minter - Address of the minter to be approved or removed transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `minter` | `ByStr20`          |

#### Mint()

 @dev: Mints a token to an address @param: to - Address of owner of token minted @param: token_uri - Unused, but left including to conform with ZRC-1 interface transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `to` | `ByStr20`          |
| @param | `token_uri` | `String`          |

#### Burn()

 @dev: Burn existing tokens. Only token_owner or an operator can burn a NFT. @param: token_id - Unique ID of the NFT to be destroyed transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `token_id` | `Uint256`          |

#### SetApprove()

 @dev: Approves OR remove an address ability to transfer a given token_id There can only be one approved_spender per token at any given time param: to - Address to be approved for the given token_id param: token_id - Unique ID of the NFT to be approved transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `to` | `ByStr20`          |
| @param | `token_id` | `Uint256`          |

#### SetApprovalForAll()

 @dev: Sets or unsets an operator for the _sender @param: to - Address to be set or unset as an operator transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `to` | `ByStr20`          |

#### Transfer()

 @dev: Transfer the ownership of a given token_id to another address. token_owner only transition. @param: to - Recipient address for the token @param: token_id - Unique ID of the NFT to be transferred transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `to` | `ByStr20`          |
| @param | `token_id` | `Uint256`          |

#### TransferFrom()

 @dev: Transfer the ownership of a given token_id to another address. approved_spender or operator only transition. @param: to - Recipient address for the NFT @param: token_id - Unique ID of the NFT to be transferred transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `to` | `ByStr20`          |
| @param | `token_id` | `Uint256`          |

#### TransferOwnership()

 Ownership lifecycle transitions @dev: Transfers contract ownership to a new address. The new address must call the AcceptOwnership transition to finalize the transfer. @param new_owner: Address of the new current_owner. transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `new_owner` | `ByStr20`          |

#### AcceptOwnership()

 @dev: Finalizes transfer of contract ownership. Must be called by the new current_owner. transition

**No Arguments**



#### RevokeOwnership()

 @dev: Removes the current_owner, meaning that new minters can no longer be added. Must not have a pending owner. transition

**No Arguments**



#### UnlockTokens()

 Minting process tarnsitions @dev: Unlocks tokens boolean flag or throws an error if already unlocked transition

**No Arguments**



#### UpdateBaseURI()

 @dev: Updates the base_uri for reveal. Hash of new_uri must match provenance @param: new_uri - Updated base_uri transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `new_base_uri` | `String`          |

#### UpdateTokenURIs()

 @dev: Updates single or multiple token URIs in the URI map @param: token_ids - List of token IDs to be updated transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `token_ids` | `List (Uint256)`          |

#### SetGiveawayMinter()

to current giveaway minter's address @param: address - Address of giveaway minter transition

  **Arguments:**

|        | Name      | Type               |
| ------ | --------- | ------------------ |
| @param | `address` | `ByStr20`          |