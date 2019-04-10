export function handleDragStart(e) {
    const card = e.target;
    const col = card.closest('.board-col');
    const dt = e.dataTransfer;

    this.cardHeight = card.offsetHeight;

    dt.effectAllowed='move';

    dt.setData('card-id', card.getAttribute('data-card-id'));
    dt.setData('col', col.getAttribute('data-col'));

    col.classList.add('is_active');
}