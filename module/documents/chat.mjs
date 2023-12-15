export function addChatListeners(html)
{
    html.on('click', '.btn-selectSwing', onSelectSwing);
}

function onSelectSwing(event)
{
    const card = event.currentTarget;
    let actor = game.actors.get(card.dataset.ownerId);
    let color = actor.items.get(card.dataset.itemId);
    let total = card.dataset.rolltotal;
    let rollVal = card.dataset.rollval;

    //check for a swing and remove it, then set new swing.
    for (const element of actor.items) {
        if(element.type == "color")
        {
            if(element.system.isSwing) {
                element.update({'system.isSwing':false});
            }
        }
    }
    color.update({'system.isSwing':true,'system.swingValue':rollVal});

    let chatContent = "Locked in to " + color.system.displayName;
    if(card.dataset.isRecover)
    {
        chatContent+= ". Total is now " + (parseInt(total) + parseInt(color.system.value)) + ".";
    }
    else
    {
        chatContent+= ".";
    }
    ChatMessage.create({
        user: game.user._id,
        content: chatContent,
        speaker: ChatMessage.getSpeaker()
        });

}