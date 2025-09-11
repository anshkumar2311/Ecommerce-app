import React from 'react'

function PageTitle({ title }) {
    React.useEffect(() => {
        document.title = title;
    }, [title])
    return null;
}

export default PageTitle
