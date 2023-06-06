export default class SentimentItemSheet extends ItemSheet {
    get template() {
        return `systems/sentiment/templates/sheets/${this.item.type}-sheet.html`;
    }
    getData(){
        const baseData = super.getData();
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            data: baseData.item.system,
            config: CONFIG.sentiment
        }
        return sheetData;
    }
}