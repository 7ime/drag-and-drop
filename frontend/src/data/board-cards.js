import { randomDateInISOFormat, randomInteger, dateFormatting } from '../utils';

import text from './random-text';

const arrHumidityLevel = ['base', 'light', 'middle', 'high'];

export default function getCards(countCards, prefixID) {
    const cards = [];

    for(let i = 0; i < countCards; i++) {
        const card = {
            id: 'card_' + prefixID + '_' + i,
            title: getRandomText(randomInteger(0 , 50), randomInteger(8, 15)),
            desc: getRandomText(randomInteger(0 , 50), randomInteger(30, 150)),
            date: dateFormatting(new Date(randomDateInISOFormat())),
            level: arrHumidityLevel[randomInteger(0 , arrHumidityLevel.length-1)]
        }

        cards.push(card);
    }

    return cards;
}

function getRandomText(from, length) {
    const randomText = text.substr(from, length);

    return randomText.replace(/^\s\s*/, '');
}