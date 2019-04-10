export function handleDrag(e) {
    const dragCard = e.target;

    if(!dragCard.classList.contains('is_hidden')) {
        const parentDragCard = dragCard.parentNode;

        dragCard.classList.add('is_hidden');
        parentDragCard.insertBefore(this.createStub(null), dragCard);

        return false;
    }
    
    const underElem = document.elementFromPoint(e.clientX, e.clientY);
    const underCard = underElem.closest('.card');

    if(underCard) {
        const parentUnderCard = underCard.parentNode;
        const underCardHeight = underCard.clientHeight;
        const { top } = underCard.getBoundingClientRect();

        if(underCard.nextElementSibling.classList.contains('card-list-fill-js')) {
            if(Math.round(top + (underCardHeight / 2)) < e.clientY) {
                this.removeStub();
                parentUnderCard.insertBefore(this.createStub('last'), underCard.nextElementSibling);
                return false;
            }
        }

        const underCardId = underCard.getAttribute('data-card-id');

        this.removeStub();
    
        parentUnderCard.insertBefore(this.createStub(underCardId), underCard);

    } else {
        if(underElem && underElem.classList.contains('card-list-fill-js')) {
            const parentUnderCard = underElem.parentNode;

            this.removeStub();
        
            parentUnderCard.insertBefore(this.createStub('last'), underElem);
        }
    }
}