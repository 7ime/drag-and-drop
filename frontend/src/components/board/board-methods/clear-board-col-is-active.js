export function clearBoardColIsActive() {
    const cols = document.querySelector('.board').querySelectorAll('.board-col');

    for(let i = 0; i < cols.length; i++) {
        cols[i].classList.remove('is_active');
    }
}