export function handleDragLeave(e)  {
    this.countForDragEnterLeave--;

    if(this.countForDragEnterLeave === 0) {
        this.clearBoardColIsActive();
    }     
}
