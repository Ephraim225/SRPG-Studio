/*
--------------------------------
Tile select plugin by Ephraim225
--------------------------------
This plugin allows the user to trigger a global switch when the player selects a certain tile, rather than a unit. This allows for events such as a prompt for selecting what unit to summon to the selected tile, which is how you build units in Advance Wars, for example. It starts with selecting the tile, rather than issuing a command to a unit.
To use this plugin, place it in your project's plugin folder. Then go to the Terrain tab in the Database and set the following custom parameters to the terrain type you want to use:
triggerswitch - the ID of the global switch you want to set
variabletable - the variable set to store the X and Y coordinates of the tile for later use
variablex - which variable to store the X coordinate
variabley - which variable to store the Y coordinate
For example, you could put:
{triggerswitch: 0, variabletable: 1, variablex: 0, variabley: 1}
Which would cause global switch 0 to be set to true and the tile's coordinates would be stored in the first two variables of the second variable set.
You could then create an Auto Event with the trigger condition that global switch 0 is set to true. The actual event could have whatever you want, just be sure to set the global switch back to false so it doesn't trigger again when you don't want it to.
Note that if the tile selected is occupied by a unit, the game will assume you're opening the start menu and will not run the event.
Examples of events you could create:
- Summoning a unit to that tile a la Advance Wars
- Creating a static, automatic "unmanned gun turret"
- Manually detonated bomb or mine
- Player-controlled terrain shifting
*/
//This plugin's functionality doesn't require you to edit it directly.
//UPDATE: I have updated the plugin with a new function. It will now store the cursor's coordinates into variables of your choice (and you WILL need to edit this file to change which variables) whenever you select a unit. This means the game can now remember the starting coordinates of a unit you're moving, which can help if you want to refund a player's move when a command "fizzles out" or the event made a mistake.

PlayerTurn._moveMap = function() {
	var result = this._mapEdit.moveMapEdit();
		
	if (result === MapEditResult.UNITSELECT) {
		this._targetUnit = this._mapEdit.getEditTarget();
		if (this._targetUnit !== null) {
			if (this._targetUnit.isWait()) {
				this._mapEdit.clearRange();
					
				// Pressing the decision key on the unit who waits is treated as a map command.
				this._mapCommandManager.openListCommandManager();
				this.changeCycleMode(PlayerTurnMode.MAPCOMMAND);
			}
			else {
				// Change it to the mode which displaying the unit moving range.
				
					var cursorx = root.getCurrentSession().getMapCursorX() //Get cursor X position
					var cursory = root.getCurrentSession().getMapCursorY() //Get cursor Y position
					
					//These set the cursor coordinates to the variables of your choice. Change the numbers if you wish.
					var vartable = root.getMetaSession().getVariableTable(0)
					vartable.setVariable(0, cursorx)
					vartable.setVariable(1, cursory)
				
				this._mapSequenceArea.openSequence(this);
				this.changeCycleMode(PlayerTurnMode.AREA);
			}
		}
	}
		else if (result === MapEditResult.MAPCHIPSELECT) {
			var cursorx = root.getCurrentSession().getMapCursorX() //Get cursor X position
			var cursory = root.getCurrentSession().getMapCursorY() //Get cursor Y position
			var terraintype = root.getCurrentSession().getTerrainFromPos(cursorx, cursory, true).custom.triggerswitch //Get the custom parameter of the terrain the cursor is over
			var vartype = root.getCurrentSession().getTerrainFromPos(cursorx, cursory, true).custom.variabletable
			var terrainx = root.getCurrentSession().getTerrainFromPos(cursorx, cursory, true).custom.variablex
			var terrainy = root.getCurrentSession().getTerrainFromPos(cursorx, cursory, true).custom.variabley
			var globalSwitchTable = root.getMetaSession().getGlobalSwitchTable() //Get the global switch table
			
			if (terraintype != null)
			{
				globalSwitchTable.setSwitch(terraintype, true) //Sets the switch that triggers the auto event
				var vartable = root.getMetaSession().getVariableTable(vartype) //Gets one of the variable tables. You can change which one.
				vartable.setVariable(terrainx, cursorx) //Variable to store X coordinate in. You can change this.
				vartable.setVariable(terrainy, cursory) //Variable to store Y coordinate in. You can change this.
				SceneManager.getActiveScene().notifyAutoEventCheck(); //Forces the game to check and run any auto events that meet their conditions. We have to do this because the game waits until a unit moves or the player opens the map menu otherwise.
			}
			else
			{
			this._mapCommandManager.openListCommandManager();
			this.changeCycleMode(PlayerTurnMode.MAPCOMMAND);
			}
		}
		
		return MoveResult.CONTINUE;
	}
