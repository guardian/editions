import { useEffect } from 'react';

const usePageTitle = (title: string | null) => {
    useEffect(() => {
        if (title) {
            window.document.title = title;
        }
    }, [title]);
};

export default usePageTitle;
