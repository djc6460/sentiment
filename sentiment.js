
import {sentiment} from "./module/config.js";
import SentimentItemSheet from "./module/sheets/SentimentItemSheet.js";
Hooks.once("init", function () {
    console.log("sentiment | Initializing Sentiment");

    CONFIG.sentiment = sentiment;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sentiment", SentimentItemSheet, { makeDefault:true});
});