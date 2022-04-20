# Zilmorphs

**Zilmorphs** are an prehistoric race of digital agents, embeded into the Zilliqa blockchain to maintain peace and order on the within the web-space. They have potential to be very powerful, so much so that they could not be allowed to fall into the wrong hands, so each zilmorph was genetically regressed into a seed *seeds* and the race was scattered across the metapolis, awaiting activation by a worthy operator. Just like any species of creatures, there are different species of zilmorphs, all with different genetic traits making them strong in different ways. You, have the opportuninty to be *that* operator. Take the chance, find the morphs and develop them into the full beauty of their final forms.

## operator profiles
Operators have profile cards, representing their stats as players. There is also a global leaderboard, displaying the cards of the most powerful operators in the metapolis. The power ratings of an operator is the combined power of each morph owned by the operator. This sum may be influenced by buffs being applied to the operator's morphs. Operators have an experience level, which is increased by collecting experience (XP) points. An operator can increase their level up to level 20. After this, their level is reset to 0, but they gain 1 *master* level. For each master level upgrade, the operator card is upgraded to refelct the operator's higher status.

## bits
The currency used in the Zilmorph universe is called `bits`. `bits` can be used to interact with the markets and buy items, and offered as rewards for complete in-game activities. If you want to fund your account, you can buy `bits` with `ZIL`. 

## morph development
#### seeds
It all starts with a seed. A seed can be considered a *Gen0* Zilmorph. While they can be used, just like any other morph, they are very weak and so don't expect the greatest performance. The most important thing they carry is the genetic traits from the species they belong to. These traits affect the morph's power and abilities, and influence the morph's *genome*. Two seeds can *bind* to each other, making a resultant seed with more potent genetic traits then either of the originals.

A species of morphs share a set of dominant traits and a set of recessive traits. To upgrade a seed to its next generation, two generation matching seeds are bound together. The highest generation is 20. As seeds approach the generation cap, they become more powerful and therefore more valueable, so this is often a worthwhile experience. When a seed surpasses its first generation, it can be renamed. When a zilmorph on each generation, morphs are given a special badge to show their generation.

#### binding
The binding process is performed by a deep computation, where, one seed is chosen as the *Dominant*, and another as the *Recessive*. This is done using the *genetic dominance* attribute of the seed, which is a randomly generated value that represents the probability of the seed being chosen as the Dominant when binding. A morph with genetic dominance above 50% is considered to be "genetically dominant" and a morph with genetic dominance 50% or below is considered to be "genetically recessive". When binding, the bind computation will attempt balance the properties of each morph, such that the most genetically dominant morph will be chosen as the dominant in of the bind.

In the bind, the Dominant inherits the recessive traits of the Recessive, then the Recessive becomes *"orphaned"*. The recessive traits will be added randomly to either the set of dominant traits for the new morph or the set of recessive traits. If the Dominant already possesed one of the ressesive traits being taken from the Recessive, then that trait becomes stronger in the dominant.

Binding seeds from different generations will transfer all the enegry from the younger seed into the older seed, causing the younger morph to die, but giving a small stat boost to the higher generation morph and maybe a temporary effect buff to the older morph - depending on what bloodline the lower generation morph was from. There are some bloodlines who's morphs are better for this purpose than for actual training, as they rewards they give to the older morph is greater than the outcome of training the morph. This process is called *"boosting"*. Not all bloodlines work well together, there may be some that will have negative effects if bound together, or will cause downgrades if boosting is attempted.

#### morph cores
Once a morph reaches the generation cap, it is ready to assimilate it's *final form*. This is the last stage of a morph's development. To achive this, first the zilmorph's seed must be combined with a *morph core*. Just as seeds define the genetic traits of a zilmorph, Morph Cores define the *personal* traits, like specific stats and abilities. Cores can undergo the same binding process as seeds to make them more powerful, but have no generation cap so can be developed indefinitlely. However, they do not hold infinite power. Often, cores will converge to a maximum point of performance after many consecutive generations, at which state the core is at it's theoretical maximum, In some very rare cases this theoretical maximum will be extremely high, leaving a core with seemingly endless upgrade capability.

Different species have different relationships with cores, but all species define some core buff factor. This is some number $x$ which will apply buffs to a morph whenever the core's generation issome multiple of $x$ of the core buff factor. The buffs applied are directly proportional to the core buff factor, so lower core boost factors cause the buffs to be applied more often, while higher core buff factors cause the buffs to be stronger when they are applied, at the cost of them being applied less often.

Morph cores can also be upgraded through *boosting*. This is the process of applying pure Zilmorph energy to the core to *boost* its stats. This pure energy can't be extracted from a morph with genetic traits, since their energy is not pure, and has been effected by the variation of the species.

"Orphaned" seeds are seeds that belong to no species. Some seeds were generated like this, but others are created by the process of binding, when the recessive morph is stripped of its traits. Orphans are not useful for binding, since they have no genetic traits so bear no potential rewards for either process. Orphaned morphs are perfect for morph core boosting, since they have no species so emit pure energy. Extracting zilmorph energy is a passive process and does not effect the morph whose energy is being collected. The extraction rate of energy from a morph varies, depending on the generation of the morph.

Cores can be combined with seeds at any stage, and are interchangable between different seeds. A core only becomes locked to a seed when it reaches the generational cap, but there are algorithms that can release a core from a max generation seed by decreasing the generation of the seed.

This means that a Zilmorph is composed of two parts: The seed defines the species information of the morph, while the core defines all other morph information. Morph cores are optional but every zilmorph has at least a seed. The combination of the seed and core define the genome of the morph, which is used when the morph assimilates into its final form.

#### assimilation
At this stage, if a zilmorph is ready to assimilate, it has a seed and a core, so has some fully formed genome. When morphs assimiliate, they generate a 3 dimensional form of themselves based from the properties of their genome. The different "parts" that compose the assimilation are all predefined, so the assimilation generator is a parametric algorithm which takes components of the genome to decide which parts to use in the assimilation and how to use them. All assimiliations are unique, so know two morphs will be exactly the same in their final form.

The assimilation consists of:
- Some central object, this could be anything from a bike to a coin to some humaniod creature.
- Potentially a habitat, this could be a backdrop or in rare cases, in entire 3D scene. The backdrops are procedually generated at the time of assimilaition, so could be a simple colour or if even some generative artwork!
- In some cases, the central object of the assimilation will have accessories like wings or special parts or even actual physical accessories like headphones.
- On other rare occasions, the morph may be animated, to rotate its central object as it floats in or even animate the meshes within the models of the assimilation.
- Finally, morphs are assigned a "scale". This is a number from 0 (exclusive) to 5 (inclusive) which represents the "size" of the assimilated morph. An assimilation of scale is treated as having a "regular" and is most common among assimilations.

Alltogether, these form the assimilation, which is how your morph has chosen to represent itself to you. Zilmorphs do not completely understand the human world, so these assimilations may look wild and whacky, but know that the assimilation is unique to *your* morph. When assimilations are complete, they are assigned a *rarity* which is a probability representing the chance of this specific set of assimilation parts being chosen.

Before the assimilation is generated, operators can perform "final form developments", which effect the morph's genome directly, in attempt to influence the outcome of the assimilation. If you don't care about the outcome, all these developments can be skipped and the assimilation can start straight away.

## algorithms
Algorithms act like potions on the morphs that can be applied to seeds or cores. For example The player can use algorithms to strengthen or weaken the genetic dominance of a morph, or to increase the chance of a morph's recessive traits being added to the dominant of a new morph.

## condition
Every Zilmorph also has a *contidion* rating. A fresh morph has a 0% rating, but this rating is gradually increased as the Zilmorph is used for arcade games abd general use. Condtional wear is completely permanent and cannot be undone. It has no functional purpose, but can be used to rate the freshness of a morph. Any rating within the first maybe 10% is considered *"mint condition"*. There are some processes that can be followed to permanently or temporarily decrease a morph's wear rate, and certain species are more wear resitant than others.

## arcade
The arcade is a way for operators to earn rewards which can be put towards morph development. It has a collection of games which operators can play (sometimes using morphs) and compete in.

#### morphsino
Welcome to Morphsino the only casino that is configured to give on average the same amount of winnings as you put in! Every other casino is configured so that on average you lose! Morphsino is probably one of the most sophisticated blockchain slot machines out there. It leverages meta transactions, an oracle, and a cryptographically secure random number generator, in order to create a provably fair and well behaved slot machine that can be verified to be working as declared with the data that is accessible on the Zilliqa blockchain. The twist in Morphsino is that you pay Zilmorph tax on your winnings. Where the more **POWER** the Zilmorph you own has the less in fees you will be paying! That means that if your morph has 300 power the slot machine is configured to on average give you back as much as you have put in!

The base reward tax is 30%. For example: if you have a Zilmorph with power stat = 250, and you win 420 ZIL (the highest prize). You will pay 21 ZIL in Zilmorph TAX and the 399 ZIL is yours. The spin price is 10 ZIL. You can win either 20 ZIL 30 ZIL 70 ZIL 420 ZIL per spin. You can buy as many spins as you want with one blockchain TX. Spin, and then claim all of your so far unclaimed spins with one blockchain TX!

## events
Events are real-time, limited-time competitions hosted in the universe, that put player's and their rosters against each other. Only the most powerful will prevail.

#### top trump games

#### attribute betting

## market
The market is a universe-wide area where players can trade items, algorithms and zilmorphs. Trading can take place as direct sales, buy/sell orders, auctions and raffles.

---

# TODO
-   Redo notes
-   Investigate spinner gas (*"improving the slot machine contract so claiming prizes takes constant gas cost"*)

## Questions
-   How were the morphs generated
-   Why is press not in dapp/
-   How is it a dapp
-   What is ARKCompatibleMetadata
-   What is the purpose of /api/getpng/\[id\].ts if all it does is redirect
    -   Its also never accessed

## Tasks
-   Create 'arcade' tab: a menu showing all of the available games to play
-   Create 'events' tab: where we host attribute face off, auctions and raffles
	- Has a 'news feed' for annoucements and notifications
	- Has an 'ongoing events' sections for ongoing events   
-   Create 'market' tab: where players can buy items, algorithms and zilmorphs. Players can also sell items here too.
	-   Long grid view of everything on sale
	-   It can be filtered and sorted by type
	-   Contracts are posted here
-   Create 'gallery' tab
	-   Allow the player to view all their items/zilmorphs/contracts etc. It's just a long grid view of everything they own (looks similar to market).
	-   They can filter and sort
	-   They can organise into folders
	-   Has a section to showcase all existing zilmorphs and their current state (alive, orphaned, generation, etc)
-   Create 'operator' tab: showcases profile card
	- Add an hours played counter
	- It also has the leaderboard   
		- ranks players but both power ratings
- Create 'catalog' tab: showcases different assimilation parts
-   Make the 'play' tab display cards of all the arcade games instead of going straight to morphsino
-   Add loading animation between pages

---

# Implementation
## assimilation
Species - https://www.rangen.co.uk/world/speciesgen.php
morphs have effects (animations)
- https://youtu.be/uIthYMgWM0Q
- https://youtu.be/fHcuDamtc98
- https://youtu.be/dblHLxyE7BU
- https://youtu.be/no1zkwhwAHs
- https://youtu.be/Fg5TwO4Z_40
- https://youtu.be/8pD9iNFBenI
- https://youtu.be/b_uyskgwsiw
- https://youtu.be/P3TBxjPGfzs
- https://youtu.be/xKiv6dKupoE
- https://youtu.be/35bbyAJodEQ
- https://youtu.be/QnpOBe8X--M

textures
models
- base models
- accessory models
materials
all can be submitted by user

final form generation:
- https://youtu.be/MM462PzhC1I
- https://youtu.be/u6utxGcKMZ0

If we ever release a new series of morphs, we should give all the existing ones a "genesis" stamp to show that they are original morphs. This is becuase releasing a bunch of new morphs will decrease the value of the existing morphs, so users can flaunt the genesis stamps to show that they are special (which should help to make up for the lost value).

Zilmorphs were one of the first NFTs on Zilliqa, this should be reflected in the lore

#### technique 1 - exhaustive pregeneration
Pregenerate every single assimilation, as users submit models, textures, etc they get added on to the exisitng catalog. This is so that the catalog represents every single possible assimilation. This means that users can browse the catalog to see what they could potentially get. This would mean that when a morph requests assimilation, the genome would just be a number which would map to the index of some assimilation in the catalog. Final form developments would attempt to change this number so that it matches one with desired traits. For example, if all animated traits are even, final form developments may attempt to make the genome number stay even

#### technique 2 - dynamic generation
The assimilation generator is parametric, so in this case different parts of the genome would map to different paramaters of the algorithm. Final form developments would tune these specific parts of the genome to change the parameters that are passed to the generator. We will store each genome as it is submitted. If a submitted genome is identical to an exisitng genome, the submitted genome gets one of it's paramaters adjusted to make it unique (it should then be checked again to make sure it hasnt been made identical to anything else). Final form developments can also define the behaviour of the genome under adjustment (which paramaters are allowed to change, magnitude and direction). When generation completes, we can assign a rarity number to the assimilation which is simply the probability of the parts that were chosen being chosen.

---
# Old Notes

smart contracts:
- Matt told us to "improve the slot machine contract" but contract code is immutable so what did he mean?
	- Can we edit smart contracts?
	- Or did he mean re-deploy
	- We can use whatever technique it is to upgrade the `Zilmorphs` contract to ZRC-6
- The existing `FungibleToken` contract doesn't seem to be a part of Zilmorphs, it looks like it was just downloaded to generate an `abi` cos the contract is used for the zBridge stuff
	- Do we want to retain the "you can only pay with zBridge assets" concept or are we just going to only accept ZIL.
	- Maybe you can buy anything with ZIL or `bits` but ZBridge assets can only be used to buy `bits`
- The Zilmorph contract is ZRC-1, does it need to be updated to ZRC-6?
- Everything looks like its hosted on firebase, which is centralised, so its not a dapp?
	- Should we use IPFS?
- The `bits` and in-game items are represented as tokens given to players' wallets. We need to make sure that players can't trade these tokens off-game or they may be able to exploit arbitrage techniques to glitch more money for themselves
	- Likewise for in-game items
	- Do we want this to be a feature?
- We'll need the following smart contracts:
	- `Zilmorphs` (ZRC-6 NFT)
	- `bits` (ZRC-2 Fungible Token)
	- Game Contracts
		- `SlotMachine` and other games
	- `market` (Token Exchange/Item)
		- In-game items will be NFTs, we can have one contract to assign all the in-game items. The contract will implement code to mint URLs to player addresses, then we'll use some logic at the URL to identify what type of item the player has.
		- We can manipulate the NFT metadata to change the state of Zilmorphs and identify different items.
		- When players use items and `bits`, they will be sent back to the `market` contract so the contract can give them to other players instead of always having to re-mint.
		- Anything can be traded for ZIL on the market

## contracts
Contracts are activities which operators partake in to win rewards. They have 4 ascending difficulties, with harder contracts reaping greater rewards. There are two contracts available for operators to take. The first are **shield contracts**. When a player receives a shield contract, they are tasked with defending an online arena against oncoming attackers for a given time period. For every shield contract, there is an associated *black hat* contract which, if taken, requires the player to attack the given server to receive the rewards. Operators who accept these contracts are the "attackers" that regular contract holders have to defend against. Because of this, shield contracts are inherintly easier than black hat contracts, since black hat contracts are only posted after a shield contract has been accepted, so it's possible that an operator takes a contract, but no other operators take the associated black hat contract, so the defending operator won't have to do any actual work.

The contract difficulties are:
- edge
- cloud
- cluster
- monolith

Edge arenas are the easiest to attack but the hardest to defend, and vice versa for monolith arenas. The reason for this is because for edge arenas, the attacker can invite other attackers to join, but the defender can invite no-one; for cloud arenas, the attacker can invite less and the defender can invite more and so on.

When contracts are posted, the define a maximum number of zilmorphs that can be used. In general, as this number gets higher, the rewards imrpove. This is so that players with less morphs can take contracts that define low morph limits to prevent getting cheesed by players with more morphs.

Black hat contracts are posted first. When the attackers are "ready", the sheild contract is posted. Sheild contracts have attackers' details in them. Max number of teammates is 2. In the preperation phase, each operator on the team decides which morphs they want to send into the arena. Out of the total morphs sent, a formation is created on a grid. The attacker's preperation phase happens before the sheild contract is even posted, when a team finalises their formation, they are "ready".

Next the morphs march from their side of the arena to the other side, from this point on morphs can attack each other, so ranged attacks will have effect. The defending team has the option to stop marching and hold at any points (even the start if they don't want to move at all).

The travel phase ends when there are no more spaces between the front lines of both both teams. Morphs battle against the morph directly ahead of them unless their traits specify otherwise. When a morph is defeated, it's grid position becomes empty and the other team can push up into that space. When an empty grid position gets occupied, it gets taken by the team of the morph who occupied it. The winning team is whoever has total grid coverage, or the most coverage by the time limit. This means that if the defending team just decides to hold, they'll lost alot of coverage at the start.

- How manual is the process
	- Formation: completely manual
		- Save formations?
			- Save by morph
			- Save by bloodline
	- March: automatic (its governed by the "agression")
	- Battle: semi-automatic
		- Choose when to push into space ("aggression")
		- Pictures of different scenarios, pick which ones to push or hold or random
- How does a morph get "defeated"
- Do we add champions?
- Simplify the pages (server stories?), they give:
	- Operator perks
	- Algorithms
	- Morph buffs

#### rewards

The rewards of the contract are listed on the contract, so the first attacker and defender can see what they might win. When inviting operators, they choose which/how much of the listed rewards to offer to joining operators, to incentivise them to help. Rewards are scaled by difficulty. For example, a successful black hat contract on an edge arena will reward less experience points than a sucessful shield contract on an edge arena, and vice versa for monolith arenas. Sheild contracts share rewards with their associated black hat contracts, so whichever side completes their objective takes all of the listed rewards.

If no operators take the black hat contract for a shield contract, then the defending operator will receive the listed contract rewards, but with lower scaled rewards. Scaled rewards include experience points and in-game currency. These rewards are not listed on the contract since the amount an operator receives will depend on their performance in the contract. This means that cold shield contracts won't reward too highly, and operators can still be rewarded if they performed well but lost failed their objective.

Contract rewards are usually some specified amount of experience points and `bits`, which is supplemented by some scaled amount on completion. For some special contracts, operators may receive seeds, seed pairs or even grown morphs.

#### arenas
Arenas exist on web-space servers. After successfully completing a contract, operators should have the ability to browse the filesystems of the hosting servers they just fought at. Stories of the most powerful operators from previous geneses, their rosters they made and how they made them, become scattered across the universe when the genesis resets. They end up spread across multiple files, on different serves that the players can find in filesystems. Related stories often end up in specific servers from the same zone, so targeting contracts from hosted on specific zones can help a player to find these secrets, and learn obscure or difficult binding techniques.

Operators can read these files from the filesystem and take the files to prevent other operators from having them. This is a manual process so be careful not to leave anything valueable behind. When a page is taken, an alert is sent out to the global news feed: "The lost files of X have been recovered from a server in zone Y".

The holder of the page has the ability to lock and unlock the technique it describes. This means that even if people learn the technique they won't be able to use it. When the owner wants to use it the technique, they can unlock it, then lock it back when they're done. However, locking and unlocking is global and sends out an alert when it is done, so when you unlock, anyone who knows the technique can use it. Operators can sell entire pages, or temporary technique unlocks on the market.