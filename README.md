# Sentiment System

This system is for the in development ttrpg sentiment. It is currently bare bones but usable.

## Recommended Modules  
All of these are searchable  
  
# 'Essential' for Sentiment:
Bar Brawl - Allows you to make custom bars and variables for tokens.  
Token Variant Art - Essential for easy swapping of token faces (If you like having borders match your attributes)  
Condition Lab and Triggler - Primarily for condition lab, allows you to make custom conditions and icons for them (For various gift buffs)  
  
# Generally Useful for any System:  
PopOut!, Drag Upload, Drag Ruler, Dice so Nice, Dice Tray, Quick Insert  
  
# Token Variant Art Support  
There are special fields to use with Token Variant Art to make automatic swapping of borders when you lock in a color.    
Use the following as an expression: actor.system.currentSwingName="blue"    
You replace blue with the attribute's name (case sensitive), or you can override a color's currentSwingName name by changing the color's "internal name" value.  
(Todo, create and link a config here for global borders)  
  
(Todo: Image Guide)  
To get to a token's settings for this:  
1) Click the token  
2) Right Click the TVA button (should be bottom right icon)  
3) Select "Mappings"  
4) From here, in the top bar you can select global to make global overlays for all tokens if you want.  
5) Click the little plus for a new mapping.  
6) Paste the above expression in to the expression column  
7) Check the "Overlay" checkbox.  
8) Click the gear next to overlay  
9) Go to the image tab and click "Add Image"  
10) Browse files to your border overlay.  
  
You can also fully replace a token if desired instead of using an overlay, and this is just the bare basics of TVA's features.

## Current todo list
# Trivial  
  
# Normal  
Actually make a real readme  
Add settings page to disable automated messaging (wound/lock and such) or send them to self instead. (Partially done) 
Add settings page to add bonuses to add universal bonuses to dye/do. (Done)  
Add setting to colors to add default bonuses to dye/do/recover. (autofill the prompt) (Done for only do) 
Fix color drag/drop. It broke at some point and will be useful in the future.  

# Long Term    
Add modifier system to gifts. When equipped, it will add an extra modifier to do/dye/recovers that is toggleable in the dialogue. Drag in colors to make them only apply to rolls involving the matching colors.  
  
Clean up all the unused code from boilerplate, and organize the mess.  
  
Changelog:  
-Added support to easily use TVA (Token Variant Art) to automatically change an actor's image when a swing is locked in.  
-Added a new field to colors for "internal name", the only use for this is to override a swing's currentSwingName for the sake of TVA comparisons.  
-Updated the sentiment color compendium to all have internal names for TVA.  
-Added simple readme instructions for setting up TVA to automatically swap your tokens on lockin.  
  
-There are now recommended addons in the readme.  
-Added a simple leveling up feature and a new settings tab for character sheets.  

-Added convenience variables for default global bonuses for each roll type, and a default bonus for colors (for roll to do). They will autofill the "Bonuses" field in each popup.