export function clearAfterDropOrEnd() {
    this.countForDragEnterLeave = 0;
    
    this.clearBoardColIsActive();
    this.removeStub();

    const elem = document.querySelector('.card.is_hidden');

    if(elem) {
        elem.classList.remove('is_hidden');
    }
}