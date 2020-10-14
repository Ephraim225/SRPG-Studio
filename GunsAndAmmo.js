//Guns and ammo plugin by Ephraim225

//This makes it so weapons such as bows use ammo.
//Here's how it works. First, create your bow and create an ammo item. Create a new item type for the ammo and remember what you named it.
//Make it so the user must have ammo in their inventory to use the bow.
//Then make the following custom parameter for the bow:
//"ammo" will tell this plugin what item type to look for when deducting ammo. Enter the name of the item type you made earlier in "quotation marks".
//If this parameter is not present the item is presumed to not use ammo.
//Now, when you attack with the bow, both the bow and ammo will lose durability.
//However, if a unit possesses a custom skill with the keyword "Infinity" the ammo deduction is not done.
//You can make different types of ammo. If for example you want a poisoned arrow, make an ammo item that adds a skill that inflicts poison.
//Any skills on such items will only apply if you are using the correct type of gun in a fight.

//Also, make sure your ammo item type transforms into useless junk when it breaks. It doesn't get removed automatically unfortunately.

//Now it's probably annoying to move the ammo you want to the top of your list so I recommend LadyRena's equipment script since it takes care of that annoyance:
// https://github.com/LadyRena0713/Scripts/blob/master/Mechanics/System%20Mods/Misc%20Changes/Equipment-Script.js

AttackFlow._doAttackAction = function() {
		var i, count, turnState;
		var order = this._order;
		var active = order.getActiveUnit();
		var passive = order.getPassiveUnit();
		var activeStateArray = order.getActiveStateArray();
		var passiveStateArray = order.getPassiveStateArray();
		var isItemDecrement = order.isCurrentItemDecrement();
		
		DamageControl.reduceHp(active, order.getActiveDamage());
		DamageControl.reduceHp(passive, order.getPassiveDamage());
		
		DamageControl.checkHp(active, passive);
		
		count = activeStateArray.length;
		for (i = 0; i < count; i++) {
			turnState = StateControl.arrangeState(active, activeStateArray[i], IncreaseType.INCREASE);
			if (turnState !== null) {
				turnState.setLocked(true);
			}
		}
		
		count = passiveStateArray.length;
		for (i = 0; i < count; i++) {
			turnState = StateControl.arrangeState(passive, passiveStateArray[i], IncreaseType.INCREASE);
			if (turnState !== null) {
				turnState.setLocked(true);
			}
		}
		//This block reduces your weapon durability. If the conditions are met we will instead deduct ammo.

			weapon = BattlerChecker.getBaseWeapon(active);
			if (weapon.custom.ammo !== null && !SkillControl.getPossessionCustomSkill(active,"Infinity")) {
			//Search for item type: Ammo
				count = UnitItemControl.getPossessionItemCount(active);
				for (j = 0; j < count; j++) {
					item = UnitItemControl.getItem(active, j);
					if (item !== null && item.getWeaponType().getName() == weapon.custom.ammo) {
						ItemControl.decreaseLimit(active, item);
						//ItemControl.decreaseLimit(active, weapon);
						j = count;
					}
				}
			}

		if (isItemDecrement) {
			ItemControl.decreaseLimit(active, weapon);
		}
	}

/* //For controlling when ammo bonus applies. This is no longer used because you can make parameter boost skills anyhow.
BaseUnitParameter._getItemBonus = function(unit, isParameter) {
	var i, item, n;
	var d = 0;
	var checkerArray = [];
	var count = UnitItemControl.getPossessionItemCount(unit);
		
	for (i = 0; i < count; i++) {
		item = UnitItemControl.getItem(unit, i);
		if (!ItemIdentityChecker.isItemReused(checkerArray, item)) {
			continue;
		}
			
		if (isParameter) {
			n = this.getParameterBonus(item);
		}
		else {
			n = this.getGrowthBonus(item);
		}
		//New code here. Check if item is ammo and we have a matching gun equipped.
		weapon = BattlerChecker.getRealBattleWeapon(unit);
		if (weapon !== null) {
		if (weapon.custom.ammo == null || item.getWeaponType().getName() !== weapon.custom.ammo) {
			n = 0;
		} }
			
		// Correction is not added for the unit who cannot use the item.
		if (n !== 0 && ItemControl.isItemUsable(unit, item)) {
			d += n;
			}
		}
		
		return d;
	} */
	
//For controlling when skill bonus applies
SkillControl._pushObjectSkill = function(unit, weapon, arr, skilltype, keyword, objectFlag) {
		var i, item, list, count, terrain, child;
		var checkerArray = [];
		var cls = unit.getClass();
		
		if (objectFlag & ObjectFlag.UNIT) {
			// Add the unit's skill.
			this._pushSkillValue(unit, ObjectType.UNIT, arr, skilltype, keyword);
		}
		
		if (objectFlag & ObjectFlag.CLASS) {
			// Add the skill of the class which the unit belongs to.
			this._pushSkillValue(cls, ObjectType.CLASS, arr, skilltype, keyword);
		}
		
		if (objectFlag & ObjectFlag.WEAPON) {
			if (weapon !== null) {
				// Add the weapon's skill.
				this._pushSkillValue(weapon, ObjectType.WEAPON, arr, skilltype, keyword);
			}
		}
		
		if (objectFlag & ObjectFlag.ITEM) {
			count = UnitItemControl.getPossessionItemCount(unit);
			for (i = 0; i < count; i++) {
				item = UnitItemControl.getItem(unit, i);
				if (!ItemIdentityChecker.isItemReused(checkerArray, item)) {
					continue;
				}
				
				if (item !== null && ItemControl.isItemUsable(unit, item)) {
					// If the item can be used, add skill.
					weapon2 = ItemControl.getEquippedWeapon(unit);
					
					if (weapon !== null && weapon2.custom.ammo !== null) {
					if (item.getWeaponType().getName() == weapon2.custom.ammo) {
						this._pushSkillValue(item, ObjectType.ITEM, arr, skilltype, keyword);
					} }
					else {
					this._pushSkillValue(item, ObjectType.ITEM, arr, skilltype, keyword);
					}
				}
			}
		}
		
		if (objectFlag & ObjectFlag.STATE) {
			// Add the skill of state of the unit.
			list = unit.getTurnStateList();
			count = list.getCount();
			for (i = 0; i < count; i++) {
				this._pushSkillValue(list.getData(i).getState(), ObjectType.STATE, arr, skilltype, keyword);
			}
		}
		
		if (objectFlag & ObjectFlag.TERRAIN) {
			terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
			if (terrain !== null) {
				this._pushSkillValue(terrain, ObjectType.TERRAIN, arr, skilltype, keyword);
			}
		}
		
		if (objectFlag & ObjectFlag.FUSION) {
			child = FusionControl.getFusionChild(unit);
			if (child !== null) {
				objectFlag = FusionControl.getFusionData(unit).getSkillIncludedObjectFlag();
				this._pushObjectSkillFromFusion(child, ItemControl.getEquippedWeapon(child), arr, skilltype, keyword, objectFlag);
			}
		}
	}