// Status Staff accuracy alteration plugin by Ephraim225
// This changes the staff accuracy to work like the GBA games (including a penalty to hit based on distance to the target) with a minor amount of customization possible.
// Without the plugin, you have three options for items that inflict a state: Absolute, HP Drop Rate, and Stat. Only the latter of the three is altered by the plugin.
// Originally, the formula was UserStat*Coefficient, where the user would define what stat is used and what the coefficient is.
// With the plugin, the formula is now (30+(UserStat - TargetRes)*Coefficient)+UserSkill-(Distance*2)
// To use this plugin, place the file in your Plugin folder. Then create an item that inflicts a state, and choose a stat and set the coefficient to whatever you want.
// In addition, you can add custom parameters to your items to alter the formula somewhat on a per-item basis. Here are the parameters:

// "base" The base accuracy for the item, default 30.
// "penalty" The distance penalty multiplier, default 2.
// "bonus" Adds the stat defined by this parameter to the accuracy. Default is SKL.
// "enemystat" Defines which enemy stat resists the item. Default is RES.
// "jugdral" Defaults to 0. If it's anything but 0, staff accuracy will always be 100 if UserStat is greater than TargetRes, like in FE4.
// "addluck" If this parameter is present, the luck stats of both units will be added to the defined stats for Jugdral-style calculations.

/* For those last two parameters, input the number of the desired stat according to this table:
	HP: 0,
	POW: 1,
	MAG: 2,
	SKI: 3,
	SPD: 4,
	LUK: 5,
	DEF: 6,
	MDF: 7,
	MOV: 8,
	WLV: 9,
	BLD: 10,
*/

var RecieveingUnit = null;
var ActiveItem = null;

//Function for drawing to the screen apparently
	StateItemPotency.setPosMenuData = function(unit, item, targetUnit) {
		var stateInvocation = item.getStateInfo().getStateInvocation();
		var state = stateInvocation.getState();
		
		if (StateControl.isStateBlocked(targetUnit, unit, state)) {
			this._value = 0;
		}
		else {
			this._value = CustomStaffPercent.getInvocationPercentCustom(unit, stateInvocation.getInvocationType(), stateInvocation.getInvocationValue(), targetUnit, item);
		}
	}
	
//Function for using it in actual calculation
	Probability.getInvocationProbability = function(unit, type, value) {
		var percent
		if (ActiveItem != null)
		{
		if (ActiveItem.isWeapon())
		{
		//root.log("Attack initiated. Weapon not null.")
		percent = this.getInvocationPercent(unit, type, value);
		}
		else
		{
		//root.log("Staff was casted.")
		percent = CustomStaffPercent.getInvocationPercentCustom(unit, type, value, RecieveingUnit, ActiveItem);
		}
		}
		else
		{
		//root.log("Attack initiated. Weapon null.")
		percent = this.getInvocationPercent(unit, type, value);
		}
		
		return this.getProbability(percent);
	}

//New function for calculating chance to hit
var CustomStaffPercent = {
	getInvocationPercentCustom: function(unit, type, value, targetUnit, item) {
		var n, hp, percent;
		var mag, res, unit1x, unit1y, unit2x, unit2y, distancex, distancey, dex, tohit, space;
		var base, enemystat, bonus, penalty;
		
		RecieveingUnit = targetUnit;
		ActiveItem = item;
		
		if (type === InvocationType.HPDOWN) {
			n = value / 100;
			hp = ParamBonus.getMhp(unit) * n;
			percent = unit.getHp() <= hp ? 100 : 0;
		}
		else if (type === InvocationType.ABSOLUTE) {
			percent = value;
		}
		else if (type === InvocationType.LV) {
			percent = unit.getLv() * value;
		}
		else {
			/*if (DataConfig.isSkillInvocationBonusEnabled()) {
				percent = ParamBonus.getBonus(unit, type) * value;
			}
			else {
				percent = unit.getParamValue(type) * value;
			}*/

			base = 30;
			enemystat = 7;
			bonus = 3;
			penalty = 2;
			
			if (item.custom.base != null)
			{
				base = item.custom.base
			}
			if (item.custom.enemystat != null)
			{
				enemystat = item.custom.enemystat
			}
			if (item.custom.bonus != null)
			{
				bonus = item.custom.bonus
			}
			if (item.custom.penalty != null)
			{
				penalty = item.custom.penalty
			}
			
			mag = ParamBonus.getBonus(unit, type);
			dex = ParamBonus.getBonus(unit, bonus);
			res = ParamBonus.getBonus(targetUnit, enemystat);
			luk = ParamBonus.getBonus(unit, 5);
			eluk = ParamBonus.getBonus(targetUnit, 5);
			
			tohit = mag - res;
			
			unit1x = unit.getMapX();
			unit1y = unit.getMapY();
			unit2x = targetUnit.getMapX();
			unit2y = targetUnit.getMapY();
			distancex = Math.abs(unit1x - unit2x);
			distancey = Math.abs(unit1y - unit2y);
			
			space = distancex + distancey;
			
			percent = base + tohit*value + dex - space*penalty;
			
			if (percent > 100)
			{
				percent = 100
			}
			if (percent < 0)
			{
				percent = 0
			}
		//FE4 style accuracy
			if (item.custom.jugdral != null)
			{
				var calculation1
				var calculation2
				if (item.custom.addluck != null)
				{
					calculation1 = mag + luk
					calculation2 = res + eluk
				}
				else
				{
					calculation1 = mag
					calculation2 = res
				}
				if (item.custom.jugdral != 0 && calculation1 > calculation2)
				{
					percent = 100
				}
				else
				{
					percent = 0
				}
			}
		
		}
		
		return percent;
	}
}