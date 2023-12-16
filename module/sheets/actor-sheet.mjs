import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SentimentActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["sentiment", "sheet", "actor"],
      template: "systems/sentiment/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/sentiment/templates/actor/actor-${this.actor.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gifts = [];
    const colors = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to color
      if (i.type === 'color') {
        colors.push(i);
      }
      // Append to gift.
      else if (i.type === 'gift') {
        gifts.push(i);
      }
    }

    // Assign and return
    //sorting array here for handlebars
    context.gifts = gifts.sort(function(a,b) {return a.system.isEquipped-b.system.isEquipped}).sort(function(a,b) {return a.system.isPrimary-b.system.isPrimary}).reverse();
    context.colors = colors.sort(function(a,b) {return a.system.disabled-b.system.disabled});
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    //Lock a color
    html.find('.item-toggle-lock').click(this._onToggleLock.bind(this));

    html.find('.item-toggle-wound').click(this._onToggleWound.bind(this));
    
    html.find('.item-toggle-equip').click(this._onToggleEquipped.bind(this));
    
    html.find('.item-toggle-primary').click(this._onTogglePrimary.bind(this));
    html.find('.item-remove-swing').click(this._onRemoveSwing.bind(this));

    //Toggle item expansion
    html.find('.item-toggle-expand').click(this._onToggleExpand.bind(this));

    html.find('.item-rollToDyeButton').click(this._onRollToDye.bind(this));
    html.find('.item-rollToDoButton').click(this._onRollToDo.bind(this));
    html.find('.item-rollToRecoverButton').click(this._onRollToRecover.bind(this));
    html.find('.item-setSwingButton').click(this._onSetSwing.bind(this));
    html.find('.item-igniteButton').click(this._onIgnite.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }
 /**
   * Chat message templates
   */
 chatTemplate = {
  "rollToDo": "systems/sentiment/templates/chat/roll-to-do-chat.html",
  "rollToDye": "systems/sentiment/templates/chat/roll-to-dye-chat.html",
  "rollToRecover": "systems/sentiment/templates/chat/roll-to-recover-chat.html",
}
async _onIgnite(event) {
  let actor = game.actors.get(this.actor._id);
  let color;

  //Get Locked Color
  for (const element of actor.items) {
    if(element.type==="color")
    {
      if(element.system.isSwing)
      {
        color = element;
        element.update({'system.isSwing':false});
      }
    }
  };

  let message = "";
  if(color)
  {
    message = "Ignited " + color.system.displayName;
  }
  else
  {
    message = "Cannot ignite. Not locked in to a color";
  }
  
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: message
    }
  );
}
async _onSetSwing(event) {
  let actor = game.actors.get(this.actor._id);
  let colorArray = [];

  

  //Get Color Array
  for (const element of actor.items) {
    if(element.type==="color")
    {
      if(!(element.system.disabled || element.system.wounded || element.system.locked))
      {
        colorArray.push(element);
      }
    }
  };

  //Dialogue Options
  let userInput = await SetSwingBonusDialogue(colorArray);
  if(userInput.cancelled) {
    return;
  }
  let swing = userInput.swing;
  let selectedColorID = userInput.selectedColor;
  
  let color = actor.items.get(selectedColorID);
  let colorName = "";
  if (color) {
    colorArray.forEach(element => {
      if(element.system.isSwing && element.id != color.id)
      {
        element.update({'system.isSwing':false});
      }
    });
    color.update({'system.isSwing':true,'system.swingValue':swing});
    colorName = color.system.displayName;
  }
  else
  {
    system.log("Error: Color not found");
    return;
  }
  
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: `Set swing to ${colorName} [${swing}]`
    }
  );
  return;
}
async _onRollToDye(event) {
  let actor = game.actors.get(this.actor._id);
  let colorArray = [];
  let colorWoundArray = [];
  let colorLockArray = [];
  let colorRollArray = [];
  let total = 0;
  let attVal = 0;
  let attColor = "";

  //Dialogue Options
  let userInput = await GetDyeBonusDialogue();
  if(userInput.cancelled) {
    return;
  }
  let bonuses = userInput.bonuses;

  var formulaRoll;
  try{
    formulaRoll = await new Roll(bonuses).roll({async: true});
    total+=formulaRoll.total;
    colorRollArray.push(formulaRoll);
  }
  catch{
    console.log("Bad value of " + formulaRoll + " was ignored")
    colorRollArray = await new Roll("0").roll({async: true});
    rollArray.push(formulaRoll);
  }

  //One dice for every color
  for (const element of actor.items) {
    if(element.type==="color")
    {
      if(element.system.disabled)
      {

      }
      else if(element.system.wounded)
      {
        colorWoundArray.push(element);
      }
      else if(element.system.locked)
      {
        colorLockArray.push(element);

        //Unlock dice that get rolled as locked.
        let item = this.actor.items.get(element._id);
        item.update({'system.locked':false});

      }
      else
      {
        let obj = {};
        obj.colorItem = element;
        var roll;
        if(element.system.isSwing) {
          roll = await new Roll(element.system.swingValue).roll({async: true});
          total+=parseInt(element.system.value);
          attVal = parseInt(element.system.value);
          attColor = element.system.hexColor;
        } else {
          roll = await new Roll("1d6").roll({async: true});
        }
        obj.roll = roll;
        total+=roll.total;
        colorArray.push(obj);
        colorRollArray.push(roll);
      }
    }
  };
  var formulaString = "";
  if(formulaRoll.total >= 0)
  {
    formulaString = "+"+formulaRoll.total;
  } else {
    formulaString = "-"+formulaRoll.total;
  }

  let ownerID = this.actor.id;
  let finalTotalNoAtt = total-attVal;
  let cardData = {
    colorArray: colorArray,
    colorWoundArray: colorWoundArray,
    colorLockArray: colorLockArray,
    ownerId: ownerID,
    attVal: attVal,
    formulaRoll:formulaRoll,
    formulaString:formulaString,
    attColor: attColor,
    finalTotal: total,
    finalTotalNoAtt: finalTotalNoAtt
  }
  let chatContent = await renderTemplate(this.chatTemplate["rollToDye"], cardData);
  
  
  colorRollArray = cleanseDice(colorRollArray);

  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: chatContent,
    rolls: colorRollArray, //passing this for dice so nice.
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    }
  );
  return;
}
async _onRollToRecover(event) {
  let actor = game.actors.get(this.actor._id);
  let colorArray = [];
  let colorWoundArray = [];
  let colorRollArray = [];
  let total = 0;
  let attVal = 0;
  let attColor = "";
  
  //Dialogue Options
  let userInput = await GetRecoverBonusDialogue();
  if(userInput.cancelled) {
    return;
  }
  let bonuses = userInput.bonuses;

  var formulaRoll;
  try{
    formulaRoll = await new Roll(bonuses).roll({async: true});
    total+=formulaRoll.total;
    colorRollArray.push(formulaRoll);
  }
  catch{
    console.log("Bad value of " + formulaRoll + " was ignored")
    colorRollArray = await new Roll("0").roll({async: true});
    rollArray.push(formulaRoll);
  }

  //One dice for every color
  for (const element of actor.items) {
    if(element.type==="color")
    {
      if(element.system.disabled)
      {

      }
      else if(element.system.wounded)
      {
        colorWoundArray.push(element);
      }
      else
      {
        let obj = {};
        obj.colorItem = element;
        total+= parseInt(element.system.value);
        attVal+= parseInt(element.system.value);
        var  roll = await new Roll("1d6").roll({async: true});
        obj.roll = roll;
        total+=roll.total;
        colorArray.push(obj);
        colorRollArray.push(roll);
      }
    }
  };
  
  
  var formulaString = "";
  if(formulaRoll.total >= 0)
  {
    formulaString = "+"+formulaRoll.total;
  } else {
    formulaString = "-"+formulaRoll.total;
  }
  
  let ownerID = this.actor.id;
  let cardData = {
    colorArray: colorArray,
    colorWoundArray: colorWoundArray,
    ownerId: ownerID,
    formulaRoll:formulaRoll,
    formulaString:formulaString,
    attVal: attVal,
    attColor: attColor,
    finalTotal: total,
  }
  let chatContent = await renderTemplate(this.chatTemplate["rollToRecover"], cardData);
  
  colorRollArray = cleanseDice(colorRollArray);
  
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: chatContent,
    rolls: colorRollArray, //passing this for dice so nice.
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    }
  );
  return;
}

async _onRollToDo(event) {
  const context = this.getData();
  let color;
  let colorRoll;
  let total = 0;
  let attVal = 0;
  let attColor = "";
  let rollArray = [];
  //Dialogue Options
  let userInput = await GetDoBonusDialogue();
  if(userInput.cancelled) {
    return;
  }
  let bonuses = userInput.bonuses;

  var formulaRoll;
  try{
    formulaRoll = await new Roll(bonuses).roll({async: true});
    total+=formulaRoll.total;
    rollArray.push(formulaRoll);
  }
  catch{
    console.log("Bad value of " + formulaRoll + " was ignored")
    formulaRoll = await new Roll("0").roll({async: true});
    rollArray.push(formulaRoll);
  }
  //Find the swing
  for (const element of context.colors) {
    if(element.system.isSwing) {
      colorRoll = await new Roll(element.system.swingValue).roll({async: true});
      total+=parseInt(element.system.value);
      attVal = parseInt(element.system.value);
      attColor = element.system.hexColor;
      color = element;
    }
  }
  
  var d20Roll = await new Roll("1d20").roll({async: true});
  //There was no swing so roll wild
  if(!colorRoll){
    colorRoll = await new Roll("1d6").roll({async: true});
    //create a fake color
    color = {};
    color.system = {}
    color.system.isSwing = false;
    color.system.displayName = 'Wild';
    attColor = '#d3d3d3';
  }
  total+=colorRoll.total + d20Roll.total;
  rollArray.push(d20Roll);
  rollArray.push(colorRoll);
  
  let ownerID = this.actor.id;

  var formulaString = "";
  if(formulaRoll.total >= 0)
  {
    formulaString = "+"+formulaRoll.total;
  } else {
    formulaString = "-"+formulaRoll.total;
  }

  let cardData = {
    color: color,
    colorRoll: colorRoll,
    d20Roll: d20Roll,
    ownerId: ownerID,
    attVal: attVal,
    formulaRoll:formulaRoll,
    formulaString:formulaString,
    attColor: attColor,
    finalTotal: total,
  }
  let chatContent = await renderTemplate(this.chatTemplate["rollToDo"], cardData);
  

  //Dice so nice cleanser
  rollArray = cleanseDice(rollArray);
  
  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: chatContent,
    rolls: rollArray, //passing this for dice so nice.
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    }
  );
  return;
}

  /**
   * Toggle the lock status on an item
   * @param {Event} event   The originating click event
   * @private
   */
  async _onToggleLock(event) {
    
    const element = event.currentTarget;
    //const dataset = element.dataset;

    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.system.locked = !item.system.locked;
      item.update({'system.locked':item.system.locked});
    }
  }

  async _onTogglePrimary(event) {
    
    const element = event.currentTarget;
    //const dataset = element.dataset;

    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.system.isPrimary = !item.system.isPrimary;
      if(item.system.isPrimary){
        item.system.isEquipped = true;
      }
      item.update({'system.isEquipped':item.system.isEquipped, 'system.isPrimary':item.system.isPrimary});
    }
  }
  
  async _onRemoveSwing(event) {
    
    const element = event.currentTarget;
    //const dataset = element.dataset;

    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.update({'system.isSwing':false});
    }
  }
  async _onToggleEquipped(event) {
    
    const element = event.currentTarget;
    //const dataset = element.dataset;

    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.system.isEquipped = !item.system.isEquipped;
      if(!item.system.isEquipped)
      {
        item.system.isPrimary = false;
      }
      item.update({'system.isEquipped':item.system.isEquipped, 'system.isPrimary':item.system.isPrimary});
    }
  }
  
  async _onToggleExpand(event) {
    
    const element = event.currentTarget;

    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.system.expanded = !item.system.expanded;
      item.update({'system.expanded':item.system.expanded});
    }
  }

  /**
   * Toggle the wound status on an item
   * @param {Event} event   The originating click event
   * @private
   */
  async _onToggleWound(event) {
    
    const element = event.currentTarget;
    //const dataset = element.dataset;

    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      item.system.wounded = !item.system.wounded;
      item.update({'system.wounded':item.system.wounded});
    }
  }
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

}
function _processGetDoBonusDialogue(form) {
  return {
      bonuses: form.bonuses.value
  }
}
async function GetDoBonusDialogue()
{
    const template = "systems/sentiment/templates/chat/roll-to-do-dialogue.html";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {
            title: "Roll to Do",
            content: html,
            buttons: {
                normal: {
                    label: "Roll",
                    callback: html => resolve(_processGetDoBonusDialogue(html[0].querySelector("form")))
                },
                cancel: {
                    label: "Cancel",
                    callback: html => resolve({cancelled:true})
                }
            },
            default:"normal",
            close: () => resolve({cancelled:true})
        }

        new Dialog(data,null).render(true);
    });
}
function _processGetDyeBonusDialogue(form) {
  return {
      bonuses: form.bonuses.value
  }
}
async function GetDyeBonusDialogue()
{
    const template = "systems/sentiment/templates/chat/roll-to-dye-dialogue.html";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {
            title: "Roll to Do",
            content: html,
            buttons: {
                normal: {
                    label: "Roll",
                    callback: html => resolve(_processGetDyeBonusDialogue(html[0].querySelector("form")))
                },
                cancel: {
                    label: "Cancel",
                    callback: html => resolve({cancelled:true})
                }
            },
            default:"normal",
            close: () => resolve({cancelled:true})
        }

        new Dialog(data,null).render(true);
    });
}
function _processGetRecoverBonusDialogue(form) {
  return {
      bonuses: form.bonuses.value
  }
}
async function GetRecoverBonusDialogue()
{
    const template = "systems/sentiment/templates/chat/roll-to-recover-dialogue.html";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {
            title: "Roll to Recover",
            content: html,
            buttons: {
                normal: {
                    label: "Roll",
                    callback: html => resolve(_processGetRecoverBonusDialogue(html[0].querySelector("form")))
                },
                cancel: {
                    label: "Cancel",
                    callback: html => resolve({cancelled:true})
                }
            },
            default:"normal",
            close: () => resolve({cancelled:true})
        }

        new Dialog(data,null).render(true);
    });
}
function _processSetSwingDialogue(form) {
  return {
    swing: form.bonuses.value,
    selectedColor: form.attribute.value
  }
}
async function SetSwingBonusDialogue(colorArray)
{
    const template = "systems/sentiment/templates/chat/set-swing-dialogue.html";
    const html = await renderTemplate(template, {colors:colorArray});

    return new Promise(resolve => {
        const data = {
            title: "Set Swing",
            content: html,
            buttons: {
                normal: {
                    label: "Set",
                    callback: html => resolve(_processSetSwingDialogue(html[0].querySelector("form")))
                },
                cancel: {
                    label: "Cancel",
                    callback: html => resolve({cancelled:true})
                }
            },
            default:"normal",
            close: () => resolve({cancelled:true})
        }

        new Dialog(data,null).render(true);
    });
}

//Removes all rolls with no result values. Dice so nice fails if it's passed a roll with no dice results.
function cleanseDice(rollArray)
{
var diceSoNiceArray = [];
  rollArray.forEach(roll => {
    let shouldAdd = false;
    roll.dice.forEach(dice => {
      if(dice.results)
      {shouldAdd = true}

    });
    if(shouldAdd){
      diceSoNiceArray.push(roll);
    }
  });
  return diceSoNiceArray;
}