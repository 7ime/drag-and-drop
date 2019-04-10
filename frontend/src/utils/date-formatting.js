export default function dateFormatting(date) {
    const YYYY = date.getFullYear()
    const MM = date.getMonth() + 1
    const DD = date.getDate()
    const HH = date.getHours()
    const mm = String(date.getMinutes()).padStart(2, '0');

    return YYYY + ' / ' + MM + ' / ' + DD + ' at ' + HH + ':' + mm;
}