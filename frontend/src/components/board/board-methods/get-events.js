export function getEvents() {
    return {
        list: {
            onDragEnter: this.handleDragEnter,
            onDragLeave: this.handleDragLeave,
            onDragOver: this.handleDragOver,
            onDrop: this.handleDrop,
            onDragEnd: this.handleDragEnd
        },
        item: {
            onDrag: this.handleDrag,
            onDragStart: this.handleDragStart
        }
    }
}