import { arrCols } from '../data';

const initState = [
    ...arrCols
]

const boardData = (state = initState, action) => {

    switch (action.type) {
        case 'BOARD_DATA_UPDATE': {
            return [
                ...action.payload
            ]
        }
        default:
            return state;
    }
}

export default boardData;