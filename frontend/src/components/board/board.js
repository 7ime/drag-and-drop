import React, { Component } from 'react';
import { connect } from 'react-redux';

import { boardDataUpdate } from '../../actions';

import BoardCol from '../board-col';

import './board.scss';

class Board extends Component {
    
    countForDragEnterLeave = 0;
    cardHeight = 0;

    handleDragEnter = (e) => {
        this.countForDragEnterLeave++;
        const col = e.currentTarget.closest('.board-col');

        this.clearBoardColIsActive()
        
        col.classList.add('is_active');

        return true;
    }

    handleDragLeave = (e) => {
        this.countForDragEnterLeave--;

        if(this.countForDragEnterLeave === 0) {
            const col = document.querySelector('.board').querySelector('.board-col.is_active');
            col.classList.remove('is_active');
        }     
    }

    handleDragOver = (e) => {
        e.preventDefault();
        return false;
    }

    handleDrop = (e) => {
        e.preventDefault();

        const { boardData, boardDataUpdate } = this.props;

        const newColID = e.currentTarget.closest('.board-col').getAttribute('data-col'); // Индификатор колонки в которую перетянули карточку
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

                    return col;
                    
                } else {
                    // Возвращаем колонку, которая не изменилась.
                    return col;
                }
            })

            boardDataUpdate(newBoardData);

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

            boardDataUpdate(newBoardData);
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

    handleDragStart = (e) => {
        const card = e.target;
        const col = card.closest('.board-col');
        const dt = e.dataTransfer;

        card.classList.add('is_drag');

        this.cardHeight = card.offsetHeight;

        dt.effectAllowed='move';

        dt.setData('card-id', card.getAttribute('data-card-id'));
        dt.setData('col', col.getAttribute('data-col'));

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

    clearBoardColIsActive = () => {
        const cols = document.querySelector('.board').querySelectorAll('.board-col');

        for(let i = 0; i < cols.length; i++) {
            cols[i].classList.remove('is_active');
        }
    }

    clearAfterDropOrEnd = () => {
        this.countForDragEnterLeave = 0;

        this.clearIsMove();
        this.clearIsDrag();
        
        const cols = document.querySelector('.board').querySelectorAll('.board-col');

        for(let i = 0; i < cols.length; i++) {
            cols[i].classList.remove('is_active');
        }

        this.removeStub();

        const elem = document.querySelector('.card.is_hidden');

        if(elem) {
            elem.classList.remove('is_hidden');
        }
    }

    getEvents = () => {
        return {
            list: {
                onDragEnter: this.handleDragEnter,
                onDragLeave: this.handleDragLeave ,
                onDragOver: this.handleDragOver ,
                onDrop: this.handleDrop,
                onDragEnd: this.handleDragEnd ,
            },
            item: {
                onDrag: this.handleDrag,
                onDragStart: this.handleDragStart
            }
        }
    }

    getCols = (items) => {
        return items.map((item) => {
            return(
                <React.Fragment key={item.id}>
                    <BoardCol {...item} events={this.getEvents()}/>
                </React.Fragment>
            )
        });
    }

    render() {
        const cols = this.getCols(this.props.boardData);

        return(
            <div className="board">
                {cols}
            </div>
        )
    }
}

const mapStateToProps = ({ boardData }) => ({ boardData});

const mapDispatchToProps = (dispatch) => ({
    boardDataUpdate: (ownProps) => dispatch(boardDataUpdate(ownProps)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);