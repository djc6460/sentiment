const fields = foundry.data.fields;

/**
 * Shared System fields template (Equivalent to template.json "base")
 */
function createBaseTemplate() {
  return {
    health: new fields.SchemaField({
      value: new fields.NumberField({ initial: 10, integer: true }),
      min: new fields.NumberField({ initial: 0, integer: true }),
      max: new fields.NumberField({ initial: 10, integer: true })
    }),
    biography: new fields.HTMLField({ initial: "" }),
    currentSwingName: new fields.StringField({ initial: "" }),
    showLeveling: new fields.BooleanField({ initial: false }),
    automatedMessaging: new fields.BooleanField({ initial: true }),
    globalDyeBonus: new fields.StringField({ initial: "" }),
    globalDoBonus: new fields.StringField({ initial: "" }),
    globalRecoverBonus: new fields.StringField({ initial: "" }),
    autoUnlock: new fields.BooleanField({ initial: true })
  };
}

/**
 * Data Model for Character Type Actors
 */
export class SentimentCharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // Inject shared template properties
      ...createBaseTemplate(),
      // Unique character data
      attributes: new fields.SchemaField({
        experience: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0, integer: true })
        }),
        speed: new fields.SchemaField({
          value: new fields.NumberField({ initial: 30, integer: true })
        }),
        // This stops your _getCharacterRollData crash from firing even if attributes is empty!
        level: new fields.SchemaField({
          value: new fields.NumberField({ initial: 1, integer: true })
        })
      }),
      // Keeps your loop safe in getRollData if empty
      abilities: new fields.ObjectField({ initial: {} }) 
    };
  }
}

/**
 * Data Model for NPC Type Actors
 */
export class SentimentNpcData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // Inject shared template properties
      ...createBaseTemplate(),
      // Unique NPC data
      attributes: new fields.SchemaField({
        experience: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0, integer: true })
        }),
        speed: new fields.SchemaField({
          value: new fields.NumberField({ initial: 30, integer: true })
        })
      })
    };
  }
}

/**
 * Shared System fields template (Equivalent to template.json Item "base")
 */
function createItemBaseTemplate() {
  return {
    description: new fields.HTMLField({ initial: "" })
  };
}

/**
 * Data Model for "color" Type Items
 */
export class SentimentColorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...createItemBaseTemplate(),
      hexColor: new fields.StringField({ initial: "#FFFF00" }),
      value: new fields.NumberField({ initial: 0, integer: true }),
      wounded: new fields.BooleanField({ initial: false }),
      locked: new fields.BooleanField({ initial: false }),
      expanded: new fields.BooleanField({ initial: false }),
      displayName: new fields.StringField({ initial: "color" }),
      isSwing: new fields.BooleanField({ initial: false }),
      swingValue: new fields.NumberField({ initial: 0, integer: true }),
      disabled: new fields.NumberField({ initial: 0, integer: true }),
      diceSize: new fields.StringField({ initial: "1d6" }),
      internalName: new fields.StringField({ initial: "" }),
      globalBonus: new fields.StringField({ initial: "" })
    };
  }
}

/**
 * Data Model for "gift" Type Items
 */
export class SentimentGiftData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...createItemBaseTemplate(),
      isPrimary: new fields.BooleanField({ initial: false }),
      showPrimary: new fields.BooleanField({ initial: false }),
      showLeveling: new fields.BooleanField({ initial: false }),
      isEquipped: new fields.BooleanField({ initial: false }),
      expanded: new fields.BooleanField({ initial: false }),
      primaryDescription: new fields.HTMLField({ initial: "" }),
      levelDescription: new fields.HTMLField({ initial: "" }),
      modifierIDs: new fields.ArrayField(new fields.StringField(), { initial: [] })
    };
  }
}

/**
 * Data Model for "giftbonus" Type Items
 */
export class SentimentGiftBonusData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // 'giftbonus' did not have the ["base"] template in your JSON, so we omit it here
      enabled: new fields.BooleanField({ initial: true }),
      colorID: new fields.StringField({ initial: "" }),
      bonus: new fields.StringField({ initial: "0" }),
      isPrimary: new fields.BooleanField({ initial: false })
    };
  }
}