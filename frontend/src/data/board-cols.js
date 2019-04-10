import { randomInteger } from '../utils';
import getCards from './board-cards';

const arrNameCols = ['To do', 'In progress', 'Ready for testing', 'Tested', 'Done'];

// const t1 = performance.now();

const arrCols = arrNameCols.map((item) => {
    const prefix = item.split(' ').join('_').toLocaleLowerCase();
    const newItem = {};

    newItem.id = 'col_' + prefix;
    newItem.title = item;

    newItem.cards = getCards(randomInteger(1, 5), prefix);

    return newItem;
});

// const t2 = performance.now();
// console.log(t2 - t1);

export default arrCols;