import { CustomError } from "./utils.js";

// Choose a random person from the list
const chooseRandom = list => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
};

// Pick a valid recipient
const chooseValidRecipient = (person, list, giftsGiven) => {
    const validRecipients = list.filter(p => !person.excluded.includes(p.id) && !giftsGiven.includes(p.id) && p.id !== person.id && (p.recipient === null || p.recipient !== person.id));
    if (validRecipients.length === 0) return null;
    return chooseRandom(validRecipients);
};

// Assign gifts
const assignGifts = (people, labels) => {
    let giftsGiven = [];
    let success = false;
    let count = 0;
    const maxAttempts = 100000; // Maximum of 100,000 attempts
    people.sort((a, b) => b.excluded?.length - a.excluded?.length); // Sort the list of participants based on the number of excluded

    // Loop until all gifts are drawn
    while (!success) {
        giftsGiven = [];
        people.forEach(person => person.recipient = null);
        count++;

        // Draw gifts
        for (let i = 0; i < people.length; i++) {
            const person = people[i];
            const recipient = chooseValidRecipient(person, people, giftsGiven);
            if (recipient) {
                giftsGiven.push(recipient.id);
                people[i].recipient = recipient.id;
            } else {
                break;
            }
        }

        success = giftsGiven.length === people.length;
        if (count > maxAttempts) throw new CustomError(labels['message.extraction.not.possible']);
    }

    return people;
};

// Draw the pairs
export const drawPairs = (participants, labels) => {
    try {
        const peopleWithGifts = assignGifts(participants, labels);
        return peopleWithGifts;
    } catch (error) {
        throw error.isCustom ? error : new CustomError(labels['message.extraction.error']);
    }
};