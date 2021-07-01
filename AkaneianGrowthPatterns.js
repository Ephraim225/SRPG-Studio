// Akaneian Growth Patterns by Ephraim225.
// This plugin recreates a phenomenon in the original Akaneia Fire Emblems. Due to a technological limitation at the time, during a level up,
// the game rolled one random number for the first stat and then added a constant value for every stat thereafter.
// The result is that there is a consistent pattern of stats gained based on whatever that first random number is.
// Though originally a necessity due to limitations of the old systems, this could be preferable to pure, chaotic random level ups.
// Change the "constant" variable to whatever you want the constant added to the initial random number to be. Then put the plugin in your plugin folder and see how it works.

	ExperienceControl._createGrowthArray = function(unit) {
		var i, n, m, rn, constant;
		var count = ParamGroup.getParameterCount();
		var growthArray = [];
		var weapon = ItemControl.getEquippedWeapon(unit);
		
		// Roll the first random number now
		rn = Probability.getRandomNumber() % 100;
		
		constant = 64 //This can be changed to whatever you feel comfortable with
		
		for (i = 0; i < count; i++) {
			// Calculate the growth value (or the growth rate).
			n = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
			
			// Calculate variable rn
			m = (rn + (constant*i)) % 100
			
			// Set the rise value.
			growthArray[i] = this._getGrowthValueAlt(n, m);
		}
		
		return growthArray;
	}
	
	ExperienceControl._getGrowthValueAlt = function(n, m) {
		var value, value2;
		var isMunus = false;
		
		if (n < 0) {
			n *= -1;
			isMunus = true;
		}
		
		// For instance, if n is 270, 2 rise for sure.
		// Moreover, 1 rises with a probability of 70%.
		value = Math.floor(n / 100);
		value2 = Math.floor(n % 100);
		
		if (value2 > m)) {
			value++;
		}
		
		if (isMunus) {
			value *= -1;
		}
		
		return value;
	}