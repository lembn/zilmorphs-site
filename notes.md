# Zilmorphs

**Zilmorphs** are a race of digital agents, embeded into the Zilliqa blockchain to fight digital battles within the web-space. They have potential to be very powerful, but cannot fall into the wrong hands, so were spread into 8000 *seeds* and stored as NFTs in the blockchain. Just like any species of creatures, there are different bloodlines of Zilmorphs, all with different genetic traits making them strong in different ways. You are the operator, your objective: accumilate zilmorphs to raise an army in the web-space, and challenge other players for *contracts* to win rewards and become the most powerful operator.

## universe

The Zilmorph universe is contained within a time-loop, that repeats itself when the current *"genesis"* ends. Currently we are in the first genesis, but the maintainers of the time-loop can trigger a reset, which will end the current genesis and start a new one. When this happens, the universe will completely reset. Players will keep their old Zilmorphs, but they can't be used in the new genesis, and will serve as a trophy of previous achievements.

## operator profiles
Operators have profile cards, representing their stats as players. There is also a global leaderboard, displaying the cards of the most powerful operators in the universe. The power ratings of an operator is the combined power of each morph owned by the operator. This sum may be influenced by buff or perks being applied to the Zilmorphs. Operators have an experience level, which is increased by collecting experience (XP) points. An operator can increase their level up to level 20. After this, their level is reset to 0, but they gain 1 *master* level. For each master level upgrade, the operator card is upgraded to refelct the operator's higher status.

## contracts
Contracts are activities which operators partake in to win rewards. They have 4 ascending difficulties, with harder contracts reaping greater rewards. There are two contracts available for operators to take. The first is **shield contracts**. When a player receives a shield contract, they are tasked with defending an online arena against oncoming attackers for a given time period. For every shield contract, there is an associated *black hat* contract which, if taken, requires the player to attack the given server to receive the rewards. Operators who accept these contracts are the "attackers" that regular contract holders have to defend against. Because of this, shield contracts are inherintly easier than black hat contracts, since black hat contracts are only posted after a shield contract has been accepted, so it's possible that an operator takes a contract, but no other operators take the associated black hat contract, so the defending operator won't have to do any actual work.

The contract difficulties are:
- edge
- cloud
- cluster
- monolith

Edge arenas are the easiest to attack but the hardest to defend, and vice versa for monolith arenas. The reason for this is because for edge arenas, the attacker can invite other attackers to join, but the defender can invite no-one; for cloud arenas, the attacker can invite less and the defender can invite more and so on.

#### rewards

The rewards of the contract are listed on the contract, so the first attacker and defender can see what they might win. When inviting operators, they choose which/how much of the listed rewards to offer to joining operators, to incentivise them to help. Rewards are scaled by difficulty. For example, a successful black hat contract on an edge arena will reward less experience points than a sucessful shield contract on an edge arena, and vice versa for monolith arenas. Sheild contracts share rewards with their associated black hat contracts, so whichever side completes their objective takes all of the listed rewards.

If no operators take the black hat contract for a shield contract, then the defending operator will receive the listed contract rewards, but with lower scaled rewards. Scaled rewards include experience points and in-game currency. These rewards are not listed on the contract since the amount an operator receives will depend on their performance in the contract. This means that cold shield contracts won't reward too highly, and operators can still be rewarded if they performed well but lost failed their objective.

Contract rewards are usually some specified amount of experience points and `bits`, which is supplemented by some scaled amount on completion. For some special contracts, operators may receive seeds, seed pairs or even grown morphs.

#### arenas

Arenas exist on web-space servers. After successfully completing a contract, operators should have the ability to browse the filesystems of the hosting servers they just fought at. Stories of the most powerful operators from previous geneses, their rosters they made and how they made them, become scattered across the universe when the genesis resets. They end up spread across multiple files, on different serves that the players can find in filesystems. Related stories often end up in specific servers from the same zone, so targeting contracts from hosted on specific zones can help a player to find these secrets, and learn obscure or difficult binding techniques.

Operators can read these files from the filesystem and take the files to prevent other operators from having them. This is a manual process so be careful not to leave anything valueable behind. When a page is taken, an alert is sent out to the global news feed: "The lost files of X have been recovered from a server in zone Y".

The holder of the page has the ability to lock and unlock the technique it describes. This means that even if people learn the technique they won't be able to use it. When the owner wants to use it the technique, they can unlock it, then lock it back when they're done. However, locking and unlocking is global and sends out an alert when it is done, so when you unlock, anyone who knows the technique can use it. Operators can sell entire pages, or temporary technique unlocks on the market.

## bits
The currency used in the Zilmorph universe is called `bits`. `bits` can be used to interact with the markets and buy items, and offered as rewards for complete in-game activities. If you want to fund your account, you can buy `bits` with ZIL, or pay with ZIL directly. `bits` are worth less than ZIL, so you can buy more with 1ZIL than you can with 1`bit`. 

## binding and boosting

It all starts with a seed. A seed can be considered a *Gen0* Zilmorph. While they can be used, just like any other morph, they are very weak and won't do very well against well trained morphs. The most important thing they carry is their genetic traits. With these and a good knowledge of the game's binding system - a player can raise an army of zilmorphs. Two Zilmorphs can *bind* to each other, to make a resultant morph: stronger than both of the orinials. This is only possible for morphs from different bloodlines. Over time, repeating this process will progress through the generations of the morph, and applying this to many different morphs will form a roster of power, available to the player.

A Bloodline of Zilmorphs share a set of dominant traits and a set of recessive traits. To train a zilmorph up to it's next generation, two generation matching zilmorphs from different bloodlines are bound together. For example binding a Gen1 and a Gen1 would make a Gen2 morph. The maximum generation is 20. The binding process is performed by a deep computation, that considers the compatibility of the morphs to attempt to create the strongest resultant morphs possible. However, this is an extremely diffucult task and can often produce undesired results - making sucesses even more precious. Zilmorph binding is an art, and any player able to master it will be able to train an unstoppable force, with the potential to become an uncontested champion of the web-space. During this process, the one morph is chosen as the *Dominant*, and another as the *Recessive*. This is done using the *genetic dominance* attribute of the morph. Every seed zilmorph has a randomly generated genetic dominance from 48-52%. A morph with genetic dominance above 50% is considered to be "genetically dominant" and a morph with genetic dominance 50% or below is considered to be "genetically recessive".The bind computation will attempt balance the properties of each morph, such that the most genetically dominant morph will be chosen as the dominant in of the bind.

In the bind, the Dominant inherits the recessive traits of the Recessive, then the Recessive becomes *"orphaned"*. The recessive traits will be added randomly to either the set of dominant traits for the new morph or the set of recessive traits with the default chance being 70% in favour of the set of the recessive traits.

Binding morphs from different generations will transfer all the enegry from the younger morph into the older morph, causing the younger morph to die, but giving a small stat boost to the higher generation morph and maybe a temporary effect buff to the older morph - depending on what bloodline the lower generation morph was from. There are some bloodlines who's morphs are better for this purpose than for actual training, as they rewards they give to the older morph is greater than the outcome of training the morph. This process is called *"boosting"*.

Not all bloodlines work well together, there may be some that will reduce the overall score if they share a roster with some different, so operators will have to make the choice. In many cases, the traits of those bloodlines polar opposites, for example double healing vs double damage and in most cases, these are the only bloodlines carrying these traits. Sometimes certain bloodlines will be completely uncompatible, such that they cannot even exist in the same roster.

## algorithms

Algorithms describe a set of steps on how to alter a morph's internal attributes to achieve certain effects on the morph. For example The player can use algorithms to strengthen or weaken the genetic dominance of a morph, or to increase the chance of a morph's recessive traits being added to the dominant of a new morph.

## orphanism

Orphaned morphs are morphs that belong to no bloodline, some of the seeds are born like this, but orphaned morphs are created by the process of binding, when the recessive morph is stripped of its traits. Orphaned morphs are not useful for training or boosting, since they have no bloodline traits so bear no rewards for either process. However, they are not completely useless, as a matter of fact, their lack of bloodline makes them a perfect fit for one specific use-case. Zilmorphs were designed with immortality in mind, since losing a powerful warrior could change the fate of the web-space war. To resurrect a dead warrior, pure Zilmorph energy must be combined with a resurrection algorithm, and given to the fallen morph. This pure energy can't be extracted from a morph with bloodline traits, since their energy is not pure, and has been effected by the variation of the bloodline. Orphaned morphs are perfect for this case, since they have no bloodline so emit pure energy. This energy can be captured and collected to complete a resurrection algorithm and bring back a dead morph. Extracting zilmorph energy is a passive process and does not effect the morph whose energy is being collected. The extraction rate of energy from a morph varies, depending on the generation of the morph

Zilmorphs >= Gen1 can be renamed. When a zilmorph is regenerated it gets a special badge to show its generation, or the card gets embezzled (a bit like rocket league profile picture outline or fifa cards). They also get a major stat boost and a new avatar. (We can use the fact that Gen0 morphs are seeds as an excuse for why they look so odd).

## mortality

Zilmorphs have no lifespan, from the moment they were first generated as seeds, if left to themselves, they would live on indefinitely in the blockchain. However, they are not completely immortal, certain activites can cause them to die. For example, boosting kills the younger Zilmorph in the process since the older Zilmorph extracts the energy of the younger so rapidly and agressivlely that the younger morph cannot handle it.

A player can invoke a *mortality algorithm* on a Zilmorph too. This gives a lifespan to the morph rather than allowing it to naturally live forever. The length of the potion depends on the strength of the algorithm, with stronger algorithms allowing the morph to live for longer, but often being more expensive and harder to come by. While it may seem a terrible idea to put a morph through this, it is beneficial since it boosts the stats of the morph by a very great amount making the morph much more powerful than ever achievable with even the bets training methods.

A mortality algorithm can also be used to revive dead Zilmorph as an alternative to collecting pure energy. When the algorithm is applied to a dead morph, the morph is brought back to life, but with the curse of the lifespan attached to it. It also doesn't get any of the power buffs that the algorithm usually offers. To get these effects the algorithm would need to be applied twice: once to revive the dead morph, then again to empower the morph. Alternately, the dead morph could be resurrected with pure energy. If the mortality algorithm is applied to a morph that already has a lifespan, the lifespan is reduced.

#### condition
Every Zilmorph also has a *contidion* rating. A fresh morph has a 0% rating, but this rating is gradually increased as the Zilmorph is used for contract battles, arcade games, etc. Condtional wear is completely permanent and cannot be undone. It has no functional purpose, but can be used to rate the freshness of a morph. Any rating within the first maybe 10% is considered *"mint condition"*. There are some processes that can be followed to permanently or temporarily decrease a morph's wear rate, and certain bloodlines are more wear resitant than others.

## arcade
The arcade is a non-Zilmorph way to interact with the universe. Only serious Zilmorph operators have the power to take on contracts, but anyone can play arcade games with no morphs. However, operators may find an advantage by using their Zimorphs to assist them in some of the games.

#### morphsino

Welcome to Morphsino the only casino that is configured to give on average the same amount of winnings as you put in! Every other casino is configured so that on average you lose! Morphsino is probably one of the most sophisticated blockchain slot machines out there. It leverages meta transactions, an oracle, and a cryptographically secure random number generator, in order to create a provably fair and well behaved slot machine that can be verified to be working as declared with the data that is accessible on the Zilliqa blockchain. The twist in Morphsino is that you pay Zilmorph tax on your winnings. Where the more **POWER** the Zilmorph you own has the less in fees you will be paying! That means that if your morph has 300 power the slot machine is configured to on average give you back as much as you have put in!

The base reward tax is 30%. For example: if you have a Zilmorph with power stat = 250, and you win 420 ZIL (the highest prize). You will pay 21 ZIL in Zilmorph TAX and the 399 ZIL is yours. The spin price is 10 ZIL. You can win either 20 ZIL 30 ZIL 70 ZIL 420 ZIL per spin. You can buy as many spins as you want with one blockchain TX. Spin, and then claim all of your so far unclaimed spins with one blockchain TX!

## events

Events are real-time competitions hosted in the universe, that put player's and their rosters against each other. Only the most powerful will prevail.

#### top trump games

#### attribute betting

## market

The market is a universe-wide area where players can trade items, algorithms and zilmorphs. Trading can take place as direct sales, buy/sell orders, auctions and raffles.

#### Zilmorphs

Zilmorphs can be bought at the market, either as new seeds or traded with other players. When buying seeds, players can pay extra to increase the chance of getting a morph from a specified bloodline, beware this is not a guarantee, just a nudge in the desired direction.

---

What is `FungibleToken` that Matt made
We'll need to make something that can trade NFTs
We'll need to make a fungible token crypto currency for the in-game currency
Are Zilmorphs contracts? Are there 8000 contracts?

Contracts:
- What are the actual mechanics of the contract battles?
- What part of the site do players actually *do* the contracts
	- What does it look like
- How are we gonna do the filesystem browsing thing
- Can the stories be about *actual* in-game players from the last genesis

Figure out trait system once we know how contract battles actually work. Then we'll know what the traits should be

---

# Roadmap

-   [x] Improve mobile support
-   [x] Create menu hamburger
-   [ ] Create new tabs
-   [ ] Improve slot machine contract
-   [ ] Add loading animation between pages
-   [ ] Write new lore
-   [ ] Add lore to roadmap

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

## MB Tasks

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
-   Make the 'play' tab display cards of all the arcade games instead of going straight to morphsino

-   Add loading animation between pages
