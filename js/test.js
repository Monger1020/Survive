const trees = [
	{
		type: "normal",
		level: 1,
		interval: 3000,
		xp: 10,
		media: "assets/media/skills/woodcutting/normal_tree.svg",
	},
	{
		type: "oak",
		level: 10,
		interval: 4000,
		xp: 15,
		media: "assets/media/skills/woodcutting/oak_tree.svg",
	},
	{
		type: "willow",
		level: 25,
		interval: 5000,
		xp: 22,
		media: "assets/media/skills/woodcutting/willow_tree.svg",
	},
	{
		type: "teak",
		level: 35,
		interval: 6000,
		xp: 30,
		media: "assets/media/skills/woodcutting/teak_tree.svg",
	},
	{
		type: "maple",
		level: 45,
		interval: 8000,
		xp: 40,
		media: "assets/media/skills/woodcutting/maple_tree.svg",
	},
	{
		type: "mahogany",
		level: 55,
		interval: 10000,
		xp: 60,
		media: "assets/media/skills/woodcutting/mahogany_tree.svg",
	},
	{
		type: "yew",
		level: 60,
		interval: 12000,
		xp: 80,
		media: "assets/media/skills/woodcutting/yew_tree.svg",
	},
	{
		type: "magic",
		level: 75,
		interval: 20000,
		xp: 100,
		media: "assets/media/skills/woodcutting/magic_tree.svg",
	},
	{
		type: "redwood",
		level: 90,
		interval: 15000,
		xp: 180,
		media: "assets/media/skills/woodcutting/redwood_tree.svg",
	},
];
var axeBonusSpeed = [0, 5, 15, 20, 30, 35, 40, 50];
var treeCutLimit = 1;
var currentlyCutting = 0;
var currentTrees = [];
var treeCuttingHandler = [null, null, null, null, null, null, null, null, null];
var treeAutoHandler = [false, false, false, false, false, false, false, false, false];

function cutTree(treeID, ignore) {
	//Idle checker
	if (idleChecker(CONSTANTS.skill.Woodcutting)) {
		
	} else {
		//Check if the tree is already being cut. If it is, stop the cutting process immediately.
		if (treeCuttingHandler[treeID] !== null && ignore !== 1) {
			//Clear the timeout set to that tree
			clearTimeout(treeCuttingHandler[treeID]);
			//Reduce the currently cutting by 1
			currentlyCutting -= 1;
			if (currentlyCutting > 0) {
				$("#skill-nav-name-0").attr("class", "nav-main-link-name text-success");
			} else {
				$("#skill-nav-name-0").attr("class", "nav-main-link-name");
			}
			//Set the value in the array to null to tell the system to stop
			treeCuttingHandler[treeID] = null;
			//Reset the progress bar
			$("#cut-tree-" + treeID + "-progress")
				.stop(true, true)
				.animate({ width: "0%" }, 0, "linear");
			if (currentlyCutting <= 0) clearOffline();
			else {
				if (!offlinePause) {
					currentTrees.splice(currentTrees.indexOf(treeID), 1);
					offline.action = currentTrees;
					saveData("offline");
				}
			}
		}
		//Else check if you are able to cut another tree down
		else if (treeCuttingHandler[treeID] === null && currentlyCutting >= treeCutLimit) {
			notifyPlayer(CONSTANTS.skill.Woodcutting, "Tree cutting limit reached", "danger");
		} else if (skillLevel[CONSTANTS.skill.Woodcutting] >= trees[treeID].level) {
			currentlyCutting++;
			if (!currentTrees.length) currentTrees.push(treeID);
			else {
				if (treeCutLimit > 1) {
					if (!currentTrees.includes(treeID)) {
						currentTrees.push(treeID);
						if (currentTrees.length > 2) currentTrees.shift();
					}
				} else currentTrees[0] = treeID;
			}
			//if (offline.skill !== CONSTANTS.skill.Woodcutting && offline.action !== currentTrees) playFabSaveData();
			offline.skill = CONSTANTS.skill.Woodcutting;
			offline.action = currentTrees;
			offline.timestamp = new Date().getTime();
			saveData("offline");
			if (currentlyCutting > 0) {
				$("#skill-nav-name-0").attr("class", "nav-main-link-name text-success");
			} else {
				$("#skill-nav-name-0").attr("class", "nav-main-link-name");
			}
			//Simple maffs to determine how fast the cut the damn tree down
			let cutInterval = trees[treeID].interval;
			if (godUpgrade[2]) cutInterval *= 0.8;
			cutInterval *= 1 - axeBonusSpeed[currentAxe] / 100;
			if (equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Woodcutting_Skillcape || equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Max_Skillcape) cutInterval /= 2;
			$("#cut-tree-" + treeID + "-progress")
				.stop(false, false)
				.animate({ width: "100%" }, cutInterval, "linear");
			$("#cut-tree-" + treeID + "-progress").animate({ width: "0%" }, 0, "linear");
			//The timeout funtion that performs everything required after a set time (Do x after the tree is cut)
			treeCuttingHandler[treeID] = setTimeout(
				(function (treeToCut) {
					return function () {
						//Mastery check for double logs
						let doubleLogRand = Math.floor(Math.random() * 100);
						let doubleLogChance = 0;
						let logQty = 1;
						for (let i = 10; i <= treeMasteryData[treeToCut].mastery; i += 10) doubleLogChance += 5;
						if (petUnlocked[0]) doubleLogChance += 5;
						if (doubleLogChance > doubleLogRand) logQty *= 2;
						if (equippedItems.includes(CONSTANTS.item.Aorpheats_Signet_Ring)) {
							let chanceToDouble = Math.floor(Math.random() * 100);
							if (chanceToDouble < items[CONSTANTS.item.Aorpheats_Signet_Ring].chanceToDoubleResources) logQty *= 2;
						}
						//Add item/s to bank
						let bankItem = addItemToBank(treeToCut, logQty);
						//If the function tells us the bank is full, stop the cutting if the setting is set
						if (!bankItem && !ignoreBankFull) {
							bankFullNotify();
							cutTree(treeToCut, 0);
						} else {
							addXP(CONSTANTS.skill.Woodcutting, trees[treeToCut].xp);
							//Update mastery xp
							treeMasteryData[treeToCut].masteryXP++;
							//Check if the mastery XP is more than the required for a new level. If it is, add 1 level
							if (treeMasteryData[treeToCut].masteryXP >= masteryExp.level_to_xp(treeMasteryData[treeToCut].mastery + 1)) {
								//Update the level
								levelUpMastery(CONSTANTS.skill.Woodcutting, treeToCut, treeMasteryData);
							}
							//Give a birds nest?
							let birdNestDrop = 200;
							if (equippedItems.includes(CONSTANTS.item.Clue_Chasers_Insignia)) birdNestDrop *= 1 - items[CONSTANTS.item.Clue_Chasers_Insignia].increasedItemChance / 100;
							birdNestDrop = Math.random() * birdNestDrop;
							let birdChance = 1;
							if (herbloreBonuses[0].bonus !== null) {
								if (herbloreBonuses[0].bonus[0] === 0) {
									birdChance = herbloreBonuses[0].bonus[1] * 2;
									updateHerbloreBonuses(herbloreBonuses[0].itemID);
								}
							}
							if (birdNestDrop < birdChance) {
								let bankItem = addItemToBank(CONSTANTS.item.Bird_Nest, 1);
								//If the function tells us the bank is full, stop the cutting if the setting is set
								if (!bankItem) {
									notifyBirdNest("A Bird Nest dropped! But your bank was full, so it was sold instead", "danger");
									gp += items[CONSTANTS.item.Bird_Nest].sellsFor;
								} else {
									notifyBirdNest("A Bird Nest dropped!", "info");
								}
							}
							rollForPet(0, cutInterval);
							updateClueProgress(1, 4);
							//roll for rare items
							dropRingHalfA(trees[treeToCut].level);
							//Update the skill progress
							updateLevelProgress(CONSTANTS.skill.Woodcutting);
							//Update the woodcutting screen with the required value changes
							updateSkillWindow(CONSTANTS.skill.Woodcutting);
							//Update stats
							//Trees cut
							statsWoodcutting[0].count++;
							//Time spent cutting
							statsWoodcutting[3].count += cutInterval / 1000;
							updateStats("woodcutting");
							//Update firemaking
							updateAvailableLogs();
							//Save the game
							//saveData();
							//Tell the game you're cutting 1 less tree now
							currentlyCutting -= 1;
							cutTree(treeToCut, 1);
						}
					};
				})(treeID),
				cutInterval
			);
			//Animate the progress bars for the tree you are cutting
		}
	}
}
//Handles the milestone unlocks and notifications for it
function updateWCMilestone(notify) {
	nextMilestone = 0;
	milestoneMessage = "<img src='assets/media/skills/woodcutting/woodcutting.png'> New milestone for " + skillName[CONSTANTS.skill.Woodcutting] + " unlocked!";
	//Check for new tree milestones
	for (i = 0; i < trees.length; i++) {
		if (skillLevel[CONSTANTS.skill.Woodcutting] >= trees[i].level) {
			//Show the new tree
			$("#woodcutting_tree_" + trees[i].type).attr("class", "col-6 col-md-4 col-lg-4 col-xl-3");
			//Update next milestone
			nextMilestone++;
		}
	}
	//Change the next level unlock text
	if (nextMilestone < trees.length) {
		$("#woodcutting-tree-next-level").text("Level " + trees[nextMilestone].level);
	} else {
		$("#tree-locked").addClass("d-none");
	}
}

function updateWCRates() {
	let cutInterval = 0;
	for (let i = 0; i < trees.length; i++) {
		cutInterval = trees[i].interval;
		if (godUpgrade[2]) cutInterval *= 0.8;
		cutInterval *= 1 - axeBonusSpeed[currentAxe] / 100;
		cutInterval /= 1000;
		//cutInterval = (trees[i].interval - axeBonusSpeed[currentAxe] / 100 * trees[i].interval) / 1000;
		if (equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Woodcutting_Skillcape || equippedItems[CONSTANTS.equipmentSlot.Cape] === CONSTANTS.item.Max_Skillcape) cutInterval /= 2;
		$("#tree-rates-" + i).text(trees[i].xp + " XP / " + cutInterval + " seconds");
	}
}
