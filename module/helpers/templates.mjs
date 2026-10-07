/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  const templatePaths = [
    // You MUST include your core layouts and sub-partials here
    "systems/sentiment/templates/actor/actor-character-sheet.html",
    "systems/sentiment/templates/actor/actor-npc-sheet.html",
    "systems/sentiment/templates/actor/parts/actor-summary.html",
    "systems/sentiment/templates/actor/parts/actor-gifts.html"
  ];
  return loadTemplates(templatePaths);
};