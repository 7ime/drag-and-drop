import React, { Component } from 'react';

import { withBoardContext } from '../hoc';
import Card from '../card'

import './card-list.scss';

class CardList extends Component {

    countForDragEnterLeave = 0;
    cardHeight = 0;

    underCardIdHistory = (...arg) => {
        const { provaider: { setUnderCardIdHistory, getUnderCardIdHistory }} = this.props;

        if(arg.length) {
            setUnderCardIdHistory(arg[0]);
        }
        
        return getUnderCardIdHistory();
    }

    handleDragEnter = (e) => {
        this.countForDragEnterLeave++;

        const col = e.currentTarget.closest('.board-col');
        col.classList.add('is_active');

        return true;
    }

    handleDragLeave = (e) => {
        this.countForDragEnterLeave--;

        if(this.countForDragEnterLeave === 0) {
            const col = e.currentTarget.closest('.board-col');
            col.classList.remove('is_active');
        }     
    }

    handleDragOver = (e) => {
        e.preventDefault();
        return false;
    }

    handleDrop = (e) => {
        e.preventDefault();

        const { data, customSetState } = this.props.provaider;

        const newCol = e.currentTarget.closest('.board-col').dataset.col;
        const oldCol = e.dataTransfer.getData('col');
 
        const dragCardID = e.dataTransfer.getData('card-id');

        const stub = document.querySelector('.stub');

        // const underCardID = this.underCardIdHistory();
        const underCardID = stub.getAttribute('data-under-card-id');
        console.log(typeof underCardID)

        let copyDragCard = null;

        if(newCol === oldCol) {

            const newData = data.map((item) => {
                const { name } = item;

                if(name === newCol && underCardID) {

                    item.cards.forEach((card, idx) => {
                        if(card.id === dragCardID) {
                            copyDragCard = card;

                            item.cards = [
                                ...item.cards.slice(0, idx),
                                ...item.cards.slice(idx+1)
                            ]
                        }
                    });

                    item.cards.forEach((card, idx) => {
                        if(card.id == underCardID) {
                            const newCards = [
                                ...item.cards.slice(0, idx),
                                copyDragCard,
                                ...item.cards.slice(idx)
                            ];

                            item.cards = newCards;
                        }
                    });

                    return item;
                } else {
                    return item;
                }
            })

            customSetState(newData);
        } else {
            const newDataWithoutDragCard = data.map((item) => {
                if(item.name === oldCol) {
                    const newCards = item.cards.filter((card) => {
      
                        if(card.id === dragCardID) {
                            copyDragCard = card;

                            return false;
                        } else {
                            return true;
                        }
                    })

                    item.cards = newCards;
                }
            
                return item;
            });

            const newData = newDataWithoutDragCard.map((item) => {
  
                if(item.name === newCol) {
                    if(underCardID) {
                        console.log(underCardID)
                        item.cards.forEach((card, idx) => {
                            if(card.id == underCardID) {
                                const newCards = [
                                    ...item.cards.slice(0, idx),
                                    copyDragCard,
                                    ...item.cards.slice(idx)
                                ];
    
                                item.cards = newCards;
                            }
                        });
                    } else {
                        console.log('push')
                        item.cards.push(copyDragCard);
                    }
                }

                return item;
            });

            customSetState(newData);
        }

        this.clearAfterDropOrEnd();

        return false;
    }

    createStub = (underCardId) => {
        const stub = document.createElement('div');
        stub.classList.add('stub');
        stub.style.minHeight = this.cardHeight + 'px';
        if(underCardId) {
            stub.setAttribute('data-under-card-id', underCardId)
        }
        

        return stub;
    }

    removeStub = () => {
        const stub = document.querySelector('.stub');

        if(stub) {
            stub.parentNode.removeChild(stub);
        }
    }

    handleDrag = (e) => {
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
            const underCardId = underCard.dataset.cardId;

            this.removeStub();
        
            parentUnderCard.insertBefore(this.createStub(underCardId), underCard);

        } else {
            if(underElem && underElem.classList.contains('card-list-fill-js')) {
                const parentUnderCard = underElem.parentNode;

                this.removeStub();
            
                parentUnderCard.insertBefore(this.createStub(null), underElem);
            }
        }


        
      
        // if(!document.querySelector('.card.is_move')) {
        //     this.underCardIdHistory(null);
        // }

        // if(underCard) {
        //     const cardId = e.target.dataset.cardId;
        //     const underCardId = underCard.dataset.cardId;

        //     const parent = underCard.closest('.card-list-container-js');

        //     const stub = document.createElement('div');
        //     stub.classList.add('stub');
        //     stub.style.height = this.cardHeight + 'px';

        //     parent.insertBefore(stub, underCard);

        //     if(cardId !== underCardId) {
        //         this.underCardIdHistory(underCardId);
 
        //         if(!underCard.classList.contains('is_move')) {
        //             this.clearIsMove();
        //             underCard.classList.add('is_move');

        //         } 
        //     } else {
        //         this.underCardIdHistory(null);
        //     } 

        // } else {
        //     const stub = document.querySelector('.stub');

        //     if(stub) {
        //         stub.parentNode.removeChild(stub);
        //     }

        //     if(underElem && underElem.classList.contains('card-list-fill-js')) {
        //         this.clearIsMove();
        //         this.underCardIdHistory(null);
        //     }
        // }
    }

    handleDragStart = (e) => {
        const card = e.target;
        const col = card.closest('.board-col');
        const dt = e.dataTransfer;

        card.classList.add('is_drag');

        this.cardHeight = card.offsetHeight;

        dt.effectAllowed='move';
        dt.setData('card-id', card.dataset.cardId);
        dt.setData('col', col.dataset.col);

        col.classList.add('is_from');
        col.classList.add('is_active');
    }

    handleDragEnd = (e) => {
        this.clearAfterDropOrEnd();
    }

    clearIsMove = () => {
        const elem = document.querySelector('.card.is_move');

        if(elem) {
            elem.classList.remove('is_move');
        }
    }

    clearIsDrag = () => {
        const elem = document.querySelector('.card.is_drag');

        if(elem) {
            elem.classList.remove('is_drag');
        }
    }

    clearAfterDropOrEnd = () => {
        this.countForDragEnterLeave = 0;

        this.clearIsMove();
        this.clearIsDrag();
        
        const cols = document.querySelector('.board').querySelectorAll('.board-col');

        for(let i = 0; i < cols.length; i++) {
            cols[i].classList.remove('is_active');
            cols[i].classList.remove('is_from');
        }

        this.removeStub();

        const elem = document.querySelector('.card.is_hidden');

        if(elem) {
            elem.classList.remove('is_hidden');
        }
    }

    getCards = (items) => {
        return items.map((item) => {
            const { id } = item;

            return(
                <React.Fragment key={id}>
                    <Card 
                        data={item}
                        data-card-id={id} 
                        draggable 
                        onDrag={this.handleDrag} 
                        onDragStart={this.handleDragStart}
                    />
                </React.Fragment>
            )
        })
    }

    render() {
        const { cards } = this.props;

        const elCards = this.getCards(cards);


        return(
            <div className="card-list"
                    >
                <div 
                    className="card-list__container-wrap scrollbar card-list-container-js"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave} 
                    onDragOver={this.handleDragOver} 
                    onDrop={this.handleDrop}
                    onDragEnd={this.handleDragEnd} 
                >
                    {elCards}
                    <div className="card-list__fill card-list-fill-js"></div>
                </div>
            </div>     
        )
    }
}

export default withBoardContext(CardList);