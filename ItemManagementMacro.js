// Target Actors (not dynamic)
let actorList = ["Example PC", "The survivors"] 

//Create empty array for actor objects.
const actorNames = [] 

//Specify the item, could be substituted for any item name
let item = "Rations"; 

//Creates an empty list object for printing final output
let list = "" 

// Convert actor names in actorList to Actor Objects and add them to actorNames list
for (let actorString of actorList){ 
    let actor = game.actors.getName(actorString);
    actorNames.push(actor);
}

// Iterate through actorNames list and do stuff with items
for(let target of actorNames){
    // Looks for item in each target's inventory
    let getItem = await target.items.find(i=> i.name === item);

    // If it was not found OR the quanitity is somehow less than zero, complain.
    if((!getItem) || (getItem.data.data.quantity < 0)){
        list += `<li>${target.name} are out of ${item}</li>`;
    }
    
    // If it's found AND quantity is greater than 0, update the quantity by -1 and notify.
    if((await target.items.find(i=> i.name === item)) && (getItem.data.data.quantity > 0)){
        await getItem.update({"data.quantity" : getItem.data.data.quantity -1});
        list += `<li>${target.name} consumed 1 ${getItem.name}</li>`;
    }

    // If it's found AND quantity is less than 1, delete item & complain.
    if((await target.items.find(i=> i.name === item)) && (getItem.data.data.quantity < 1)){
        await getItem.delete();
        list += `<li>${target.name} ran out of ${getItem.name}</li>`;
    }
}

// Print all output of above in one message.
let the_message = `<ul>${list}</ul>`;
ChatMessage.create({
    content: the_message,
    speaker: ChatMessage.getSpeaker({alias: `Daily ${item}`})
});