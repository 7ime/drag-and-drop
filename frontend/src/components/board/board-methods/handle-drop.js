export function handleDrop(e) {
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
                    if(card.id === dragCardID) {
                        copyDragCard = card;
                        return false;
                    } 

                    return true;
                });

                // Если есть id карточки, над которой расположиться перетаскиваемая карточка
                if(underCardID) {
                    // Нужно получить индекс карточки, над которой расположиться перетаскиваемая карточка
                    const idxUnderCard = cardsWithoutDragCard.findIndex((item) => item.id === underCardID);

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
                    const idxUnderCard = col.cards.findIndex((card) => card.id === underCardID);

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