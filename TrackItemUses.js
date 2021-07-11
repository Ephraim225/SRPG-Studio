// Plugin by Ephraim225.
// Thought this might be easy to make so I went ahead and did it. This will increment a variable of your choice each time an item is used.
// In your item's custom paramaters, set the following custom parameters:
// "vartype" - the table of the variable you want to increment
// "variable" - the ID of the variable you want to increment
// This is run alongside the function for giving a unit EXP for using items, but it'll work regardless of whether the item gives any EXP at all.

ItemExpFlowEntry._getItemExperience = function(itemUseParent) {
		var itemTargetInfo = itemUseParent.getItemTargetInfo();
		var unit = itemTargetInfo.unit;
		var exp = itemTargetInfo.item.getExp();
		var vartype = itemTargetInfo.item.custom.vartype;
		var object = itemTargetInfo.item.custom.variable;
		
		if (vartype != null && object != null)
		{
		root.log("Activated")
		var vartable = root.getMetaSession().getVariableTable(vartype);
		var uses = vartable.getVariable(object);
		uses++;
		vartable.setVariable(object, uses);
		}
		
		return ExperienceCalculator.getBestExperience(unit, exp);
	}