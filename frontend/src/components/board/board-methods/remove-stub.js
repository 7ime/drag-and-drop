export function removeStub() {
    const stub = document.querySelector('.stub');

    if(stub) {
        stub.parentNode.removeChild(stub);
    }
}