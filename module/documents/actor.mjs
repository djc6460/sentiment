/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class SentimentActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;

    // Configure prototype token settings
    if (this.type === "character") {
      this.updateSource({
        "prototypeToken.actorLink": true,
        "prototypeToken.disposition": 1,
        "prototypeToken.sight.enabled": true,
        "prototypeToken.detectionModes": [{
          id: 'basicSight',
          range: 30,
          enabled: true
        }]
      });
    }
  }
  /*Create a new actor - When creating an actor set basics including tokenlink, bars, displays sight
  static async create (data, options = {}) {
    if (data.type === 'character') {
      data.prototypeToken = foundry.utils.mergeObject(data.prototypeToken || {}, {
        actorLink: true,
        disposition: 1,
        //displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        //displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        sight: {
          enabled: true
        },
        detectionModes: [{
          id: 'basicSight',
          range: 30,
          enabled: true
        }]
      })
    } 
    return await super.create(data, options);
}*/

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    super.prepareBaseData();
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData();
    this._prepareNpcData();
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData() {
    if (this.type !== 'character') return;
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData() {
    if (this.type !== 'npc') return;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        if (v) data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    data.lvl = data.attributes?.level?.value ?? 0;
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;
  }

}