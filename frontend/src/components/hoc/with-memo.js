import React from 'react';

const withMemo = (Wrapped) => {
    return React.memo(Wrapped)
};

export default withMemo;