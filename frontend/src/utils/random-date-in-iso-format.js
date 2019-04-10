import randomInteger from './random-integer';

export default function randomDateInISOFormat() {
    const YYYY = '201' + randomInteger(1, 9);

    const MM = String(randomInteger(1, 11)).padStart(2, '0');
    const DD = String(randomInteger(1, 29)).padStart(2, '0');
    const HH = String(randomInteger(0, 23)).padStart(2, '0');
    const mm = String(randomInteger(0, 59)).padStart(2, '0');
    const ss = String(randomInteger(0, 59)).padStart(2, '0');

    return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + mm + ':' + ss + 'Z';
}