/* Farmhand's Route - the Year 1 route and the money engines. Sources: Stardew Valley Wiki (1.6), checked
   2026-09-18; community Year-1 guides for the ordering. Steps: t = text, c = cost, w = why, tags, p = player
   (1 farmer, 2 fisher-miner, 0 both), set = 'std' when the step only applies to standard bundles, risk = a
   short red tag for one-shot windows. Every id must be unique across data.js. */
'use strict';

var SEASONS = [
{id:'spring',name:'Spring',kicker:'SEASON 1 OF 4',
 goal:'Field running, a rod in each hand, the mines to floor 40, the Community Center open and its first bundles in.',
 must:'Leek, Daffodil, Dandelion and Wild Horseradish in a chest; Strawberry Seeds on Spring 13; a Parsnip, Potato, Cauliflower and Green Bean kept back.',
 money:'Under 1,000g most of the month. 8,000g to 15,000g banked by Spring 28 from fish and cauliflower.',
 phases:[
  {n:'0',t:'Before day 1',when:'new farm',steps:[
   {id:'sp0a',t:'Pick the Standard farm.',w:'It has the most tillable ground. Meadowlands (new in 1.6) starts with a coop and two chickens on a smaller field; it also works with this route, the coop steps just come free.',tags:['prep'],p:0},
   {id:'sp0b',t:'Host: start with 1 cabin so Player 2 joins on day 1.',w:'A cabin can be added later at Robin’s, but a starting cabin is free and ready on Spring 1. Cabins can sit apart or next to the farmhouse; nearby saves walking.',tags:['prep'],p:0},
   {id:'sp0c',t:'Keep the money shared (the default).',w:'One wallet pays the Vault from both incomes and nobody has to hand gold over. Separate wallets can be merged later at the Mayor’s Manor if you change your mind.',tags:['prep'],p:0},
   {id:'sp0d',t:'Bundles: Standard. Only tick Remixed in this app if you chose it in the Advanced Options.',w:'Remixed swaps one or two bundles per room for random alternatives. The route below assumes Standard; the Bundles section lists every remixed variant.',tags:['prep'],p:0},
   {id:'sp0e',t:'Each player picks a name, a look and a pet; the farm name is shared.',w:'Skills, energy, tools and professions are per player. The Community Center, buildings and money are shared.',tags:['prep'],p:0},
   {id:'sp0f',t:'Advanced Options: tick Guarantee Year 1 Completable.',w:'Red Cabbage Seeds are not sold by Pierre until Year 2 and the Dye bundle needs one. With this on, the Traveling Cart is guaranteed to sell the seeds once between Spring 7 and the Winter 16 Night Market. It can only be set when the farm is made.',tags:['prep','bundle'],p:0},
   {id:'sp0g',t:'Time runs in menus and while fishing in co-op; the host types /pause in chat for a real break.',w:'Single-player pauses on every menu. Co-op does not, so a chat, a phone call or a long look at a chest costs game hours unless the host pauses.',tags:['prep'],p:0}
  ]},
  {n:'1',t:'Spring 1 to 4',when:'days 1 to 4',steps:[
   {id:'sp1a',t:'Clear the plot by the house and plant the 15 free Parsnip Seeds.',w:'Parsnips take 4 days and sell for 35g. Water them before anything else each morning.',tags:['farm'],p:1},
   {id:'sp1b',t:'Spend the rest of the 500g at Pierre’s: 2 Cauliflower, 1 Bean Starter, Potato Seeds, Parsnip Seeds. Plant all of it today.',c:'Cauliflower Seeds: 80g; Bean Starter: 60g; Potato Seeds: 50g; Parsnip Seeds: 20g',w:'Cauliflower takes 12 days, so planted on Spring 1 it is in on the morning of Spring 13; beans take 10, potatoes 6, parsnips 4. That is the whole Spring Crops bundle in hand by the Egg Festival, and its reward is 20 Speed-Gro for the strawberries.',tags:['farm','shop','bundle'],p:1},
   {id:'sp1c',t:'Walk the whole map for Leek, Daffodil, Dandelion and Wild Horseradish. Keep one of each.',w:'The Spring Foraging bundle needs all four and they vanish on Summer 1. Daffodil and Dandelion can also be bought from Pierre at the Flower Dance on Spring 24, the other two cannot.',tags:['forage','bundle','deadline'],p:2,risk:'by Spring 28'},
   {id:'sp1d',t:'Chop 50 wood and craft a Chest by the door for bundle items.',c:'Chest: 50 Wood',w:'One chest just for the Community Center. Nothing in it gets sold by accident.',tags:['craft'],p:1},
   {id:'sp1e',t:'Spring 2: read Willy’s letter, walk to the beach, take the Bamboo Pole. Fish until dark.',w:'The river by town and the Mountain Lake both work from day 2. Ship every fish; the money lands overnight.',tags:['fish','money'],p:2},
   {id:'sp1f',t:'Spring 3 always rains: river for Catfish and Shad, beach after 4pm for Eel.',w:'All three are rain-only bundle fish. At level 0 the Catfish (75) and Eel (70) are hard; the Shad (45) is the realistic one. All three come back on any later rainy Spring or Fall day.',tags:['fish','bundle'],p:2},
   {id:'sp1g',t:'Clear stumps, weeds and rocks; keep the wood, fiber and stone.',w:'The Coop wants 300 Wood and 100 Stone, the Scarecrow 20 Fiber, the Chest 50 Wood. Selling raw materials never pays.',tags:['farm'],p:1},
   {id:'sp1h',t:'Ship every fish, extra forage and spare crop each night.',w:'The shipping bin pays the next morning. Keep only what a bundle wants.',tags:['money'],p:0}
  ]},
  {n:'2',t:'Spring 5 to 12',when:'days 5 to 12',steps:[
   {id:'sp2a',t:'Spring 5, 8am to 1pm: the host walks into town from the bus stop for the Center scene; then each player clicks the golden scroll inside.',w:'Only the host can trigger the scene, but every player must read the scroll themselves or they never get the Wizard’s letter and cannot hand in bundles.',tags:['bundle'],p:0},
   {id:'sp2b',t:'Spring 6: read the Wizard’s letter and visit his tower in the west of Cindersap Forest, each player.',w:'His potion makes every scroll readable. The Crafts Room is open from the start; the Pantry and Fish Tank appear after one bundle, the Boiler Room after two, the Bulletin Board after three, the Vault after four.',tags:['bundle'],p:0},
   {id:'sp2c',t:'Spring 5: the Mines open. Take Marlon’s free Rusty Sword and reach floor 5.',w:'Joja clears the landslide on Spring 5. The elevator remembers every fifth floor, for both players.',tags:['mine'],p:2},
   {id:'sp2d',t:'Mine 20 Copper Ore; Clint brings the Furnace recipe next morning. Craft it on the farm.',c:'Furnace: 20 Copper Ore, 25 Stone',w:'Every bar (5 ore + 1 coal) starts here: tools, sprinklers, kegs, the Blacksmith’s bundle.',tags:['mine','craft'],p:2},
   {id:'sp2e',t:'Kill 10 slimes on the way down: the Adventurer’s Guild opens.',w:'The Initiation letter comes the morning after floor 5. Marlon sells swords and boots from 2pm.',tags:['mine'],p:2},
   {id:'sp2f',t:'Floors 1 to 39: pick up every Quartz and Earth Crystal; keep one of each.',w:'Two of the four Geologist’s bundle items. Geodes go to Clint for 25g each; keep one Earth Crystal back before you start bombing.',tags:['mine','bundle'],p:2},
   {id:'sp2g',t:'Spring 5: harvest the parsnips; replant with Potatoes, Kale and more Cauliflower as the fish money comes in.',c:'Potato Seeds: 50g; Kale Seeds: 70g; Cauliflower Seeds: 80g',w:'Cauliflower planted by Spring 16 is in by Spring 28 at 175g. Kale is 6 days for 110g. Potatoes 6 days for 80g. Keep the field to what two cans water before 9am.',tags:['farm','shop'],p:1},
   {id:'sp2h',t:'Farming level 1: craft a Scarecrow in the middle of the crops.',c:'Scarecrow: 50 Wood, 1 Coal, 20 Fiber',w:'Crows eat unguarded crops. One scarecrow covers a circle 8 tiles out. Coal comes from the mines or 150g at Clint’s.',tags:['craft','farm'],p:1},
   {id:'sp2i',t:'Hand in the Spring Foraging bundle the day you hold all four.',w:'Reward: 30 Spring Seeds (plant them, they are free forage). The first bundle also lights the Fish Tank room.',tags:['bundle'],p:1},
   {id:'sp2j',t:'Dry days: Mountain Lake for Largemouth Bass, Carp, Bullhead and Chub; river after 6pm for Bream.',w:'Four bundle fish with no weather or season catch. Carp leaves the lake in Winter, so get it now.',tags:['fish','bundle'],p:2},
   {id:'sp2k',t:'Beach every morning: Clam, Cockle, Mussel, Oyster. Add a Crab from a Rock Crab and the Crab Pot bundle is done.',w:'Five of ten items and no pot needed. Rock Crabs on floors 1 to 29 drop a Crab 15% of the time. Reward: 3 Crab Pots.',tags:['forage','bundle'],p:2},
   {id:'sp2l',t:'Buy the Backpack the first day 2,000g is spare.',c:'Backpack: 2,000g',w:'12 more slots. Pierre sells it at the counter. Two players fill two bags, so both want it eventually; the fisher first.',tags:['shop'],p:2},
   {id:'sp2m',t:'Fishing level 2: Fiberglass Rod and a stack of bait.',c:'Fiberglass Rod: 1,800g; Bait: 5g each',w:'Bait halves the wait per bite, which is twice the fish per day. Bug Meat from the mines makes bait too (1 makes 5).',tags:['fish','shop','money'],p:2},
   {id:'sp2n',t:'Cook nothing yet; eat Salmonberries and Spring Onions (Cindersap Forest, south) in the mines.',w:'Spring Onions are free energy in the south of the forest. Salmonberry season is Spring 15 to 18.',tags:['forage'],p:2}
  ]},
  {n:'3',t:'Egg Festival, Spring 13',when:'day 13, 9am to 2pm',steps:[
   {id:'sp3a',t:'Both players into the town square between 9am and 2pm. It starts when everyone is there.',w:'Festivals are shared: the host starts it once every player is in the square. The day ends when it ends.',tags:['festival'],p:0},
   {id:'sp3b',t:'Buy Strawberry Seeds from Pierre’s stall: every gold above 500g. Till the tiles for them before 9am.',c:'Strawberry Seeds: 100g each',w:'Sold today only until next year. Planted tonight they fruit on Spring 21 and 25 at 120g each: 240g back on every 100g seed; the 20 tiles with Speed-Gro fruit a third time on Spring 28.',tags:['shop','money','deadline'],p:1,risk:'today only'},
   {id:'sp3c',t:'Egg hunt at the end if you want the Straw Hat: 6 eggs wins with two players.',w:'Nothing in it feeds the Community Center.',tags:['festival'],p:0},
   {id:'sp3d',t:'10pm, home: hand in the Spring Crops bundle, Speed-Gro on 20 tiles, then plant every strawberry seed tonight.',w:'Parsnip, Green Bean, Cauliflower, Potato: one each. Reward: 20 Speed-Gro. Speed-Gro on a tile before the seed goes in cuts strawberries to 7 days: three picks instead of two.',tags:['bundle','farm','money'],p:1}
  ]},
  {n:'4',t:'Spring 14 to 28',when:'days 14 to 28',steps:[
   {id:'sp4a',t:'Water the strawberries first every morning; pick Spring 21 and 25 (and 28 on the Speed-Gro tiles).',w:'Ship every strawberry except three to five from the last pick, kept for a Seed Maker in Fall.',tags:['farm','money'],p:1},
   {id:'sp4b',t:'Spring 15 to 18: strip the Salmonberry bushes around town and the forest; bank 100 or more.',w:'25 energy each, free, four days only. They are the mine food for the whole season.',tags:['forage'],p:2},
   {id:'sp4c',t:'Elevator to floor 40 by Spring 20. Floors 31 to 39: Bats drop the 10 Bat Wings.',w:'Bat Wings (94% per bat, 1 or 2 each) are the easy half of the Adventurer’s bundle; a Solar Essence from a Ghost on 51 to 79 is the other half. Then skip the 99 Slime and the Void Essence.',tags:['mine','bundle'],p:2},
   {id:'sp4d',t:'Smelt 5 Copper Bars and hand Clint the Pickaxe.',c:'Copper Pickaxe: 2,000g, 5 Copper Bar',w:'Two days without it, so do it right after a mine day. Copper one-hits every rock above floor 40.',tags:['mine','shop'],p:2},
   {id:'sp4e',t:'Ghostfish from the pond on floor 20 (any day, any time).',w:'One of the four Specialty Fish. Cast into the water on floor 20 or 60.',tags:['fish','bundle'],p:2},
   {id:'sp4f',t:'Build the Coop; buy chickens until you own one white and one brown.',c:'Coop: 4,000g, 300 Wood, 100 Stone; Chicken: 800g each',w:'Robin takes 3 days. Marnie picks the colour at random. Eggs from the fourth day; Large Eggs come with hearts, so pet them daily and let them out on grass. The Animal bundle wants a Large Egg and a Large Brown Egg.',tags:['animals','money','bundle'],p:1},
   {id:'sp4g',t:'Copper Watering Can on the evening before a forecast rain.',c:'Copper Watering Can: 2,000g, 5 Copper Bar',w:'Clint keeps it two days. The TV Weather Channel calls tomorrow; rain days need no watering, and the other player’s can covers the rest. It comes back full.',tags:['shop','farm'],p:1},
   {id:'sp4h',t:'By Spring 20: 20 Parsnip Seeds on Basic Fertilizer for the five gold Parsnips.',c:'Parsnip Seeds: 20g each; Basic Fertilizer: 2 Sap each',w:'The Quality Crops bundle takes 5 gold-star Parsnips, Melons, Pumpkins or Corn, three kinds of four. Parsnips are the cheap kind. Fertilizer and Farming level raise the gold odds; plant 20 and you will get 5.',tags:['farm','bundle'],p:1},
   {id:'sp4i',t:'Copper Axe right after the pickaxe; Steel Axe handed in by Spring 27 so the Secret Woods opens on Summer 1.',c:'Copper Axe: 2,000g, 5 Copper Bar; Steel Axe: 5,000g, 5 Iron Bar',w:'The Steel Axe breaks the log at the west edge of Cindersap Forest. Inside: Fiddlehead Fern (Summer only, Chef’s bundle), Woodskip in the pond, six hardwood a day. The iron comes from floors 41 to 79, so the mines have to reach 40 by Spring 20.',tags:['shop','mine','deadline'],p:2,risk:'Steel Axe by Summer 1'},
   {id:'sp4j',t:'Every rainy day: Catfish (river, until midnight), Shad (river, from 9am), Eel (beach, from 4pm).',w:'Rain-only, and Fall is the only other chance. Catfish sells 200g, so extras are money.',tags:['fish','bundle'],p:2},
   {id:'sp4k',t:'Floors 41 to 79 when you reach them: Iron Ore, one Frozen Tear, one whole Frozen Geode, coal from Dust Sprites.',w:'Frozen Tear is a Geologist’s item, the whole Frozen Geode is a Field Research item; do not crack that one. Dust Sprites drop coal half the time.',tags:['mine','bundle'],p:2},
   {id:'sp4l',t:'Spring 24: the Flower Dance is optional and costs the whole day.',w:'Pierre sells Daffodils and Dandelions there if you missed them. Nothing else for the Center.',tags:['festival'],p:0},
   {id:'sp4m',t:'When Demetrius asks about the cave (the morning after 25,000g earned): pick fruit bats.',w:'About one fruit a night, at random: Apple, Pomegranate, Cherry, Orange, Peach, Apricot and the wild berries. That is 3 Apples for Fodder, Apple and Pomegranate for Artisan, a Pomegranate for Enchanter’s, with no 4,000g and 6,000g saplings. The mushroom option is covered by the miner on floors 81 and up. If the cave is slow, the cart sells Apples at 300g to 1,000g.',tags:['bundle'],p:0},
   {id:'sp4o',t:'Farming 5: pick Tiller. Fishing 5: Fisher. Mining 5: Miner. Combat 5: Fighter.',w:'Picked at bedtime the night the level lands. Tiller leads to Artisan (+40% on kegs and jars) at 10; Fisher to Angler. The shipping bin uses the best profession of any player online, so both sets count for the whole farm.',tags:['prep'],p:0},
   {id:'sp4n',t:'Spring 28: harvest everything. Every Spring crop dies tonight.',w:'Strawberries too. Sell what no bundle wants.',tags:['farm','deadline'],p:1}
  ]}
 ],
 avoid:['Selling a Leek, Daffodil, Dandelion or Wild Horseradish before one of each is in the chest.','Missing Spring 13: no Strawberry Seeds until Year 2.','Spending the Spring 3 rain indoors: it is the year’s first Catfish and Eel day.','Cracking the Frozen Geode you meant to keep.','Building the Coop before the Backpack and the Fiberglass Rod: the rod earns, the coop costs.']
},
{id:'summer',name:'Summer',kicker:'SEASON 2 OF 4',
 goal:'Blueberries pay for everything. The Summer-only fish and forage, the mines to floor 120, the Vault paid and the bus running.',
 must:'Pufferfish on a sunny afternoon; Fiddlehead Fern and Woodskip in the Secret Woods; Grape, Spice Berry, Sweet Pea; Sea Urchin; Sturgeon; Melon, Tomato, Hot Pepper, Poppy, Sunflower, Wheat and Hops in the ground by Summer 3.',
 money:'The first two Vault payments in Summer; 20,000g to 40,000g banked by Fall 1 from 60 to 100 blueberry plants and the fish.',
 phases:[
  {n:'1',t:'Summer 1 to 3',when:'days 1 to 3',steps:[
   {id:'su1a',t:'Summer 1: buy every Blueberry Seed you can water and plant them today.',c:'Blueberry Seeds: 80g each',w:'13 days to the first pick, then every 4 days: Summer 14, 18, 22, 26. Three berries a pick at 50g is 600g back on each 80g seed. Planted after Summer 3 the fourth pick is lost.',tags:['farm','money','deadline','shop'],p:1,risk:'by Summer 3'},
   {id:'su1b',t:'Same day: 8 Melon on Basic Fertilizer, 2 Tomato, 2 Hot Pepper, 1 Poppy, 1 Sunflower, 10 Wheat, 8 Hops.',c:'Melon Seeds: 80g; Tomato Seeds: 50g; Pepper Seeds: 40g; Poppy Seeds: 100g; Sunflower Seeds: 200g; Wheat Seeds: 10g; Hops Starter: 60g',w:'Summer Crops bundle: Tomato, Hot Pepper, Blueberry, Melon. Quality Crops: five gold Melons. Chef’s: a Poppy. Dye: a Sunflower. Fodder: 10 Wheat. Hops are the Pale Ale for the kegs.',tags:['farm','bundle','shop'],p:1},
   {id:'su1c',t:'Summer 1 is always sunny: beach from noon to 4pm for the Pufferfish.',w:'Summer is its only season and it needs sun. Difficulty 80 and it floats up; eat a Dish O’ The Sea if you have one. Any sunny Summer afternoon works, but do not leave it to the last one.',tags:['fish','bundle','deadline'],p:2,risk:'Summer only'},
   {id:'su1d',t:'Mountain Lake 6am to 7pm for Sturgeon (cast 3 tiles out); beach for Tuna and Tilapia (before 2pm).',w:'Sturgeon is 78 and bites most on rainy Summer days; Winter is the second chance. Tuna comes back in Winter, Tilapia in Fall.',tags:['fish','bundle'],p:2},
   {id:'su1e',t:'Forage Grape, Spice Berry and Sweet Pea: the Summer Foraging bundle.',w:'Grape and Spice Berry in Cindersap Forest and the Backwoods, Sweet Pea along every road. All three are needed and all three are Summer-only.',tags:['forage','bundle'],p:2,risk:'Summer only'},
   {id:'su1f',t:'Fix the beach bridge with 300 Wood; pick Sea Urchins on the far side from then on.',c:'Bridge: 300 Wood',w:'Sea Urchin is a Dye bundle item and only spawns east of the bridge. Coral there sells 80g.',tags:['craft','bundle','forage'],p:1},
   {id:'su1g',t:'Any cart day: one Rare Seed for the Fall.',c:'Rare Seed: 1,000g, at the cart every Spring and Summer visit',w:'A Sweet Gem Berry grows in 24 days in Fall and sells for 3,000g. The first one goes to Old Master Cannoli, the statue in the Secret Woods: a Stardrop (+34 energy) for every player in the game.',tags:['shop','money'],p:1}
  ]},
  {n:'2',t:'Summer 4 to 12',when:'days 4 to 12',steps:[
   {id:'su2a',t:'Secret Woods every day: keep one Fiddlehead Fern, catch a Woodskip, chop the six stumps.',w:'The fern is one-shot this year. Woodskip is any day, any hour, cast 3 tiles out. Hardwood feeds the Construction bundle (10), the Cheese Press and the Stable.',tags:['forage','fish','bundle'],p:2,risk:'Summer only'},
   {id:'su2b',t:'Foraging 4: Tappers on a maple, an oak and a pine near the house.',c:'Tapper: 40 Wood, 2 Copper Bar each',w:'Maple Syrup (9 days) feeds the Chef’s bundle and the Bee House; Oak Resin (7 days) the kegs and the Enchanter’s bundle; Pine Tar (5 days) the Loom. Any two are Exotic Foraging items.',tags:['craft','bundle'],p:1},
   {id:'su2c',t:'Silo first, then the Barn.',c:'Silo: 100g, 100 Stone, 10 Clay, 5 Copper Bar',w:'Scythe the grass and it becomes hay in the silo: free feed for Winter. Without it the animals go hungry on the first snow day and stop producing.',tags:['animals','craft'],p:1},
   {id:'su2d',t:'Barn, then one cow.',c:'Barn: 6,000g, 350 Wood, 150 Stone; Cow: 1,500g',w:'Milk from the first day at 125g; Large Milk at high hearts is an Animal bundle item. Cheese from the Cheese Press (Farming 6) sells 230g and is an Artisan bundle item.',tags:['animals','money','bundle'],p:1},
   {id:'su2e',t:'Pay the Vault 2,500g and 5,000g the day the room appears.',c:'Vault: 2,500g, then 5,000g',w:'The Vault opens after four bundles. Rewards: 3 Chocolate Cake, 30 Quality Fertilizer. The 10,000g and 25,000g wait for the blueberry money.',tags:['money','bundle'],p:2},
   {id:'su2f',t:'Farming 4: Preserves Jars, as many as the wood allows.',c:'Preserves Jar: 50 Wood, 40 Stone, 8 Coal each',w:'Jelly is twice the fruit price plus 50: a 50g Blueberry becomes 150g Jelly in about 3 days. Jelly is an Artisan bundle item.',tags:['craft','money','bundle'],p:1},
   {id:'su2g',t:'Farming 3: a Bee House within 5 tiles of the Poppy.',c:'Bee House: 40 Wood, 8 Coal, 1 Iron Bar, 1 Maple Syrup',w:'Honey every 4 days: 100g plain, 380g Poppy Honey while the poppy blooms. Honey is an Artisan bundle item.',tags:['craft','bundle','money'],p:1},
   {id:'su2h',t:'Floors 41 to 79: 25 Iron Ore for the Steel Pickaxe; Ghosts on 51 to 79 drop the Solar Essence.',w:'Solar Essence (95% per Ghost) finishes the Adventurer’s bundle with the Bat Wings. Ghosts pass through walls; swing early.',tags:['mine','bundle'],p:2},
   {id:'su2i',t:'Steel Pickaxe.',c:'Steel Pickaxe: 5,000g, 5 Iron Bar',w:'One-hits floors 40 to 79 and breaks the farm boulders and the rock to the Dwarf.',tags:['shop','mine'],p:2},
   {id:'su2j',t:'Fishing 6: Iridium Rod with a Trap Bobber.',c:'Iridium Rod: 7,500g; Trap Bobber: 500g',w:'The rod takes bait and one tackle. The Trap Bobber makes the catch bar drain a third slower: that is the difference on Sturgeon, Pufferfish and Eel.',tags:['fish','shop'],p:2},
   {id:'su2k',t:'Summer 11: the Luau is optional and costs the day.',w:'Put a gold Melon or Cauliflower in the soup for friendship with everyone; skip it and both players get a full day instead.',tags:['festival'],p:0}
  ]},
  {n:'3',t:'Summer 13 to 27',when:'days 13 to 27',steps:[
   {id:'su3a',t:'Summer 13 and 26 always storm: beach for Red Snapper, river for Shad, lake for Sturgeon.',w:'Red Snapper is rain-only (Summer and Fall). Sturgeon bites most in Summer rain. Storms count as rain.',tags:['fish','bundle'],p:2},
   {id:'su3b',t:'Blueberries in every 4 days from Summer 14; keep one Blueberry, Melon, Tomato and Hot Pepper: Summer Crops bundle.',w:'Reward: a Quality Sprinkler. Ship the rest the same night or put them in jars.',tags:['farm','bundle','money'],p:1},
   {id:'su3c',t:'Keep five gold-star Melons for the Quality Crops bundle.',w:'Melons are 12 days; the fertilized ones give gold most often. With the five Parsnips that is two of the three kinds; Pumpkins in Fall are the third.',tags:['bundle'],p:1},
   {id:'su3d',t:'Big Coop, then a Duck.',c:'Big Coop: 10,000g, 400 Wood, 150 Stone; Duck: 1,200g',w:'Duck Egg for the Animal bundle, Duck Feather for the Dye bundle. Feathers drop now and then at high hearts; the Traveling Cart sells both if this waits until Fall.',tags:['animals','bundle'],p:1},
   {id:'su3e',t:'Pay the Vault 10,000g and 25,000g as the blueberry money lands: by Fall 20 at the latest.',c:'Vault: 10,000g, then 25,000g',w:'The bus runs from the next day (500g a ride). The Desert gives Sandfish, Cactus Fruit, Coconut and Starfruit seeds. Rewards: a Lightning Rod and a Crystalarium. Cranberries need 240g a seed on Fall 1, so if it is one or the other, seeds first and the 25,000g by Fall 20.',tags:['money','bundle','deadline'],p:2},
   {id:'su3f',t:'Floors 80 to 120: Fire Quartz and Gold Ore, the boots on 80, the sword on 90, the Stardrop on 100, the Skull Key on 120.',w:'Monsters hit for 15 to 18 from floor 80. Go on a lucky day (TV Fortune Teller) with 30 Salmonberries and a Cheese. The Stardrop is +34 energy for good.',tags:['mine','bundle'],p:2},
   {id:'su3g',t:'Hand in Blacksmith’s, Geologist’s and Adventurer’s: the Boiler Room is done and the minecarts run next day.',w:'Blacksmith’s: Copper, Iron, Gold Bar. Geologist’s: Quartz, Earth Crystal, Frozen Tear, Fire Quartz. Adventurer’s: 10 Bat Wing and 1 Solar Essence. Minecarts link the bus stop, the mines, the Quarry and town by Clint’s.',tags:['bundle','mine'],p:2},
   {id:'su3h',t:'Farming 6: a Cheese Press by the barn.',c:'Cheese Press: 45 Wood, 45 Stone, 10 Hardwood, 1 Copper Bar',w:'Milk in, Cheese out in 3 hours: 230g against 125g raw. Large Milk makes gold Cheese.',tags:['craft','money'],p:1},
   {id:'su3i',t:'Farming 8: Kegs, one per 8 Hops a day.',c:'Keg: 30 Wood, 1 Copper Bar, 1 Iron Bar, 1 Oak Resin each',w:'Hops go in at 25g and come out as Pale Ale at 300g in about a day and a half. Any fruit in a keg is Wine in 7 days; one Wine goes to the Enchanter’s bundle.',tags:['craft','money','bundle'],p:1},
   {id:'su3j',t:'Summer 20 and 21: the Trout Derby is optional; shops stay open.',w:'Rainbow Trout all day in the river by Marnie’s; the tags buy a Crab Pot and Deluxe Bait, nothing the Center needs.',tags:['festival'],p:0},
   {id:'su3k',t:'Once the bus runs: Desert pond for Sandfish (6am to 8pm), a Cactus Fruit and a Coconut from the ground.',c:'Bus: 500g a ride',w:'Sandfish is the last Specialty Fish. Cactus Fruit and Coconut are two of the five Exotic Foraging items; add Cave Carrot, Maple Syrup and Oak Resin and it is done.',tags:['fish','forage','bundle'],p:2},
   {id:'su3l',t:'Summer 28: Moonlight Jellies at 10pm on the beach, optional, nothing lost.',w:'The day runs normally until 10pm.',tags:['festival'],p:0},
   {id:'su3m',t:'Summer 28: harvest everything; Summer crops die tonight, hops and blueberries included.',w:'Fill the jars and kegs before bed.',tags:['farm','deadline'],p:1},
   {id:'su3n',t:'Green Rain (one random Summer day): scythe the big green weeds for Moss and Fiddlehead Ferns; nobody takes gifts today.',w:'New in 1.6. Villagers stay indoors in Year 1 and gifting is off. The weeds give Moss for Speed-Gro and Deluxe Bait, and a spare Fiddlehead Fern for the Chef’s bundle. It is probably not rain for the rain-only fish.',tags:['forage'],p:0}
  ]}
 ],
 avoid:['Planting blueberries after Summer 3: the fourth pick is gone.','A sunny Summer afternoon spent anywhere but the beach until the Pufferfish is in the chest.','Selling the only Fiddlehead Fern or the only Sea Urchin.','A Barn before a Silo.','Floor 80 and below on a bad-luck day with no food.']
},
{id:'fall',name:'Fall',kicker:'SEASON 3 OF 4',
 goal:'Cranberries and pumpkins on the field, the Fall-only forage and the Walleye, the fruit trees paying, the Pantry closed and the Greenhouse built.',
 must:'Walleye on the first rainy day; Blackberry, Hazelnut, Wild Plum, Common Mushroom; Corn, Eggplant, Pumpkin, Yam and five gold Pumpkins; 3 Apples; the Fair on Fall 16.',
 money:'100,000g or more by Winter 1: cranberries, pumpkins, jars, kegs and the fish.',
 phases:[
  {n:'1',t:'Fall 1 to 3',when:'days 1 to 3',steps:[
   {id:'fa1a',t:'Fall 1: Cranberry Seeds on most of the field, Pumpkins on the rest (8 on Basic Fertilizer), plus 1 Corn, 2 Eggplant, 2 Yam.',c:'Cranberry Seeds: 240g; Pumpkin Seeds: 100g; Corn Seeds: 150g; Eggplant Seeds: 20g; Yam Seeds: 60g',w:'Cranberries: 7 days then every 5, two berries at 75g: 750g back on each 240g seed by Fall 28. Pumpkins: 13 days, 320g, two harvests. Fall Crops bundle: Corn, Eggplant, Pumpkin, Yam. Quality Crops: five gold Pumpkins.',tags:['farm','money','bundle','shop'],p:1},
   {id:'fa1b',t:'Fall 1 is always sunny: Tiger Trout from the river, Sardine and Tilapia (before 2pm) at the beach.',w:'Tiger Trout finishes the River Fish bundle with the Sunfish, Catfish and Shad. Tilapia is Summer and Fall only.',tags:['fish','bundle'],p:2},
   {id:'fa1c',t:'Forage Hazelnut, Wild Plum and Common Mushroom daily; Blackberries are on every bush Fall 8 to 11.',w:'Fall Foraging bundle, all four, Fall only. Shake the hazelnut trees too. Keep one of each before selling any.',tags:['forage','bundle','deadline'],p:2,risk:'Fall only'},
   {id:'fa1d',t:'Every Friday and Sunday: the Traveling Cart in Cindersap Forest, 6am to 8pm.',c:'Cart prices: 3x to 5x the shop price',w:'It sells almost anything at random: Red Cabbage Seeds, Rabbit’s Foot, Truffle, Nautilus Shell, Apple, Pomegranate, Wool, Duck Feather, Ancient Seeds. These are the bundle items you cannot farm this year, so check it every time.',tags:['shop','bundle'],p:1}
  ]},
  {n:'2',t:'The first rainy day',when:'first rain after Fall 1',steps:[
   {id:'fa2a',t:'Rain in Fall: from noon, Cindersap Forest pond for the Walleye. Nothing else comes first.',w:'Walleye is Fall-only and rain-only, noon to 2am, about one cast in three at the forest pond. It never rains in Winter. This is the tightest window of the year.',tags:['fish','bundle','deadline'],p:2,risk:'Fall rain only'},
   {id:'fa2b',t:'Same day: river before noon for Catfish and Shad if still missing; beach after 4pm for Eel, Red Snapper until 7pm.',w:'The last rain-only chances of the year. Catfish is also money at 200g.',tags:['fish','bundle'],p:2},
   {id:'fa2c',t:'No watering today: Community Center run, Robin’s, Clint’s, and the cart if it is Friday or Sunday.',w:'A rain day is a free day for the farmer. Hand in every bundle that is ready.',tags:['bundle'],p:1}
  ]},
  {n:'3',t:'Fall 4 to 15',when:'days 4 to 15',steps:[
   {id:'fa3a',t:'Big Barn, then a Goat.',c:'Big Barn: 12,000g, 450 Wood, 200 Stone; Goat: 4,000g',w:'Large Goat Milk is an Animal bundle item and needs a goat at high hearts (she gives milk every other day). Goat Cheese is an Artisan item at 400g.',tags:['animals','bundle'],p:1},
   {id:'fa3b',t:'From the cave: keep 3 Apples for Fodder, 1 Apple and 1 Pomegranate for Artisan, 1 Pomegranate for Enchanter’s.',w:'The fruit bats drop about one a night; any that are slow to come are 300g to 1,000g at the cart.',tags:['bundle'],p:1},
   {id:'fa3h',t:'Fall 1: plant the Rare Seed. Fall 25: the Sweet Gem Berry goes to Old Master Cannoli in the Secret Woods.',c:'Rare Seed: 1,000g (bought in Summer)',w:'The statue takes one berry and gives every player a Stardrop. A second seed is 3,000g at the bin.',tags:['farm','money'],p:1},
   {id:'fa3c',t:'Artisan bundle (6 of 12): Honey, Jelly, Cheese, Apple, Goat Cheese and a Pomegranate from the cart.',w:'Reward: a Keg. Cloth, Truffle Oil and the other tree fruits are the alternatives.',tags:['bundle'],p:1},
   {id:'fa3d',t:'Hand in Ocean Fish (Sardine, Tuna, Red Snapper, Tilapia) and River Fish (Sunfish, Catfish, Shad, Tiger Trout).',w:'Rewards: 5 Warp Totem: Beach and 30 Deluxe Bait. The totems are for the night windows.',tags:['fish','bundle'],p:2},
   {id:'fa3e',t:'Chef’s bundle: Maple Syrup, Fiddlehead Fern, Poppy, a Fried Egg, a Maki Roll, a Truffle.',c:'Maki Roll recipe: 300g at the Saloon; Rice: 200g at Pierre’s; Cookout Kit: 15 Wood, 10 Fiber, 3 Coal',w:'Both dishes cook on a Cookout Kit (Foraging 3) or in a kitchen. Maki Roll is any fish, a Seaweed and a Rice; the TV also teaches it on Summer 21. Truffle is a pig item: the cart is the Year 1 source.',tags:['bundle'],p:1},
   {id:'fa3f',t:'Fall 16: the Fair, 9am to 3pm. Nine gold-star items of several kinds in the display; first place is 1,000 tokens, the Stardrop 2,000.',c:'Games: 50g a round; Star Tokens: 50g each',w:'One shared display; the host has Lewis judge it and each player collects the same tokens. The fishing game (50g) tops the count up; eat luck food before entering because you cannot eat inside. The Stardrop is +34 energy for the rest of the game.',tags:['festival','money'],p:0},
   {id:'fa3g',t:'Skull Cavern on a very-happy-spirits day: Skull Key, bus ticket, 10 Staircases, 30 Salmonberries, one Warp Totem.',c:'Staircase: 99 Stone each; Bus: 500g',w:'Iridium Ore starts around floor 25 and thickens past 50. Iridium bars are Year 2 sprinklers and the Iridium Rod’s tackle upgrades; none of it is needed for the Center. Leave by 1am.',tags:['mine','money'],p:2}
  ]},
  {n:'4',t:'Fall 16 to 28',when:'days 16 to 28',steps:[
   {id:'fa4a',t:'Pumpkins in on Fall 14 and 27: keep five gold and one plain. Hand in Fall Crops and Quality Crops.',w:'Fall Crops: Corn, Eggplant, Pumpkin, Yam. Quality Crops: 5 gold Parsnip, 5 gold Melon, 5 gold Pumpkin. Rewards: a Bee House and a Preserves Jar.',tags:['farm','bundle'],p:1},
   {id:'fa4b',t:'Animal bundle (5 of 6): Large Egg, Large Brown Egg, Large Milk, Duck Egg, and Large Goat Milk or Wool.',w:'Large products come with hearts and mood: pet every animal every day, keep them fed. Wool needs a sheep (Deluxe Barn) or a rabbit (Deluxe Coop): buy it at the cart instead.',tags:['animals','bundle'],p:1},
   {id:'fa4c',t:'Pantry done: the Greenhouse stands the next morning.',w:'Any crop, any season, never dies, 120 tiles inside. Plant it on the first day; the Focus tab has the ladder.',tags:['bundle','farm'],p:1},
   {id:'fa4d',t:'Enchanter’s bundle: Oak Resin, Wine, Rabbit’s Foot (cart), Pomegranate (cart or tree).',w:'Reward: 5 Gold Bars. Wine is any fruit in a keg for 7 days.',tags:['bundle'],p:1},
   {id:'fa4e',t:'Dye bundle: Red Mushroom, Sea Urchin, Sunflower, Duck Feather, Aquamarine (nodes from floor 40), Red Cabbage.',w:'Reward: a Seed Maker. Red Cabbage Seeds are not at Pierre’s until Year 2; cart seeds grow in the greenhouse in any season.',tags:['bundle','mine'],p:2},
   {id:'fa4f',t:'Fall 27: Spirit’s Eve, 10pm at the town square. The maze ends at a Golden Pumpkin.',w:'The Golden Pumpkin sells for 2,500g. Nothing else for the Center.',tags:['festival','money'],p:0},
   {id:'fa4g',t:'Fall 28: last cranberries and pumpkins in; scythe grass into the silo until it is full.',w:'Animals stay indoors all Winter and eat one hay each a day; the silo holds 240. Grass survives Winter dormant since 1.6, but nobody grazes it.',tags:['farm','animals','deadline'],p:1}
  ]}
 ],
 avoid:['A rainy Fall day that ends without a Walleye.','Selling a Hazelnut, Wild Plum or Common Mushroom before the Fall Foraging bundle is in.','Fall 28 with grass still standing and an empty silo.','Missing the Fair: the Stardrop is +34 energy for the whole of Year 2.','Skull Cavern with bundle items in the bag.']
},
{id:'winter',name:'Winter',kicker:'SEASON 4 OF 4',
 goal:'The last bundles: Winter forage, the Nautilus Shell, Sturgeon and Tuna again, the Night Market. Then the ceremony and a greenhouse full for Year 2.',
 must:'Winter Root, Snow Yam, Crystal Fruit, Crocus; a Nautilus Shell from the beach; Winter 15 to 17 Night Market; every bundle in by Winter 28.',
 money:'Jars and kegs all season. 150,000g or more into Year 2 with the greenhouse planted.',
 phases:[
  {n:'1',t:'Winter 1 to 7',when:'days 1 to 7',steps:[
   {id:'wi1a',t:'Forage Crystal Fruit and Crocus daily; hoe the artifact spots (the wiggling worms) for Winter Root and Snow Yam.',w:'Winter Foraging bundle, all four. Winter Root also drops from Blue Slimes on floors 41 to 79; Snow Yam only comes from the ground.',tags:['forage','bundle'],p:2,risk:'Winter only'},
   {id:'wi1b',t:'Beach every morning until a Nautilus Shell turns up.',w:'Winter beach forage, uncommon. The Traveling Cart sells it too. It is the last Field Research item.',tags:['forage','bundle'],p:2,risk:'Winter only'},
   {id:'wi1c',t:'Sturgeon and Tuna are back: lake and beach, 6am to 7pm. Hand in Lake Fish and the rest of the Fish Tank.',w:'Lake Fish: Largemouth Bass, Carp, Bullhead, Sturgeon. Night Fishing: Walleye, Bream, Eel. Specialty: Pufferfish, Ghostfish, Sandfish, Woodskip. The room done removes the Glittering Boulder and Willy gives you a Copper Pan.',tags:['fish','bundle'],p:2},
   {id:'wi1d',t:'Winter 1: plant the greenhouse and fill every jar and keg with cranberries and pumpkins.',w:'Cranberry Jelly 200g, Cranberry Wine 225g, Pumpkin Juice 720g. The Focus tab has the greenhouse ladder.',tags:['farm','money'],p:1},
   {id:'wi1e',t:'Field Research: Purple Mushroom (floors 81 to 119), Nautilus Shell, Chub, the whole Frozen Geode.',w:'Reward: a Recycling Machine. Chub is any river or lake, any time.',tags:['bundle','mine'],p:2},
   {id:'wi1f',t:'Hay from the silo into the feeding bench every morning; pet everything.',w:'Animals do not leave the building in Winter. A Heater (Fodder bundle reward) keeps their mood up.',tags:['animals'],p:1}
  ]},
  {n:'2',t:'Winter 8 to 14',when:'days 8 to 14',steps:[
   {id:'wi2a',t:'Winter 8: Festival of Ice, 9am to 2pm in Cindersap Forest; optional, costs the day.',w:'The ice fishing contest gives a Sailor’s Cap and bait; nothing for the Center.',tags:['festival'],p:0},
   {id:'wi2b',t:'Winter 12 and 13: SquidFest on the beach; optional, shops stay open.',w:'Squid all day; prizes for counts. Willy is open on the 13th even though it is Saturday.',tags:['festival'],p:0},
   {id:'wi2c',t:'Fodder bundle: 10 Wheat, 10 Hay, 3 Apples.',c:'Hay: 50g each at Marnie’s',w:'Reward: a Heater. Hay comes out of the silo through the hopper too.',tags:['bundle'],p:1},
   {id:'wi2d',t:'Cook the Fried Egg and the Maki Roll on a Cookout Kit if the Chef’s bundle is still open.',c:'Cookout Kit: 15 Wood, 10 Fiber, 3 Coal; Maki Roll recipe: 300g at the Saloon',w:'Maki Roll: any fish, Seaweed, Rice. Fried Egg: one Egg. The kit vanishes overnight, so cook both the same day.',tags:['bundle'],p:1}
  ]},
  {n:'3',t:'Night Market, Winter 15 to 17',when:'days 15 to 17, 5pm to 2am',steps:[
   {id:'wi3a',t:'Beach after 5pm: the Traveling Cart is at the market all three nights. Check it for every missing bundle item.',w:'Same random stock rules as the forest cart, three nights running. It is the last shop of the year for Rabbit’s Foot, Truffle, Red Cabbage Seeds and Nautilus Shell.',tags:['shop','bundle'],p:1},
   {id:'wi3b',t:'Submarine (1,000g) only if your fish bundle is the remixed Master Fisher’s: Blobfish is one catch in ten.',c:'Submarine: 1,000g a ride',w:'Standard bundles never need it. Board between 5pm and 11pm, fish until 2am.',tags:['fish','bundle'],p:2,set:'remix'},
   {id:'wi3c',t:'Bulletin Board: hand in Chef’s, Dye, Field Research, Fodder and Enchanter’s.',w:'The board done gives two hearts with every non-datable villager you have met, overnight.',tags:['bundle'],p:0}
  ]},
  {n:'4',t:'Winter 18 to 28',when:'days 18 to 28',steps:[
   {id:'wi4a',t:'Hand in whatever is left. The night the last bundle goes in, the Junimos rebuild the Center.',w:'The ceremony plays the next sunny day you walk into town: the Stardew Hero trophy. If the Missing Bundle interests you, it opens in the abandoned JojaMart after a storm.',tags:['bundle'],p:0},
   {id:'wi4b',t:'Winter 25: Feast of the Winter Star, 9am to 2pm; bring a gift for your secret friend.',w:'Costs the day. Nothing for the Center.',tags:['festival'],p:0},
   {id:'wi4c',t:'Robin: the farmhouse kitchen if you still cook on a campfire.',c:'House upgrade: 10,000g, 450 Wood',w:'A kitchen and a fridge. Three days of building. The second upgrade (65,000g, 100 Hardwood) adds the cellar for casks: Year 2.',tags:['craft'],p:1},
   {id:'wi4d',t:'Winter 28: sleep. Year 2 starts with the greenhouse full, the kegs running, the bus and the minecarts open.',w:'Spring 1 of Year 2: Pierre sells Red Cabbage, Garlic, Rhubarb and Artichoke seeds; the Vault money is behind you.',tags:['prep'],p:0}
  ]}
 ],
 avoid:['Walking past the Night Market cart without checking it.','Leaving the Winter Root and Snow Yam for the last week: artifact spots are random.','Passing out in the Skull Cavern with bundle items in the bag.','Selling the Nautilus Shell.']
}
];

/* ---------- THE YEAR AT A GLANCE ---------- */
var BRIEF = {
 seasons:{
  spring:{must:['Spring forage: Leek, Daffodil, Dandelion, Wild Horseradish','Spring 13: Strawberry Seeds','Keep a Parsnip, Potato, Cauliflower, Green Bean','Apple sapling planted by Summer 1'],money:'8,000g to 15,000g by Spring 28'},
  summer:{must:['Summer 1: blueberries in','Pufferfish, sunny, noon to 4pm','Secret Woods: Fiddlehead Fern, Woodskip','Vault paid by Summer 28'],money:'40,000g to 60,000g by Fall 1'},
  fall:{must:['First rain: Walleye at the forest pond','Fall forage: Blackberry, Hazelnut, Wild Plum, Common Mushroom','Five gold Pumpkins','Fall 16: the Fair and its Stardrop'],money:'100,000g by Winter 1'},
  winter:{must:['Winter forage: Winter Root, Snow Yam, Crystal Fruit, Crocus','Nautilus Shell from the beach','Winter 15 to 17: the Night Market cart','Every bundle in by Winter 28'],money:'150,000g into Year 2'}
 },
 split:{
  p1:['Water, harvest, plant, ship: the field is yours.','Pet and feed the animals; collect eggs and milk.','One Community Center run a day with whatever is ready.','Robin, Pierre, Clint (watering can), the cart on Fridays and Sundays.','Jars, kegs, bee houses, tappers.'],
  p2:['Rod in the water from 6am on the fish the season allows.','Rain days are fish days, never mine days.','Dry days: the mines from noon to 1am, elevator down.','Forage the beach and the map on the way.','Bars from the furnace to the farmer for tools and machines.']
 },
 solo:['Water and harvest first thing, then forage on the way to the water.','Rain days: fish the rain-only bundle fish.','Dry days: the mines after the field, home by 1am.','One Community Center run whenever three items are ready.']
};

/* ---------- FINISH ---------- */
var FINISH = [
 'Every room lit and the Stardew Hero trophy in the farmhouse.',
 'Greenhouse planted, jars and kegs running, the bus and the minecarts open.',
 'Both players past level 5 in their main skills with the professions chosen.',
 '150,000g or more banked for Year 2.'
];

/* ---------- NOTES ---------- */
var NOTES = {
 intro:'Items, hours, seasons, weather, prices and recipes come from the Stardew Valley Wiki (1.6). The order of the steps and the day targets are the common Year 1 route from player guides, adjusted for two players. Things the sources do not settle:',
 items:[
  'How often it rains: the wiki fixes only Spring 3 (rain), Summer 13 and 26 (storm), the first day of each season and festival days (sun). Plan on a few rainy days a season and treat every Fall rain as Walleye day.',
  'Green Rain (one Summer day, new in 1.6) is probably not rain for the rain-only fish; test the river when it happens.',
  'Money per day from fishing is an estimate from sell prices, not a wiki figure. The season money lines are targets, not promises.',
  'The Traveling Cart is random. Red Cabbage Seeds, Rabbit’s Foot and Truffle may never appear in a given year; the route says where the farmed version comes from too.',
  'Large animal products depend on hearts and mood, which the wiki gives as a formula, not a date. Pet daily and they arrive.',
  'Remixed bundles: the game picks one variant per slot at creation. The Bundles section lists them all; the route only follows the standard set.',
  'Speed-Gro put on a tile after the seed is in still works in 1.6, but only on the growth stages still to come; the route fertilises before planting to be safe.',
  'The Community Center never closes, so the Spring 13 hand-in at 10pm works; if it does not on your build, do it Spring 14 morning and fertilise then.'
 ]
};

/* ---------- MONEY ENGINES ---------- */
var ENGINE_ORDER = ['berries','kegs','ancient','animals','starfruit','fishing'];
var ENGINES = {
 berries:{name:'Berries',kind:'crops',from:'Spring 13',price:'Strawberry 120g, Blueberry 50g x3, Cranberry 75g x2',
  sum:'Three regrowing fruits, one per season. Strawberries from the Egg Festival pay twice before Spring ends; blueberries pick four times in Summer at 600g back per 80g seed; cranberries pick five times in Fall. The berries never need replanting inside their season, so the work is watering, and Quality Sprinklers from Farming 6 take that over.',
  finish:'A field of cranberries in jars, and blueberry seeds already budgeted for Summer 1 of Year 2.',
  ladder:[
   {name:'Strawberry Seeds',kind:'Spring',sub:'Egg Festival, Spring 13 only',use:'Two picks before Spring 28: Spring 21 and 25; three on Speed-Gro tiles',io:'100g seed → 2 x 120g = 240g',facts:['8 days, regrows every 4','plant Spring 13 at night'],link:'sell the first pick, keep 3 fruit from the last for a Seed Maker in Fall'},
   {name:'Blueberry Seeds',kind:'Summer',sub:'Pierre’s, 80g',use:'Four picks: Summer 14, 18, 22, 26 if planted by Summer 3',io:'80g seed → 4 x 3 x 50g = 600g',facts:['13 days, regrows every 4','3 berries a pick'],link:'100 plants is 8,000g in and about 60,000g out'},
   {name:'Cranberry Seeds',kind:'Fall',sub:'Pierre’s, 240g',use:'Five picks: Fall 8, 13, 18, 23, 28',io:'240g seed → 5 x 2 x 75g = 750g',facts:['7 days, regrows every 5','2 berries a pick'],link:'the last pick goes into jars over Winter'},
   {name:'Preserves Jar',kind:'Machine',sub:'Farming 4: 50 Wood, 40 Stone, 8 Coal',use:'Any fruit in, Jelly out at twice the price plus 50',io:'Blueberry 50g → Jelly 150g (about 3 days); Cranberry 75g → Jelly 200g',facts:['Artisan profession +40%']}
  ],
  numbers:['Strawberry: 100g seed, 8 days, regrow 4, 120g fruit. Two picks in Year 1 Spring.','Blueberry: 80g seed, 13 days, regrow 4, 3 fruit at 50g. Four picks from Summer 1 to 3 planting.','Cranberry: 240g seed, 7 days, regrow 5, 2 fruit at 75g. Five picks from Fall 1.','Jelly: 2 x fruit + 50g. Wine: 3 x fruit, 7 days. Tiller +10% on raw crops, Artisan +40% on jelly and wine.'],
  avoid:['Planting blueberries after Summer 3 or cranberries after Fall 5.','Speed-Gro on cranberries: 7 days becomes 5, still five picks, nothing gained.'],
  seasons:{
   spring:[
    {id:'e-ber-sp1',t:'Spring 13: every spare gold into Strawberry Seeds; plant them that night.',c:'Strawberry Seeds: 100g each',w:'Two picks before the season ends, three on the 20 Speed-Gro tiles from the Spring Crops bundle.',tags:['money','deadline'],p:1,risk:'Spring 13 only'},
    {id:'e-ber-sp2',t:'Keep 3 to 5 strawberries from the Spring 26 pick in a chest for the Seed Maker.',w:'A Seed Maker (Farming 9, or the Dye bundle reward) turns one fruit into 1 to 3 seeds. Seeds kept over Winter mean strawberries on Spring 1 of Year 2, before the festival.',tags:['money'],p:1}
   ],
   summer:[
    {id:'e-ber-su1',t:'Summer 1: 100 Blueberry Seeds if the money is there, fewer if not; everything planted by Summer 3.',c:'Blueberry Seeds: 80g each',w:'8,000g in, about 60,000g out by Summer 26 at base price, more with Tiller.',tags:['money','deadline'],p:1,risk:'by Summer 3'},
    {id:'e-ber-su2',t:'Both players water the berries before anything else; Quality Sprinklers (Farming 6) as the bars arrive.',c:'Quality Sprinkler: 1 Iron Bar, 1 Gold Bar, 1 Refined Quartz each',w:'One Quality Sprinkler waters the 8 tiles around it. Twelve of them cover 100 plants and free both players by 8am.',tags:['craft','farm'],p:1},
    {id:'e-ber-su3',t:'Pick every 4 days from Summer 14; ship the same night, jars for the spill-over.',w:'A blueberry is 50g raw, 150g as jelly. Sell raw when the Vault is waiting, jar it when it is paid.',tags:['money'],p:1}
   ],
   fall:[
    {id:'e-ber-fa1',t:'Fall 1: Cranberry Seeds on every tile the sprinklers cover.',c:'Cranberry Seeds: 240g each',w:'750g back per seed over five picks. The first pick on Fall 8 repays the seeds.',tags:['money','deadline'],p:1,risk:'by Fall 5'},
    {id:'e-ber-fa2',t:'Fall 28: the last pick goes into jars and kegs, not the bin.',w:'Cranberry Jelly 200g in 3 days; Cranberry Wine 225g in 7. Winter is processing time.',tags:['money'],p:1}
   ],
   winter:[
    {id:'e-ber-wi1',t:'Keep the jars turning over all Winter; bank 8,000g for Summer blueberries and 24,000g for Fall cranberries.',w:'Year 2 repeats the ladder with sprinklers already down: the same field, none of the watering.',tags:['money'],p:1}
   ]
  }},
 kegs:{name:'Kegs and wine',kind:'artisan',from:'Farming 8',price:'Pale Ale 300g, Blueberry Wine 150g, Pumpkin Juice 720g',
  sum:'A Keg turns a 25g Hop into 300g Pale Ale in about a day and a half, any fruit into Wine at three times its price in 7 days, and vegetables into Juice at 2.25 times in 4 days. Kegs need Farming 8 and one Oak Resin each, so tappers go up in Summer and the kegs land in Fall. With the Artisan profession every keg output is 40% higher.',
  finish:'Twenty kegs or more in a shed or along the fences, fed by hops, pumpkins and the greenhouse.',
  ladder:[
   {name:'Tapper',kind:'Foraging 4',sub:'40 Wood, 2 Copper Bar',use:'On an oak: Oak Resin every 7 days, one per keg',io:'1 oak → 4 Oak Resin a season',facts:['maple: Maple Syrup 9 days','pine: Pine Tar 5 days'],link:'three tappers on oaks in Summer make 12 kegs’ worth by Fall'},
   {name:'Hops Starter',kind:'Summer',sub:'Pierre’s, 60g, trellis',use:'One hop a day from Summer 12 until Summer 28',io:'60g seed → about 17 Hops',facts:['11 days, regrows daily','trellis: leave a walking gap'],link:'each hop is a Pale Ale'},
   {name:'Keg',kind:'Farming 8',sub:'30 Wood, 1 Copper Bar, 1 Iron Bar, 1 Oak Resin',use:'Pale Ale, Wine, Juice, Beer, Mead, Coffee',io:'Hop 25g → Pale Ale 300g (about 1.5 days); fruit → Wine 3x (6 days); vegetable → Juice 2.25x (4 days)',facts:['Artisan +40%'],link:'the Artisan bundle rewards a free Keg'},
   {name:'Pale Ale',kind:'Output',sub:'300g, 420g with Artisan',use:'The best Year 1 keg product per day of keg time',io:'8 hops a day keep 12 kegs busy',facts:['Pumpkin Juice 720g in 4 days','Starfruit Wine 2,250g in 7 days']}
  ],
  numbers:['Keg times: Pale Ale about 1.5 days, Juice 4 days, Wine about 6 days, Beer (Wheat) 1 day, Mead (Honey) 10 hours, Coffee (5 beans) 2 hours.','Wine = 3 x fruit price: Blueberry 150g, Cranberry 225g, Melon 750g, Pumpkin is a vegetable (Juice 720g).','Artisan (Farming 10, from Tiller) is +40% on everything a keg or jar makes. Take it.','Kegs on the farm work anywhere, indoors or out; a Shed (15,000g, 300 Wood) holds 67 of them.'],
  avoid:['Kegging low-value fruit when the jar pays more: below 40g the jar wins.','Wheat in kegs: Beer is 200g, Pale Ale is 300g from a cheaper seed.'],
  seasons:{
   spring:[
    {id:'e-keg-sp1',t:'Copper Bars to the farmer: 2 per Tapper.',w:'Tappers need Foraging 4 and 2 Copper Bars each. Three on oaks by early Summer means 12 Oak Resin by Fall 1.',tags:['craft'],p:2}
   ],
   summer:[
    {id:'e-keg-su1',t:'Summer 1: 8 Hops Starters on a trellis row at the field edge.',c:'Hops Starter: 60g each',w:'One hop a day from Summer 12. The trellis blocks walking, so put the row where nothing needs to pass.',tags:['farm','money'],p:1},
    {id:'e-keg-su2',t:'Tappers on three oaks as soon as Foraging 4 lands.',c:'Tapper: 40 Wood, 2 Copper Bar each',w:'Oak Resin every 7 days per tapper. One per keg.',tags:['craft'],p:1},
    {id:'e-keg-su3',t:'Farming 8 (late Summer with 100 blueberries): the first Kegs, hops straight in.',c:'Keg: 30 Wood, 1 Copper Bar, 1 Iron Bar, 1 Oak Resin each',w:'Pale Ale 300g from a 25g hop. Bars come from the miner; ask for 10 iron and 10 copper.',tags:['craft','money'],p:1}
   ],
   fall:[
    {id:'e-keg-fa1',t:'Grow 20 Pumpkins for juice on top of the bundle ones.',c:'Pumpkin Seeds: 100g each',w:'Pumpkin Juice is 720g in 4 days, 1,008g with Artisan. Two harvests: Fall 14 and 27.',tags:['farm','money'],p:1},
    {id:'e-keg-fa2',t:'Keep one Wine for the Enchanter’s bundle.',w:'Any fruit in a keg, 7 days.',tags:['bundle'],p:1}
   ],
   winter:[
    {id:'e-keg-wi1',t:'Winter: kegs full of cranberries and pumpkins, and a Shed for Year 2 if 15,000g is spare.',c:'Shed: 15,000g, 300 Wood',w:'Everything from the greenhouse goes through kegs from here on.',tags:['money'],p:1}
   ]
  }},
 ancient:{name:'Ancient Fruit',kind:'greenhouse',from:'Greenhouse (Pantry)',price:'Fruit 550g, Wine 1,650g (2,310g Artisan)',
  sum:'Ancient Fruit takes 28 days to grow and then fruits every 7 days forever in the greenhouse. One plant is 550g a week raw or 1,650g as wine; a greenhouse full of it is the classic Year 2 engine. Year 1 is about getting the Greenhouse (finish the Pantry) and one seed: the cart stopped selling Ancient Seeds in 1.6.3, so the seed comes from an Ancient Seed artifact taken to Gunther, a fishing chest or an artifact trove, and a Seed Maker multiplies it. If no seed turns up, Starfruit fills the greenhouse instead.',
  finish:'The greenhouse planted with Ancient Fruit by Winter 1, first fruit Winter 28, wine from Spring.',
  ladder:[
   {name:'Ancient Seed (artifact)',kind:'Luck',sub:'artifact spots in the Forest and on the Mountain (0.7%), fishing chests, artifact troves',use:'Donate it to Gunther: he gives one packet of Ancient Seeds and the recipe to make more from artifacts',io:'1 artifact → 1 plantable seed',facts:['not sold anywhere since 1.6.3','bugs and grubs drop it 0.5%'],link:'one plant becomes many through the Seed Maker'},
   {name:'Greenhouse',kind:'Pantry reward',sub:'built the night the Pantry is done',use:'Any crop, any season, never dies',io:'120 tiles: 10 by 12',facts:['sprinklers work inside','trees fit around the edge'],link:'plant the seeds you have on the first day'},
   {name:'Seed Maker',kind:'Farming 9, or Dye bundle reward',sub:'25 Wood, 10 Coal, 1 Gold Bar',use:'One Ancient Fruit in, 1 to 3 Ancient Seeds out',io:'1 fruit → 1 to 3 seeds (20 min)',facts:['2% chance of a Mixed Seeds instead'],link:'every 7 days the harvest doubles the bed until it is full'},
   {name:'Ancient Fruit',kind:'Output',sub:'28 days to first fruit, then every 7',use:'550g raw, 1,650g as wine',io:'116 plants → about 60,000g a week raw, 190,000g as wine',facts:['Tiller +10% raw','Artisan +40% wine']}
  ],
  numbers:['Growth: 28 days, then regrows every 7. Never dies in the greenhouse.','Ancient Seeds packet: Gunther after the artifact, a Seed Maker from a fruit (1 to 3 seeds, or 0.5% from any other crop). The cart no longer sells them.','Wine: 1,650g base, 2,310g with Artisan, 7 days in a keg. Aged in a cask (cellar, house upgrade 2) it reaches iridium at 3,300g.','The greenhouse also grows Starfruit (Oasis, 400g seed, 13 days, 750g) any season; it does not regrow.'],
  avoid:['Selling the artifact Ancient Seed: Gunther is the only way to the recipe.','Planting Ancient Fruit outdoors in Fall: it dies on Winter 1 before it fruits.'],
  seasons:{
   spring:[
    {id:'e-anc-sp1',t:'Hoe every artifact spot (the wiggling worms) on the Mountain, in the Forest and at the bus stop.',w:'The Ancient Seed artifact is rare but this is where it lives. Take it to Gunther at the museum the day you find it.',tags:['forage'],p:2},
    {id:'e-anc-sp2',t:'Open every fishing treasure chest and artifact trove; the seed is rare, so treat Year 1 Ancient Fruit as a bonus.',w:'Fishing chests drop the artifact about 1 time in 130 from Fishing 2; artifact troves (Desert Trader, 5 Omni Geodes) about 1 in 27. One packet is enough: the Seed Maker does the rest.',tags:['fish'],p:2}
   ],
   summer:[
    {id:'e-anc-su1',t:'If you have a seed, plant it outdoors on Summer 1; it fruits Summer 28 or dies trying.',w:'Ancient Fruit grows Spring, Summer and Fall outdoors. Planted Summer 1 the first fruit comes Summer 28 and the plant survives into Fall.',tags:['farm'],p:1}
   ],
   fall:[
    {id:'e-anc-fa1',t:'Finish the Pantry by Fall 28 so the Greenhouse stands for Winter 1.',w:'Spring, Summer and Fall Crops, Quality Crops, Animal, Artisan: six bundles.',tags:['bundle'],p:1},
    {id:'e-anc-fa2',t:'Seed Maker from the Dye bundle or Farming 9; every fruit becomes 1 to 3 seeds.',c:'Seed Maker: 25 Wood, 10 Coal, 1 Gold Bar',w:'Run the whole outdoor harvest through it before Winter 1.',tags:['craft'],p:1}
   ],
   winter:[
    {id:'e-anc-wi1',t:'Winter 1: plant every Ancient Seed in the greenhouse; fill the rest with Starfruit or cranberries.',c:'Starfruit Seeds: 400g at the Oasis',w:'First Ancient Fruit on Winter 28. Each pick goes through the Seed Maker until the 120 tiles are full, then into kegs.',tags:['farm','money'],p:1}
   ]
  }},
 animals:{name:'Animals',kind:'ranch',from:'Coop 4,000g',price:'Egg 50g, Milk 125g, Cheese 230g, Truffle 625g',
  sum:'Animals are slow money that needs no watering: pet, feed, collect. Chickens first for eggs and the Animal bundle, a cow for milk and cheese, a duck and a goat for the two hard bundle items. Pigs (Deluxe Barn) find truffles at 625g each from Year 2. Rancher (+20% animal products) at Farming 5 if this is your main engine, otherwise Tiller.',
  finish:'A Big Coop and Big Barn full, the silo stocked, and a Deluxe Barn on order for pigs.',
  ladder:[
   {name:'Coop',kind:'Robin',sub:'4,000g, 300 Wood, 100 Stone, 3 days',use:'4 chickens: an egg a day each at 50g (Large Egg 95g)',io:'Chicken 800g → Egg 50g a day',facts:['6 by 3 tiles','Mayonnaise Machine: Egg → Mayonnaise 190g'],link:'Big Coop 10,000g, 400 Wood, 150 Stone: 8 animals, ducks and rabbits'},
   {name:'Barn',kind:'Robin',sub:'6,000g, 350 Wood, 150 Stone, 3 days',use:'4 cows: Milk 125g a day (Large Milk 190g)',io:'Cow 1,500g → Milk 125g a day',facts:['7 by 4 tiles','Cheese Press: Milk → Cheese 230g'],link:'Big Barn 12,000g, 450 Wood, 200 Stone: goats (Goat Milk 225g, Goat Cheese 400g)'},
   {name:'Deluxe Barn',kind:'Robin',sub:'25,000g, 550 Wood, 300 Stone, 3 days',use:'12 animals: pigs and sheep',io:'Pig 16,000g → Truffle 625g most days outside, Winter off',facts:['Oil Maker: Truffle → Truffle Oil 1,065g'],link:'the Year 2 step'},
   {name:'Silo',kind:'Robin',sub:'100g, 100 Stone, 10 Clay, 5 Copper Bar',use:'Holds 240 hay; scythe grass into it all summer',io:'1 hay per animal per day indoors',facts:['3 by 3 tiles','Heater keeps Winter mood up']}
  ],
  numbers:['Chicken 800g, Duck 1,200g, Rabbit 8,000g, Cow 1,500g, Goat 4,000g, Sheep 8,000g, Pig 16,000g.','Products: Egg 50g, Large Egg 95g, Duck Egg 95g, Duck Feather 250g, Wool 340g, Milk 125g, Large Milk 190g, Goat Milk 225g, Large Goat Milk 345g, Truffle 625g, Rabbit’s Foot 565g.','Large products come from hearts and mood: pet daily, keep hay in the bench, let them out on grass on dry days.','Cheese 230g (gold from Large Milk 345g), Goat Cheese 400g, Mayonnaise 190g, Duck Mayonnaise 375g, Cloth 470g, Truffle Oil 1,065g.'],
  avoid:['Animals before the Silo: hay is 50g each at Marnie’s otherwise.','Buying a pig in Year 1: 16,000g plus a 25,000g Deluxe Barn for truffles that stop in Winter.'],
  seasons:{
   spring:[
    {id:'e-ani-sp1',t:'Coop by Spring 20; a white and a brown chicken.',c:'Coop: 4,000g, 300 Wood, 100 Stone; Chicken: 800g each',w:'Eggs from the fourth day. One of each colour covers Large Egg and Large Brown Egg for the Animal bundle.',tags:['animals','bundle'],p:1},
    {id:'e-ani-sp2',t:'Farming 2: a Mayonnaise Machine.',c:'Mayonnaise Machine: 15 Wood, 15 Stone, 1 Earth Crystal, 1 Copper Bar',w:'Egg 50g becomes Mayonnaise 190g in 3 hours.',tags:['craft','money'],p:1}
   ],
   summer:[
    {id:'e-ani-su1',t:'Silo, then Barn, then a cow.',c:'Silo: 100g, 100 Stone, 10 Clay, 5 Copper Bar; Barn: 6,000g, 350 Wood, 150 Stone; Cow: 1,500g',w:'Milk every day at 125g; Large Milk for the bundle once she loves you.',tags:['animals','money'],p:1},
    {id:'e-ani-su2',t:'Big Coop and a Duck when the blueberries pay.',c:'Big Coop: 10,000g, 400 Wood, 150 Stone; Duck: 1,200g',w:'Duck Egg (Animal bundle) every other day; Duck Feather (Dye bundle) now and then at high hearts.',tags:['animals','bundle'],p:1},
    {id:'e-ani-su3',t:'Farming 6: Cheese Press.',c:'Cheese Press: 45 Wood, 45 Stone, 10 Hardwood, 1 Copper Bar',w:'Cheese 230g from 125g Milk in 3 hours; Cheese is an Artisan bundle item and the best mine food.',tags:['craft','money'],p:1}
   ],
   fall:[
    {id:'e-ani-fa1',t:'Big Barn and a Goat.',c:'Big Barn: 12,000g, 450 Wood, 200 Stone; Goat: 4,000g',w:'Goat Milk 225g every other day; Large Goat Milk is the last Animal bundle item, Goat Cheese 400g is an Artisan one.',tags:['animals','bundle'],p:1},
    {id:'e-ani-fa2',t:'Fall 28: every patch of grass into the silo.',w:'240 hay is 8 animals for a month. Marnie sells hay at 50g if it runs out.',tags:['animals','deadline'],p:1}
   ],
   winter:[
    {id:'e-ani-wi1',t:'Deluxe Barn on order for Year 2 pigs if the money allows; otherwise a second cow and goat.',c:'Deluxe Barn: 25,000g, 550 Wood, 300 Stone; Pig: 16,000g',w:'Pigs dig truffles on every dry day outside Winter, 625g each raw, 1,065g as Truffle Oil.',tags:['animals','money'],p:1}
   ]
  }},
 starfruit:{name:'Starfruit',kind:'desert',from:'Bus (Vault)',price:'Fruit 750g, Wine 2,250g (3,150g Artisan)',
  sum:'Starfruit seeds cost 400g at the Oasis in the Desert, so this engine starts the day the bus runs. Outdoors it is a Summer crop (13 days, no regrow, 750g); in the greenhouse it grows any season. A Starfruit in a keg is 2,250g of wine, the best per-keg product in the game. The whole engine is money in, more money out, and it scales with how many kegs you own.',
  finish:'Starfruit wine in every keg and a greenhouse rotation of starfruit and ancient fruit.',
  ladder:[
   {name:'Vault',kind:'Community Center',sub:'2,500g + 5,000g + 10,000g + 25,000g',use:'Pays for the bus; the Desert opens the next day',io:'42,500g → bus',facts:['bus ticket 500g','Pam drives 10am to 5pm'],link:'the Oasis is the shop in the Desert'},
   {name:'Starfruit Seeds',kind:'Oasis',sub:'400g each, any day',use:'Summer outdoors or any season in the greenhouse',io:'400g seed → 750g fruit (13 days, no regrow)',facts:['Speed-Gro: about 11 days','Deluxe Speed-Gro (Oasis, Thursdays 80g): about 10 days'],link:'raw it is +350g; in a keg it is +1,850g'},
   {name:'Keg',kind:'Farming 8',sub:'30 Wood, 1 Copper Bar, 1 Iron Bar, 1 Oak Resin',use:'Starfruit → Starfruit Wine in about 6 days',io:'750g → 2,250g (3,150g Artisan)',facts:['one keg turns 4 fruit a season'],link:'kegs are the bottleneck, not seeds'},
   {name:'Cask',kind:'Cellar (house upgrade 2)',sub:'20 Wood, 1 Hardwood; Year 2',use:'Ages wine to iridium: double price',io:'Starfruit Wine 2,250g → 4,500g in 56 days',facts:['cellar holds 125 casks']}
  ],
  numbers:['Starfruit: 400g seed, 13 days, 750g, no regrow. Tiller 825g.','Wine 2,250g, 3,150g with Artisan, about 6 days a keg. Iridium (cask, 56 days) 4,500g.','Bus fare 500g a trip, return included; Pam drives 10am to 5pm. A Warp Totem: Desert (3 Omni Geodes at the Desert Trader) skips the bus.','Deluxe Speed-Gro from the Oasis (80g on Thursdays) cuts growth by a quarter: plant by Summer 15 outdoors.'],
  avoid:['Planting Starfruit outdoors after Summer 15: it dies on Fall 1 unharvested.','Selling Starfruit raw when a keg is empty.'],
  seasons:{
   spring:[
    {id:'e-sta-sp1',t:'Every spare gold toward the Vault: it is the bus, and the bus is the Oasis.',w:'42,500g in four payments. The berries and the fish pay it by the end of Summer.',tags:['money'],p:0}
   ],
   summer:[
    {id:'e-sta-su1',t:'If the bus runs by Summer 14: Starfruit Seeds and Deluxe Speed-Gro from the Oasis, planted the same day.',c:'Starfruit Seeds: 400g each; Deluxe Speed-Gro: 80g each on Thursdays',w:'About 10 days with Deluxe Speed-Gro: planted Summer 14 they are in by Summer 25. Later than Summer 15 and Fall 1 kills them.',tags:['farm','money','deadline'],p:1,risk:'plant by Summer 15'}
   ],
   fall:[
    {id:'e-sta-fa1',t:'Kegs: every Starfruit into a keg, none to the bin.',w:'About 6 days to 2,250g. The Artisan profession makes it 3,150g.',tags:['money'],p:1}
   ],
   winter:[
    {id:'e-sta-wi1',t:'Winter 1: Starfruit in the greenhouse tiles that Ancient Fruit does not fill.',c:'Starfruit Seeds: 400g each',w:'13 days indoors in any season; two harvests before Spring. The Desert Trader takes 3 Omni Geodes for a Warp Totem: Desert to skip the bus.',tags:['farm','money'],p:1}
   ]
  }},
 fishing:{name:'Fishing money',kind:'water',from:'Spring 2',price:'Sturgeon 200g, Catfish 200g, Pufferfish 200g',
  sum:'The fisher’s side of the economy: 1,000g to 2,000g a day from week one at base prices, more with Fisher (+25%) and Angler (+50%). The rod ladder is short (Bamboo, Fiberglass 1,800g, Iridium 7,500g) and the fish get pricier each season. From 1.6 the Fish Smoker doubles any fish’s price for one piece of coal.',
  finish:'Iridium Rod, Angler, a Fish Smoker running, and crab pots along the beach.',
  ladder:[
   {name:'Bamboo Pole',kind:'Spring 2',sub:'free from Willy',use:'Sunfish, Bream, Largemouth Bass, Chub: 30g to 100g each',io:'a Spring day → about 1,000g',facts:['no bait, no tackle'],link:'Fishing 2 in three or four days'},
   {name:'Fiberglass Rod',kind:'Fishing 2',sub:'1,800g',use:'Takes bait: bites twice as fast',io:'a Spring day → about 2,000g',facts:['Bait 5g or 1 Bug Meat makes 5'],link:'Fishing 6 in roughly a month of full days'},
   {name:'Iridium Rod',kind:'Fishing 6',sub:'7,500g',use:'Bait and one tackle; Trap Bobber for the hard bundle fish',io:'Summer day → 2,500g to 4,000g (Sturgeon, Pufferfish, Tuna)',facts:['Trap Bobber 500g','Cork Bobber 750g'],link:'Fisher at 5 (+25%), Angler at 10 (+50%)'},
   {name:'Fish Smoker',kind:'1.6',sub:'recipe 10,000g at Willy’s; 10 Hardwood, 1 Sea Jelly, 1 River Jelly, 1 Cave Jelly',use:'Any fish in, Smoked Fish out at double price, one coal each',io:'Sturgeon 200g → Smoked 400g',facts:['keeps quality','50 minutes a fish'],link:'crab pots on the side: 47g to 50g a pot a day'}
  ],
  numbers:['Sell prices: Sturgeon, Catfish, Pufferfish 200g; Tiger Trout 150g; Largemouth Bass, Tuna 100g; Walleye 105g; Eel 85g; Bullhead, Tilapia 75g.','Fisher +25% at level 5, Angler +50% at level 10, on every fish sold.','Fish Smoker: recipe 10,000g from Willy; smoked fish sells for double the fish, quality kept.','Crab pot income: about 47g a day fresh water, 50g ocean, per pot, minus 5g bait.'],
  avoid:['Fishing on a rainy Fall day anywhere but where the Walleye is.','Selling the second Sturgeon before the Lake bundle is in.'],
  seasons:{
   spring:[
    {id:'e-fis-sp1',t:'Spring 2 to 5: fish from 6am to dark every day; the 1,800g rod is the first buy.',c:'Fiberglass Rod: 1,800g',w:'Level 2 arrives after three or four full days. Bait doubles the catch rate from then on.',tags:['fish','money'],p:2},
    {id:'e-fis-sp2',t:'Fishing 5: take Fisher (+25% on every fish sold).',w:'Trapper only makes crab pots cheaper; the bundle pots come free from the Crab Pot bundle.',tags:['fish','money'],p:2}
   ],
   summer:[
    {id:'e-fis-su1',t:'Iridium Rod and Trap Bobber the day Fishing 6 lands.',c:'Iridium Rod: 7,500g; Trap Bobber: 500g',w:'Sturgeon, Pufferfish and Tuna are the money fish of Summer and all three are hard without the bobber.',tags:['fish','money'],p:2},
    {id:'e-fis-su2',t:'Three Crab Pots (bundle reward) in the ocean by the pier; bait them each morning.',c:'Bait: 5g each',w:'Lobster 120g and Crab 100g pay the bait many times over. Willy sells more pots at 1,500g; the recipe is Fishing 3.',tags:['fish','money'],p:2}
   ],
   fall:[
    {id:'e-fis-fa1',t:'Fish Smoker once 10,000g is spare: every 200g fish becomes 400g.',c:'Fish Smoker recipe: 10,000g; Fish Smoker: 10 Hardwood, 1 Sea Jelly, 1 River Jelly, 1 Cave Jelly',w:'Jellies come up on the line at the beach, the river and in the mines. One coal per fish.',tags:['craft','money'],p:2}
   ],
   winter:[
    {id:'e-fis-wi1',t:'Winter is Sturgeon and Tuna season again: lake and beach, 6am to 7pm, smoke everything.',w:'400g a Sturgeon smoked; the mines are slower money by now than the water.',tags:['fish','money'],p:2}
   ]
  }}
};
