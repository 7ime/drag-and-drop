export function createStub(underCardId) {
    const stub = document.createElement('div');
    stub.classList.add('stub');
    stub.style.minHeight = this.cardHeight + 'px';
    

    if(underCardId === 'last') {
        stub.setAttribute('data-card-is-last', true)

        return stub;
    }

    if(underCardId) {
        stub.setAttribute('data-under-card-id', underCardId)
    }

    return stub;
}