import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../card';

import { boardDataUpdate } from '../../actions';

import './card-list.scss';

class CardList extends Component {

    countForDragEnterLeave = 0;
    cardHeight = 0;

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

        const { boardData, dispatch } = this.props;

        const newColID = e.currentTarget.closest('.board-col').dataset.col; // Индификатор колонки в которую перетянули карточку
        const oldColID = e.dataTransfer.getData('col'); // Индификатор колонки из которой перетянули карточку

        const dragCardID = e.dataTransfer.getData('card-id'); // Индификатор перетягиваемой карточки

        const stub = document.querySelector('.stub'); // Заглушка

        const underCardID = stub.getAttribute('data-under-card-id'); // Индификатор карточки, которая находиться под перетягиваемой
        const cardIsLast = stub.getAttribute('data-card-is-last'); // Сигнализирует, что перетягиваемая карточка в конце

        let copyDragCard = null;

        // Если ID клонок совпадают, то значит, что карточка находится в той же колонке
        if(newColID === oldColID) {
            // Трансформируем старый массив всех данных доски
            const newBoardData = boardData.map((col) => {
                // Так как мы перебераем все колонки, то ищем ту колонку в которую перетянули карточку
                if(col.id === newColID) {
                    // Формируем массив катрточек без перетягиваемой. 
                    const cardsWithoutDragCard = col.cards.filter((card, idx) => {
                        if(card.id == dragCardID) {
                            copyDragCard = card;
                            return false;
                        } 

                        return true;
                    });

                    // Если есть id карточки, над которой расположиться перетаскиваемая карточка
                    if(underCardID) {
                        // Нужно получить индекс карточки, над которой расположиться перетаскиваемая карточка
                        const idxUnderCard = cardsWithoutDragCard.findIndex((item) => item.id == underCardID);

                        return {
                            ...col,
                            cards: [
                                ...cardsWithoutDragCard.slice(0, idxUnderCard),
                                copyDragCard,
                                ...cardsWithoutDragCard.slice(idxUnderCard)
                            ]
                        };
                    }

                    // Если перетаскиваемая карточка последняя, то ...
                    if(cardIsLast) {
                        return {
                            ...col,
                            cards: [
                                ...cardsWithoutDragCard,
                                copyDragCard,
                            ]
                        };
                    }
                    
                } else {
                    // Возвращаем колонку, которая не изменилась.
                    return col;
                }
            })

            dispatch(boardDataUpdate(newBoardData));

        } else {
            const newBoardDataWithoutDragCard = boardData.map((col) => {
                if(col.id === oldColID) {
                    const cardsWithoutDragCard = col.cards.filter((card) => {
                        if(card.id === dragCardID) {
                            copyDragCard = card;

                            return false;
                        }

                        return true;
                    })

                    return {
                        ...col,
                        cards: [
                            ...cardsWithoutDragCard
                        ]
                    }
                }
            
                return col;
            });

            const newBoardData = newBoardDataWithoutDragCard.map((col) => {
                if(col.id === newColID) {
                    if(underCardID) {
                        const idxUnderCard = col.cards.findIndex((card) => card.id == underCardID);

                        return {
                            ...col,
                            cards: [
                                ...col.cards.slice(0, idxUnderCard),
                                copyDragCard,
                                ...col.cards.slice(idxUnderCard),
                            ]
                        }
                    } else {
                        return {
                            ...col,
                            cards: [
                                ...col.cards,
                                copyDragCard
                            ]
                        }
                    }
                }

                return col;
            });

            dispatch(boardDataUpdate(newBoardData));
        }

        this.clearAfterDropOrEnd();

        return false;
    }

    createStub = (underCardId) => {
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
            
                parentUnderCard.insertBefore(this.createStub('last'), underElem);
            }
        }
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
            <div className="card-list">
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

const mapStateToProps = ({ boardData }) => ({ boardData});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//     boardDataUpdate: () => dispatch(boardDataUpdate(ownProps)) 
// })

export default connect(mapStateToProps)(CardList);