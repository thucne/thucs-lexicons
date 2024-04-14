'use client';

import { useInit } from '@/hooks/use-init';

const Init = () => {
    const status = useInit();
    console.log(status);
    return <div></div>;
};

export default Init;
