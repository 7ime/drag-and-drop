import { BOARD_DATA_UPDATE } from './types';

export const boardDataUpdate = (payload) => {
    return {
        type: BOARD_DATA_UPDATE,
        payload
    }
}