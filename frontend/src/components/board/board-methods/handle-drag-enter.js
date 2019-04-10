export function handleDragEnter(e) {
    this.countForDragEnterLeave++;
    const col = e.currentTarget.closest('.board-col');

    this.clearBoardColIsActive();
    
    col.classList.add('is_active');

    return true;
}