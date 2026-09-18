/* Farmhand's Route - legend (reference tables). Source: Stardew Valley Wiki (stardewvalleywiki.com), raw wikitext
   via the MediaWiki API, checked 2026-09-18 against the 1.6 History sections. Prices are base sell prices. */
'use strict';

var LEGEND = [
{id:'fish',title:'Fish for the bundles',blocks:[
 {h:'Every bundle fish: season, hours, weather, where, difficulty',p:'All 19 standard-bundle rod fish plus the four remixed extras. Hours are game time; "rain" means the fish only bites in rain or storm. Difficulty runs 15 (Carp) to 95 (Octopus); each Fishing level adds 8 pixels to the bar, a Trap Bobber slows the drain by a third. Docks and piers count as land: cast where the bobber lands 3 or more tiles out for Sturgeon and Woodskip.',table:{cols:['Fish','Bundle','Season','Hours','Weather','Where','Difficulty','Sells'],num:[6,7],rows:[
  ['Sunfish','River Fish','Spring, Summer','6am-7pm','sun or wind','Town or Forest river','30 mixed','30g'],
  ['Catfish','River Fish','Spring, Fall','6am-midnight','rain','Town or Forest river; Secret Woods pond','75 mixed','200g'],
  ['Shad','River Fish','Spring, Summer, Fall','9am-2am','rain','Town or Forest river','45 smooth','60g'],
  ['Tiger Trout','River Fish','Fall, Winter','6am-7pm','any','Town or Forest river','60 dart','150g'],
  ['Largemouth Bass','Lake Fish','all','6am-7pm','any','Mountain Lake, cast far','50 mixed','100g'],
  ['Carp','Lake Fish','Spring, Summer, Fall','any','any','Mountain Lake; Secret Woods pond all year','15 mixed','30g'],
  ['Bullhead','Lake Fish','all','any','any','Mountain Lake','46 smooth','75g'],
  ['Sturgeon','Lake Fish','Summer, Winter','6am-7pm','any; commonest in Summer rain','Mountain Lake, 3+ tiles out','78 mixed','200g'],
  ['Sardine','Ocean Fish','Spring, Fall, Winter','6am-7pm','any','Beach','30 dart','40g'],
  ['Tuna','Ocean Fish','Summer, Winter','6am-7pm','any','Beach','70 smooth','100g'],
  ['Red Snapper','Ocean Fish','Summer, Fall','6am-7pm','rain','Beach','40 mixed','50g'],
  ['Tilapia','Ocean Fish','Summer, Fall','6am-2pm','any','Beach','50 mixed','75g'],
  ['Walleye','Night Fishing','Fall only','noon-2am','rain','Cindersap Forest pond (32% per cast); river; lake','45 smooth','105g'],
  ['Bream','Night Fishing','all','6pm-2am','any','Town or Forest river','35 smooth','45g'],
  ['Eel','Night Fishing','Spring, Fall','4pm-2am','rain','Beach','70 smooth','85g'],
  ['Pufferfish','Specialty Fish','Summer only','noon-4pm','sun','Beach','80 floater','200g'],
  ['Ghostfish','Specialty Fish','all','any','any','Mines, the ponds on floors 20 and 60','50 mixed','45g'],
  ['Sandfish','Specialty Fish','all','6am-8pm','any','Desert pond (needs the bus)','65 mixed','75g'],
  ['Woodskip','Specialty Fish','all','any','any','Secret Woods pond (needs the Steel Axe), 3+ tiles out','50 mixed','75g'],
  ['Lava Eel','Master Fisher’s (remixed)','all','any','any','Mines floor 100 lava pool; about 1 bite in 20','90 mixed','700g'],
  ['Scorpion Carp','Master Fisher’s (remixed)','all','6am-8pm','any','Desert pond; needs Fishing 4','90 dart','150g'],
  ['Octopus','Master Fisher’s (remixed)','Summer; Night Market','6am-1pm','any','Beach; Night Market submarine (2%)','95 sinker','150g'],
  ['Blobfish','Master Fisher’s (remixed)','Winter 15-17','5pm-2am','any','Night Market submarine, 1,000g a ride, 10% per catch','75 floater','500g']
 ]},notes:['Rain-only: Catfish, Shad, Eel, Red Snapper, Walleye. Night-only: Bream, Eel, Walleye. Sun-only: Pufferfish.','Fixed weather: Spring 3 of Year 1 always rains; Summer 13 and Summer 26 always storm; Spring 1, 2, 4, 5 and the first day of every other season are sunny; it never rains in Winter.','Quality Fish (remixed) needs gold Largemouth Bass, Shad, Tuna and Walleye: cast 5 tiles from land at Fishing 6 or better, or land a perfect catch on a silver one.']},
 {h:'Crab Pot bundle: 5 of 10, no pot needed',p:'Clam, Cockle, Mussel and Oyster wash up on the beach as forage, and Rock Crabs on Mines floors 1-29 drop a Crab 15% of the time. That is five items and the bundle is done; the reward is 3 Crab Pots.',table:{cols:['Item','Water','Chance per pot','Sells','Other source'],num:[2,3],rows:[
  ['Lobster','ocean','4%','120g','Traveling Cart'],
  ['Clam','ocean','9%','50g','beach forage'],
  ['Crab','ocean','8%','100g','Rock Crab drop 15%, Lava Crab 25%'],
  ['Cockle','ocean','12%','50g','beach forage'],
  ['Mussel','ocean','10%','30g','beach forage'],
  ['Shrimp','ocean','10%','60g',''],
  ['Oyster','ocean','10%','40g','beach forage'],
  ['Crayfish','fresh','21%','75g',''],
  ['Snail','fresh','20%','65g',''],
  ['Periwinkle','fresh','22%','20g','']
 ]},notes:['Crab Pot: Fishing 3 recipe, 40 Wood + 3 Iron Bars, or 1,500g at Willy’s. Bait every pot daily (Willy 5g) unless Luremaster. 38% of harvests are trash without Mariner.']},
 {h:'Rods, bait, tackle',table:{cols:['Gear','Cost','Needs','What it does'],num:[1],rows:[
  ['Bamboo Pole','free (Willy’s letter, Spring 2)','','No bait, no tackle'],
  ['Training Rod','25g','','Bar as if level 5, only fish under difficulty 50, always normal quality'],
  ['Fiberglass Rod','1,800g','Fishing 2','Takes bait: bites twice as fast'],
  ['Iridium Rod','7,500g','Fishing 6','Bait plus one tackle'],
  ['Bait','5g each, or 1 Bug Meat makes 5','Fishing 2','50% faster bites; also feeds crab pots'],
  ['Deluxe Bait','100g, or 5 Bait + 2 Moss','Fishing 4','67% faster bites and a bigger bar; 30 come from the River Fish bundle'],
  ['Trap Bobber','500g, or 1 Copper Bar + 10 Sap','Fishing 6','Progress drains a third slower: the bundle-fish tackle'],
  ['Cork Bobber','750g','Fishing 7','Bigger bar'],
  ['Sonar Bobber','500g','Fishing 6','Shows which fish is hooked, so you can let trash go'],
  ['Dish O’ The Sea','Lake bundle recipe, 2 Sardine + Hashbrowns','Fishing 3','+3 Fishing for 5 minutes: eat it for Sturgeon and Pufferfish']
 ]},notes:['Fishing XP per fish = (quality + 1) x 3 + difficulty / 3, times 2.4 for a perfect catch. Level 6 (3,300 XP) is about 250 plain Sardines or a few weeks of a dedicated fisher.','Profession for the fisher: Fisher at 5 (+25% fish price), Angler at 10 (+50%). Swapping later costs 10,000g in the Sewers.']}
]},
{id:'crops',title:'Crops',blocks:[
 {h:'Spring',p:'Seed at Pierre’s unless noted; JojaMart is about 25% dearer but opens Wednesdays. Days is time to the first harvest; regrow is the gap after that. Profit per day is the wiki’s seed-inclusive figure per tile at base quality.',table:{cols:['Crop','Seed','Days','Regrow','Sells','Profit a day','Note'],num:[1,2,3,4,5],rows:[
  ['Potato','50g','6','','80g','8.3','25% chance of a second potato; the Spring 1 money crop; Spring Crops bundle'],
  ['Cauliflower','80g','12','','175g','7.9','Spring Crops bundle; plant by Spring 16'],
  ['Green Bean','60g','10','3','40g','7.2','Trellis; Spring Crops bundle'],
  ['Kale','70g','6','','110g','6.7','Scythe to harvest; the filler after Spring 13'],
  ['Strawberry','100g, Egg Festival only','8','4','120g','11.7','Two picks from a Spring 13 planting, three with Speed-Gro'],
  ['Parsnip','20g','4','','35g','3.8','15 free; Spring Crops bundle; 5 gold for Quality Crops'],
  ['Garlic','40g, Year 2','4','','60g','5.0','Pierre sells the seeds from Year 2'],
  ['Rhubarb','100g, Oasis','13','','220g','9.2','Needs the bus'],
  ['Blue Jazz','30g','7','','50g','2.9','Flower; Blue Jazz Honey 200g'],
  ['Tulip','20g','6','','30g','1.7','Flower; Evelyn loves it'],
  ['Coffee Bean','cart, 100g to 2,500g','10','2','15g','','Four beans every 2 days through Summer; 5 beans make Coffee 150g and +1 speed']
 ]}},
 {h:'Summer',table:{cols:['Crop','Seed','Days','Regrow','Sells','Profit a day','Note'],num:[1,2,3,4,5],rows:[
  ['Blueberry','80g, Pierre only','13','4','50g x3','20.8','The Year 1 engine; four picks from Summer 1 to 3; Summer Crops bundle'],
  ['Melon','80g','12','','250g','14.2','Summer Crops bundle; 5 gold for Quality Crops; Melon Wine 750g'],
  ['Hops','60g','11','1','25g','13.5','Trellis; one a day from Summer 12; Pale Ale 300g in a keg'],
  ['Hot Pepper','40g','5','3','40g','10.8','Summer Crops bundle'],
  ['Tomato','50g','11','4','60g','9.3','Summer Crops bundle; pickles 170g beat juice'],
  ['Radish','40g','6','','90g','8.3','Filler'],
  ['Poppy','100g','7','','140g','5.7','Chef’s bundle; Poppy Honey 380g'],
  ['Summer Spangle','50g','8','','90g','5.0','Flower; Caroline loves it'],
  ['Wheat','10g','4','','25g','3.8','Summer and Fall; 10 for the Fodder bundle; Beer 200g; drops hay'],
  ['Corn','150g','14','4','50g','1.9 (7.4 over both seasons)','Lives into Fall; Fall Crops bundle; gold x5 is a Quality Crops option'],
  ['Sunflower','200g (JojaMart 125g)','8','','80g','loses money','Dye bundle; gives seeds back; Sunflower Honey 260g'],
  ['Red Cabbage','100g, Year 2 (cart in Year 1)','9','','260g','17.8','Dye bundle; grows in the greenhouse any season'],
  ['Starfruit','400g, Oasis','13','','750g','26.9','Needs the bus; plant by Summer 15; Starfruit Wine 2,250g']
 ]}},
 {h:'Fall',table:{cols:['Crop','Seed','Days','Regrow','Sells','Profit a day','Note'],num:[1,2,3,4,5],rows:[
  ['Cranberries','240g','7','5','75g x2','18.9','Five picks from Fall 1; jelly 200g, wine 225g'],
  ['Pumpkin','100g','13','','320g','16.9','Fall Crops bundle; 5 gold for Quality Crops; Pumpkin Juice 720g; plant by Fall 15'],
  ['Grape','60g','10','3','80g','16.8','Trellis; counts for the Summer Foraging bundle; Raisins 600g per 5'],
  ['Artichoke','30g, Year 2','8','','160g','16.3','Pierre sells the seeds from Year 2'],
  ['Amaranth','70g','7','','150g','11.4','Scythe to harvest; a remixed Dye option'],
  ['Eggplant','20g','5','5','60g','11.2','Fall Crops bundle'],
  ['Yam','60g','10','','160g','10.0','Fall Crops bundle'],
  ['Bok Choy','50g','4','','80g','7.5','Filler'],
  ['Fairy Rose','200g','12','','290g','7.5','Fairy Rose Honey 680g, the best honey'],
  ['Beet','20g, Oasis','6','','100g','13.3','Needs the bus; sugar at the Mill'],
  ['Sweet Gem Berry','Rare Seed 1,000g, cart','24','','3,000g','83.3','Plant by Fall 4; the first one to Old Master Cannoli in the Secret Woods is a Stardrop for every player']
 ]}},
 {h:'Winter, greenhouse and the 1.6 crops',table:{cols:['Crop','Seed','Days','Regrow','Sells','Note'],num:[1,2,3,4],rows:[
  ['Powdermelon','never sold: Seed Spots Fall 21 to Winter 20, the raccoon','7','','60g','The only outdoor Winter crop (1.6)'],
  ['Ancient Fruit','never sold: Gunther for the artifact, Seed Maker','28','7','550g','Greenhouse king; wine 1,650g; the cart stopped selling seeds in 1.6.3'],
  ['Cactus Fruit','150g, Oasis','12','3','75g','Greenhouse or pot only; Exotic Foraging item'],
  ['Carrot','never sold: Seed Spots Winter 21 to Spring 23','3','','35g','1.6 Spring crop; a remixed Spring Crops option'],
  ['Summer Squash','never sold: Seed Spots Spring 24 to Summer 20','6','3','45g','1.6 Summer crop; a remixed Summer Crops option'],
  ['Broccoli','never sold: Seed Spots Summer 21 to Fall 20','8','4','70g','1.6 Fall crop; a remixed Fall Crops option'],
  ['Tea Leaves','Tea Sapling: Caroline 2 hearts, or the cart','20','1','50g','Bush; leaves daily in the last week of each season; Green Tea 100g']
 ]},notes:['Quality prices: silver 1.25x, gold 1.5x, iridium 2x. Tiller adds 10% to crops (not Coffee Beans or Sweet Gem Berries).','Every season starts on a Monday; every crop of a season dies the night of the 28th. Corn, Wheat and Sunflowers live from Summer into Fall.','Wild Seeds (the bundle rewards) grow the season’s forage in 7 days and crows leave them alone.']}
]},
{id:'artisan',title:'Artisan maths',blocks:[
 {h:'What each machine makes',p:'Keg: fruit becomes Wine at three times its price in about 6 days; vegetables become Juice at 2.25 times in 4 days; Hops make Pale Ale 300g in a day and a half. Preserves Jar: anything becomes Jelly or Pickles at twice its price plus 50g in 2 to 3 days. Input quality never changes the output, so jar the plain crops and sell the gold ones raw.',table:{cols:['Crop','Raw','Keg (with Artisan)','Jar (with Artisan)','Verdict'],num:[1,2,3],rows:[
  ['Blueberry 50g','50g','Wine 150g (210g), 6 days','Jelly 150g (210g), 3 days','Jar: same money in half the time'],
  ['Cranberries 75g','75g','Wine 225g (315g)','Jelly 200g (280g)','Jar unless the kegs are idle'],
  ['Strawberry 120g','120g','Wine 360g (504g)','Jelly 290g (406g)','Either; keep some for seeds'],
  ['Melon 250g','250g','Wine 750g (1,050g)','Jelly 550g (770g)','Keg'],
  ['Pumpkin 320g','320g','Juice 720g (1,008g), 4 days','Pickles 690g (966g)','Keg'],
  ['Hops 25g','25g','Pale Ale 300g (420g), 1.5 days','Pickles 100g','Keg, always'],
  ['Wheat 25g','25g','Beer 200g (280g), 1 day','Pickles 100g','Keg'],
  ['Starfruit 750g','750g','Wine 2,250g (3,150g)','Jelly 1,550g (2,170g)','Keg'],
  ['Ancient Fruit 550g','550g','Wine 1,650g (2,310g)','Jelly 1,150g (1,610g)','Keg'],
  ['Tomato 60g','60g','Juice 135g','Pickles 170g','Jar'],
  ['Cauliflower 175g','175g','Juice 393g','Pickles 400g','Jar']
 ]},notes:['Per machine-day the jar beats the keg for everything except Hops, Wheat and Tea Leaves; per item the keg wins above 50g fruit or 200g vegetables.','Artisan (Farming 10, from Tiller) adds 40% to everything a keg, jar, press or loom makes. Oil and Coffee do not get it.','Cheese 230g (gold from Large Milk 345g), Goat Cheese 400g, Mayonnaise 190g, Duck Mayonnaise 375g, Cloth 470g, Truffle Oil 1,065g, Honey 100g plus the flower.','Smoked Fish (Fish Smoker, 1.6) is double the fish, quality kept, one coal each. Dried Fruit (Dehydrator, 1.6) is 7.5 times the fruit plus 25g per five.','Casks (cellar, house upgrade 3) age wine to iridium at double price in 56 days: Year 2.']}
]},
{id:'animals',title:'Animals',blocks:[
 {h:'Buildings and beasts',p:'Robin builds a Coop or Barn in 3 days, upgrades in 2. Marnie sells the animals (closed Mondays and Tuesdays). Every animal eats one hay a day indoors; on grass outside they feed themselves. Large products come from hearts and mood: pet daily, keep the bench full, let them out on dry days.',table:{cols:['Animal','Price','Lives in','Product','Sells','Large or extra','Notes'],num:[1,4],rows:[
  ['Chicken','800g','Coop (4,000g, 300 Wood, 100 Stone)','Egg daily','50g','Large Egg 95g at high hearts','White or brown at random; the Animal bundle wants one of each'],
  ['Duck','1,200g','Big Coop (10,000g, 400 Wood, 150 Stone)','Duck Egg every 2 days','95g','Duck Feather 250g now and then','Feather for the Dye bundle'],
  ['Rabbit','8,000g','Deluxe Coop (20,000g, 500 Wood, 200 Stone)','Wool every 4 days','340g','Rabbit’s Foot 565g now and then','Year 2; the cart sells the foot'],
  ['Cow','1,500g','Barn (6,000g, 350 Wood, 150 Stone)','Milk daily','125g','Large Milk 190g','Cheese 230g in the press'],
  ['Goat','4,000g','Big Barn (12,000g, 450 Wood, 200 Stone)','Goat Milk every 2 days','225g','Large Goat Milk 345g','Goat Cheese 400g'],
  ['Sheep','8,000g','Deluxe Barn (25,000g, 550 Wood, 300 Stone)','Wool every 3 days','340g','','Needs Shears 1,000g'],
  ['Pig','16,000g','Deluxe Barn','Truffle on dry days outside, not Winter','625g','','Truffle Oil 1,065g; the Year 2 engine']
 ]},notes:['Silo: 100g, 100 Stone, 10 Clay, 5 Copper Bar. Holds 240 hay; scythe grass into it before Winter. Hay is 50g each at Marnie’s otherwise.','A Heater (2,000g, or the Fodder bundle) keeps Winter mood up. Grass survives Winter dormant since 1.6, but animals stay in and eat hay.','Rancher (Farming 5) adds 20% to animal products. Coopmaster and Shepherd (Farming 10) befriend faster and raise product quality.','The fruit-bat cave (Demetrius, after 25,000g earned) drops about one tree fruit or berry a night: Apple, Pomegranate, Cherry, Orange, Peach, Apricot, Spice Berry, Wild Plum, Blackberry. It covers the Artisan fruit for free.']}
]},
{id:'gifts',title:'Gifts and birthdays',blocks:[
 {h:'Birthdays worth a gift in Year 1',p:'Nobody’s hearts are needed for the Community Center; the Bulletin Board reward gives two hearts with everyone. These twelve pay back in recipes, mail or luck food. A birthday gift counts eight times.',table:{cols:['Villager','Birthday','Cheap loved gift','Why bother'],rows:[
  ['Linus','Winter 3','Yam (keep one from Fall); Blueberry Tart','3 hearts: Sashimi recipe (any fish to 75g). 4 hearts: Wild Bait from his tent scene'],
  ['George','Fall 24','Leek (keep one from Spring)','3 hearts: Fried Eel, the cheapest +1 luck food'],
  ['Caroline','Winter 7','Summer Spangle (keep one)','2 hearts: walk into her sunroom for the Tea Sapling recipe'],
  ['Robin','Fall 21','Spaghetti (Saloon 240g)','Any hearts: she mails 50 Wood now and then. 7: Pumpkin Soup, +2 luck'],
  ['Emily','Spring 27','Topaz or Amethyst from the mines','3 hearts: Salad recipe, the cheap energy food'],
  ['Willy','Summer 24','Sturgeon or Octopus','Recipes only; his shop needs no hearts'],
  ['Pam','Spring 18','Parsnip','Summer 14 quest: a Pale Ale for 350g and a heart. The bus needs no hearts'],
  ['Marnie','Fall 18','Farmer’s Lunch (Farming 3)','Her shop is shut on her birthday; find her in the house'],
  ['Clint','Winter 26','Omni Geode or any gem','Any hearts: he mails bars now and then'],
  ['Pierre','Spring 26','Daffodil or Dandelion (liked)','3 hearts: Blueberry Tart, a Linus love'],
  ['Gus','Summer 8','Any cooked dish (liked); Orange','Low priority'],
  ['Evelyn','Winter 20','Tulip (keep one from Spring)','4 hearts: Cookies, a remixed Children’s bundle item']
 ]},notes:['Universal loves: Prismatic Shard, Rabbit’s Foot (bundle item, keep it), Golden Pumpkin, Pearl. Universal likes: most fruit, most cooked dishes, Daffodil, Dandelion, Leek... except the ones each page lists as hated.','Free daily likes: Daffodil, Dandelion, Leek, Spring Onion, eggs, milk, every fruit, for almost everyone.','Two gifts a week per villager, one on a birthday counts eight times. No gifting during Green Rain in Year 1.']}
]},
{id:'energy',title:'Energy and luck',blocks:[
 {h:'Energy',table:{cols:['Thing','Number','Note'],num:[1],rows:[
  ['Base energy','270','Each Stardrop adds 34 for good'],
  ['Stardrops in Year 1','2','Mines floor 100 chest (once per player); the Fair for 2,000 star tokens'],
  ['Sweet Gem Berry Stardrop','1','Old Master Cannoli in the Secret Woods; a Rare Seed (1,000g at the cart) grown in Fall; counts for every player in co-op'],
  ['Passing out at 2am','-10% gold, max 1,000g','Go to bed by 1:40am; in co-op the night ends when everyone is in bed'],
  ['Zero health','up to 15,000g and random items','Weapons and rods do not come back'],
  ['Sleep','full energy','Less if you sleep after midnight'],
  ['Salmonberry','25 energy','Bushes Spring 15 to 18, free by the hundred'],
  ['Field Snack','45','Foraging 1: Acorn, Maple Seed, Pine Cone'],
  ['Cheese','125','Cheese Press, or the Desert Trader for an Emerald'],
  ['Spring Onion','13','South of Cindersap Forest in Spring'],
  ['Watering','2 per tile at Farming 0','Each Farming level makes the can cheaper; sprinklers make it free']
 ]}},
 {h:'Luck',p:'Daily luck runs from -0.1 to +0.1. The TV Fortune Teller tells you each morning. In co-op the game averages both players’ luck. Luck moves mine ladders, geode and coal drops, gem nodes, fishing treasure, Duck Feathers and Rabbit’s Feet, the Fair wheel; it does not change which fish bite.',table:{cols:['TV says','Luck','Do'],rows:[
  ['The spirits are very happy today!','+0.1','Mine dive: ladders, gems, coal; Skull Cavern once the bus runs'],
  ['The spirits are in good humor today.','+0.07 to +0.1','Mine, crack geodes, fish for treasure'],
  ['The spirits feel neutral today.','+0.02 to +0.07','A normal day'],
  ['Neutral (swirling lights).','-0.02 to +0.02','A normal day'],
  ['The spirits are somewhat annoyed today.','-0.07 to -0.02','Farm, fish for species, shop, hand in bundles'],
  ['The spirits are very displeased today.','below -0.07','Farm, build, do not go deep']
 ]},notes:['Luck food in Year 1: Fried Eel +1 (George 3 hearts: Eel + Oil), Cave Jelly +1 (fish it up on mine floors 20, 60, 100), Pumpkin Soup +2 (Robin 7 hearts). Lucky Lunch airs on TV in Year 2.','Eat the luck food before entering the Fair; you cannot eat inside a festival.']}
]},
{id:'calendar',title:'The calendar',blocks:[
 {h:'Festivals',p:'A locked festival costs the whole day: shops shut, time stops, you are home at 10pm. Both players must enter the festival area to start it (the Night Market is the one exception). Every festival day is sunny.',table:{cols:['Festival','When','Where','What matters','Day lost?'],rows:[
  ['Egg Festival','Spring 13, enter 9am to 2pm','Town square','Strawberry Seeds 100g at Pierre’s stall; the hunt needs 6 eggs with two players','yes'],
  ['Desert Festival','Spring 15 to 17, 10am to 2am','Desert','Needs the bus; Year 2 for this route. The cart is there too','no'],
  ['Flower Dance','Spring 24, 9am to 2pm','Cindersap Forest, far west','Daffodil and Dandelion x10 for 50g; a partner needs 4 hearts','yes'],
  ['Luau','Summer 11, 9am to 2pm','Beach','One uncooked item each in the soup; a gold Cauliflower is a Best','yes'],
  ['Trout Derby','Summer 20 to 21, all day','Forest river by Marnie’s','Rainbow Trout all day; tags buy a Crab Pot and Deluxe Bait','no'],
  ['Moonlight Jellies','Summer 28, 10pm to midnight','Beach','Watch; normal day until 10pm','no'],
  ['Stardew Valley Fair','Fall 16, 9am to 3pm','Town','Nine items in the grange display (gold quality, several categories); 90+ points = 1,000 tokens; Stardrop 2,000 tokens','yes'],
  ['Spirit’s Eve','Fall 27, 10pm to midnight','Town','Maze: the passage under and left of the ? sign leads to a Golden Pumpkin (2,500g)','shops shut'],
  ['Festival of Ice','Winter 8, 9am to 2pm','Cindersap Forest','Ice fishing: 5 fish wins a Sailor’s Cap and tackle','yes'],
  ['SquidFest','Winter 12 to 13, all day','Beach','Squid all day; Deluxe Bait, Dish O’ The Sea, a Pearl for counts','no'],
  ['Night Market','Winter 15 to 17, 5pm to 2am','Beach','The Traveling Cart every night; mermaid shells 1-5-4-2-3 for a Pearl; submarine 1,000g','no'],
  ['Feast of the Winter Star','Winter 25, 9am to 2pm','Town','A gift for the villager named in the Winter 18 letter','yes']
 ]}},
 {h:'Days that are fixed',table:{cols:['Day','What'],rows:[
  ['Spring 1, 2, 4, 5','Sunny (Year 1)'],
  ['Spring 3','Rain (Year 1): the first Catfish, Shad and Eel day'],
  ['Spring 5','Mines open; walk into town 8am to 1pm for the Community Center scene'],
  ['Spring 6','Wizard’s letter; visit the tower, every scroll becomes readable (each player)'],
  ['Spring 15 to 18','Salmonberries on every bush'],
  ['Summer 1, Fall 1, Winter 1','Sunny'],
  ['Summer 3','Earthquake: the Railroad opens'],
  ['Summer 13 and 26','Storm: Red Snapper, Shad, Sturgeon; Lightning Rods out'],
  ['One Summer day (5, 6, 7, 14, 16, 18 or 23)','Green Rain: no gifting in Year 1, weeds everywhere, moss and Fiddlehead-type forage'],
  ['Fall 8 to 11','Blackberries on every bush'],
  ['Winter','Never rains'],
  ['Every Friday and Sunday','Traveling Cart in Cindersap Forest, 6am to 8pm'],
  ['Winter 18','Letter naming your Feast of the Winter Star recipient'],
  ['Spring 1, Year 2','Kent arrives; Pierre sells Garlic, Rice, Red Cabbage and Artichoke seeds']
 ]},notes:['Rain odds: Spring and Fall about one day in five; Summer one in eight rising to one in five by month end, mostly storms; Winter none. Festival days and the first of a season are always sunny.','Weekdays: day 1 of every season is a Monday. Pierre closes Wednesdays until the Center is done; Robin closes Tuesdays; Marnie Mondays and Tuesdays; Willy sells nothing on dry Saturdays; Clint is open every day in Year 1.']}
]},
{id:'shops',title:'Shops and the cart',blocks:[
 {h:'Hours',table:{cols:['Shop','Hours','Closed','Worth knowing'],rows:[
  ['Pierre’s','9am to 5pm','Wednesdays (until the Center is done); locked festivals','Seeds by season; Backpack 2,000g; saplings 2,000g to 6,000g; Rice 200g; Basic Fertilizer and Speed-Gro 100g from Spring 15'],
  ['JojaMart','9am to 11pm','locked festivals','Open Wednesdays; dearer except Sunflower Seeds 125g; no blueberries. Never buy the membership'],
  ['Robin','9am to 5pm','Tuesdays (open if rain); 4pm on Fridays','Wood 10g, Stone 20g in Year 1; building starts the next day'],
  ['Clint','9am to 4pm','locked festivals only, in Year 1','Ore 75g, 150g, 400g; Coal 150g; geodes 25g; upgrades 2 days'],
  ['Marnie','9am to 4pm','Mondays, Tuesdays, Fall 18, Winter 18','Chicken 800g, Duck 1,200g, Cow 1,500g, Goat 4,000g; Hay 50g; Heater 2,000g; Milk Pail and Shears 1,000g'],
  ['Willy','9am to 5pm','dry Saturdays (no sales); locked festivals','Rods, bait 5g, Crab Pot 1,500g, tackle; Fish Smoker recipe 10,000g'],
  ['Gus, the Saloon','noon to midnight','locked festivals','Spaghetti 240g (Robin), Salad 220g, Coffee 300g; recipes: Maki Roll 300g, Omelet 100g'],
  ['Marlon, the Guild','2pm to 2am','until 10 slimes are dead; most festivals','Swords, boots and rings by mine floor reached'],
  ['Sandy, the Oasis','9am to midnight','Desert Festival','Needs the bus (500g a trip, Pam 10am to 5pm); Starfruit Seeds 400g; Deluxe Speed-Gro 80g on Thursdays'],
  ['The Traveling Cart','Fridays and Sundays 6am to 8pm','every other day','Cindersap Forest, north of the pond; also every Night Market night']
 ]}},
 {h:'The cart: what to watch for',p:'Ten random items a visit, at three to five times the shop price (never below 100g, never above 1,000g for ordinary items). Anything can turn up out of season, which is what makes it the Year 1 fix for the hard bundle items. A Rare Seed (1,000g) is there every Spring and Summer visit.',table:{cols:['Item','Cart price','Bundle','The farmed way'],num:[1],rows:[
  ['Red Cabbage Seeds','150g to 1,000g','Dye','Pierre from Year 2 only. The "Guarantee Year 1 Completable" option at farm creation forces one appearance between Spring 7 and Winter 16'],
  ['Truffle','1,875g to 3,125g','Chef’s','A pig in a Deluxe Barn: 41,000g of buildings and beast'],
  ['Rabbit’s Foot','1,695g to 2,825g','Enchanter’s','A rabbit in a Deluxe Coop: 28,000g'],
  ['Duck Feather','750g to 1,250g','Dye','A duck in a Big Coop, now and then at high hearts'],
  ['Wool','1,020g to 1,700g','Animal','Sheep or rabbit, Deluxe buildings'],
  ['Nautilus Shell','360g to 1,000g','Field Research','Winter beach forage, uncommon'],
  ['Apple','300g to 1,000g','Fodder x3, Artisan','Apple tree (4,000g, plant by Summer 1) or the fruit-bat cave'],
  ['Pomegranate','420g to 1,000g','Enchanter’s, Artisan','Pomegranate tree (6,000g) or the bat cave'],
  ['Sturgeon','600g to 1,000g','Lake Fish','Mountain Lake, Summer or Winter'],
  ['Large Milk, Large Egg, Duck Egg','285g to 1,000g','Animal','Hearts and time'],
  ['Cloth, Goat Cheese','1,410g to 2,350g; 1,200g to 2,000g','Artisan','Loom; Big Barn goat'],
  ['Coffee Bean','100g to 1,000g (2,500g special in Fall and Winter)','','Plant in Spring or Summer: 4 beans every 2 days'],
  ['Rare Seed','1,000g, every Spring and Summer visit','remixed Rare Crops','Sweet Gem Berry, 24 days in Fall, 3,000g']
 ]},notes:['Never at the cart: Ancient Seeds (removed in 1.6.3), Aquamarine, Earth Crystal, Frozen Tear, Fire Quartz, Frozen Geode, Hay, any starred item.','About 35 visits in Year 1 counting the Night Market. Keep 10,000g back from Fall for the five Bulletin Board items.']}
]},
{id:'skills',title:'Skills and professions',blocks:[
 {h:'What each level unlocks',p:'Every skill levels on the same ladder: 100, 380, 770, 1,300, 2,150, 3,300, 4,800, 6,900, 10,000, 15,000 XP. The level-up screen only shows at bedtime, but the recipe is yours the moment the XP lands.',table:{cols:['Level','Farming','Mining','Foraging','Fishing','Combat'],rows:[
  ['1','Scarecrow, Basic Fertilizer','Cherry Bomb','Wild Seeds (Sp), Field Snack','+1 cast distance','Sturdy Ring, Bug Steak'],
  ['2','Mayonnaise Machine, Stone Fence, Sprinkler','Staircase','Charcoal Kiln','Bait recipe; Fiberglass Rod and Bait at Willy’s','Life Elixir'],
  ['3','Bee House, Speed-Gro, Farmer’s Lunch','Miner’s Treat','Cookout Kit, Moss Soup','Crab Pot, Dish O’ The Sea; Crab Pot at Willy’s','Roots Platter'],
  ['4','Preserves Jar, Basic Retaining Soil, Iron Fence','Glowstone Ring, Transmute (Fe)','Wild Seeds (Su), Tapper, Mushroom Log','Deluxe Bait, Worm Bin, Recycling Machine, +1 cast','Warrior Ring'],
  ['5','Rancher or Tiller','Miner or Geologist','Forester or Gatherer','Fisher or Trapper','Fighter or Scout'],
  ['6','Cheese Press, Hardwood Fence, Quality Sprinkler','Bomb','Lightning Rod, Wild Seeds (Fa), Warp Totem: Beach','Bait Maker, Spinner, Trap Bobber, Sonar Bobber; Iridium Rod at Willy’s','Slime Egg-Press, Oil of Garlic'],
  ['7','Loom, Quality Retaining Soil','Transmute (Au)','Wild Seeds (Wi), Warp Totem: Mountains, Tree Fertilizer','Cork Bobber, Treasure Hunter','Ring of Yoba, Thorns Ring'],
  ['8','Oil Maker, Keg, Deluxe Speed-Gro','Mega Bomb','Survival Burger, Warp Totem: Farm, Tent Kit','Deluxe Worm Bin, Barbed Hook, Dressed Spinner, +1 cast','Slime Incubator, Explosive Ammo'],
  ['9','Seed Maker, Iridium Sprinkler, Quality Fertilizer','Crystalarium','Rain Totem','Seafoam Pudding, Magnet','Iridium Band, Squid Ink Ravioli'],
  ['10','Coopmaster or Shepherd; Artisan or Agriculturist','Blacksmith or Prospector; Excavator or Gemologist','Lumberjack or Tapper; Botanist or Tracker','Angler or Pirate; Mariner or Luremaster','Brute or Defender; Acrobat or Desperado']
 ]},notes:['Farming XP: harvesting crops (more for pricier crops), 5 per animal petted, milked, sheared or product picked up. Foraging: 7 per item picked, 14 per tree felled. Mining: per rock type (copper node 5, iron 12, gold 18). Fishing: per catch, doubled by a perfect. Combat: per kill, monsters on the farm give a third.','Books: the Stardew Valley Almanac, Mining Monthly, Woodcutter’s Weekly, Bait And Bobber, Combat Quarterly and the Book Of Stars each give 250 XP once (bookseller, 1.6).']},
 {h:'Professions: the pick for each player',p:'Level 5 picks one of two; level 10 picks one of the two under it. Nothing is lost forever: the Statue of Uncertainty in the Sewers re-picks a skill for 10,000g.',table:{cols:['Skill','Level 5','Level 10','The pick'],rows:[
  ['Farming','Rancher: animal products +20% / Tiller: crops +10%','Rancher: Coopmaster (coop animals befriend faster, incubation halved) or Shepherd (barn animals, faster wool) / Tiller: Artisan (artisan goods +40%) or Agriculturist (crops grow 10% faster)','P1: Tiller then Artisan. Kegs and jars are the Year 2 money; +40% on wine beats +10% on raw crops.'],
  ['Fishing','Fisher: fish +25% / Trapper: cheaper crab pots','Fisher: Angler (fish +50%) or Pirate (treasure doubled) / Trapper: Mariner (no junk in pots) or Luremaster (pots need no bait)','P2: Fisher then Angler. Fish are single bundle items and daily cash; pots are a sideline.'],
  ['Mining','Miner: +1 ore per node / Geologist: gems come in pairs half the time','Miner: Blacksmith (bars +50%) or Prospector (coal doubled) / Geologist: Excavator (geodes doubled) or Gemologist (gems +30%)','P2: Miner then Blacksmith. More ore means more bars for tools, sprinklers and kegs.'],
  ['Foraging','Forester: trees drop 25% more wood / Gatherer: 20% chance of double forage','Forester: Lumberjack (any tree can drop hardwood) or Tapper (syrup +25%) / Gatherer: Botanist (forage always iridium) or Tracker (forage shown on screen)','P1: Gatherer then Botanist. Iridium forage sells for double and doubles as gifts.'],
  ['Combat','Fighter: +10% damage, +15 HP / Scout: crit chance +50%','Fighter: Brute (+15% damage) or Defender (+25 HP) / Scout: Acrobat (special cooldown halved) or Desperado (crits hit twice as hard)','P2: Fighter then Brute. Flat damage is what clears floors 80 to 120.']
 ]}}
]},
{id:'mines',title:'The Mines by floor',blocks:[
 {h:'What lives where',p:'Elevator on every fifth floor; a floor that is a multiple of ten has no monsters and one chest per player. Clear the monsters first, then mine: each rock is 4% likelier to hide a ladder once the floor is empty.',table:{cols:['Floors','Ore','Geode','Crystal on the floor','Monsters','Bundle drops'],rows:[
  ['1-39','Copper (from floor 2)','Geode','Quartz, Earth Crystal','Green Slime, Duggy, Bug, Rock Crab, Bat (31-39), Stone Golem','Slime; Bat Wing 1-2 from Bats at 94%; Crab from Rock Crabs 15%; Earth Crystal from Duggies 10%'],
  ['41-79','Iron (densest 71-79), Aquamarine and Jade nodes','Frozen Geode','Quartz, Frozen Tear','Frost Jelly, Frost Bat, Dust Sprite, Ghost (51+), Skeleton (71+)','Coal from Dust Sprites 50%; Solar Essence from Ghosts 95%; Frozen Tear; Ghostfish pond on 60'],
  ['81-119','Gold; Emerald and Ruby nodes; Mystic Stone from 100','Magma Geode','Quartz, Fire Quartz','Red Sludge, Lava Bat, Lava Crab, Shadow Brute, Shadow Shaman, Metal Head, Squid Kid (91+)','Void Essence from Shadow Brute or Shaman 75%; Fire Quartz; Bomb from Lava Crabs'],
  ['120','','','','none','Skull Key chest (once per player)']
 ]},notes:['Chests: 10 Leather Boots, 20 Steel Smallsword, 40 Slingshot, 50 Tundra Boots, 60 Crystal Dagger, 70 Master Slingshot, 80 Firewalker Boots, 90 Obsidian Edge, 100 Stardrop, 110 Space Boots, 120 Skull Key.','Coal carts (6 coal) on 12, 18, 28, 38, 92, 98, 108, 118; bags on 52, 58, 68, 78. Floors 12, 52 and 92 always have a ladder at the end of the path.','Danger jumps at 80: monsters hit for 15-18. Bring Firewalker Boots (floor 80 chest) and a level-5 sword; the Obsidian Edge on 90 is free.','Passing out: at 2am or on zero energy you lose 10% of your gold (max 1,000g); on zero health you lose up to 15,000g and random items. Weapons and rods do not come back.']},
 {h:'Furnace, bars and coal',table:{cols:['Thing','Recipe or source','Time','Note'],rows:[
  ['Furnace','20 Copper Ore + 25 Stone (Clint visits the morning after your first copper)','','One coal per smelt'],
  ['Copper Bar','5 Copper Ore + 1 Coal','30 min','Clint sells ore at 75g in Year 1'],
  ['Iron Bar','5 Iron Ore + 1 Coal','2 h','Or Transmute (Fe) at Mining 4: 3 Copper Bars in'],
  ['Gold Bar','5 Gold Ore + 1 Coal','5 h','Or Transmute (Au) at Mining 7: 2 Iron Bars in'],
  ['Refined Quartz','1 Quartz + 1 Coal (1 Fire Quartz gives 3)','90 min','Quality Sprinklers and Lightning Rods'],
  ['Coal','Dust Sprites 41-79 (50%); Charcoal Kiln 10 Wood in (Foraging 2); Clint 150g','','Elevator to 45 or 55, clear the sprites, leave, repeat'],
  ['Staircase','99 Stone (Mining 2)','','Robin sells Stone at 20g in Year 1: about 2,000g a staircase'],
  ['Geode','Clint cracks any geode for 25g','','Contents are fixed per save; luck does not change them']
 ]}},
 {h:'Tool upgrades at Clint’s',p:'Two days each, in order, tool gone meanwhile. In co-op a tool can be handed to the other player, so the farm never goes unwatered. Since 1.6 the Watering Can comes back full and Clint still cracks geodes while he works.',table:{cols:['Tier','Cost','Pickaxe','Axe','Watering Can','Hoe'],num:[1],rows:[
  ['Copper','2,000g + 5 Copper Bar','Floors 1-39 rocks in one hit','Large Stumps: hardwood','3 tiles in a line','3 tiles in a line'],
  ['Steel','5,000g + 5 Iron Bar','Floors 40-79 in one hit; the Dwarf rock; farm boulders','Large Logs: the Secret Woods','5 tiles in a line','5 tiles in a line'],
  ['Gold','10,000g + 5 Gold Bar','Floors 80-120 in one hit; meteorites','Trees in 4 hits','3 by 3','3 by 3'],
  ['Iridium','25,000g + 5 Iridium Bar','Skull Cavern rocks in one hit','Trees in 2 hits','6 by 3','6 by 3']
 ]},notes:['Order for Year 1: Copper Pickaxe first, Copper then Steel Axe (hardwood, then the Secret Woods for Woodskip and Fiddlehead Fern), Steel Pickaxe, then the farmer’s Watering Can to Steel and Gold. Hand a can in the day before rain.']}
]}
];
