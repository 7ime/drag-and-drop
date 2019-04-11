import { randomInteger } from '../utils';
import getCards from './board-cards';

const arrNameCols = ['To do', 'In progress', 'Ready for testing', 'Tested', 'Done'];


const arrCols = arrNameCols.map((item, idx, arr) => {
    const prefix = item.split(' ').join('_').toLocaleLowerCase();
    const newItem = {};

    newItem.id = 'col_' + prefix;
    newItem.title = item;

   
    if(idx === arr.length-1) {
        newItem.cards = [];
    } else {
        newItem.cards = getCards(randomInteger(2, 15), prefix);
    }

    return newItem;
});

export default arrCols;