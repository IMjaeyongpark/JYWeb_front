import React, { useEffect, useState } from 'react';
import { connectTest } from '../api/user';

export default function APItest() {

    const [message, setMessage] = useState('');

    useEffect(() => {
        connectTest()
            .then((res) =>
                setMessage(res.data)
            )
            .catch((err) =>
                setMessage('API 호출 실패')
            );
    }, []);

    return <div>
        <h1>연결 테스트</h1>
        <h3>{message}</h3>
    </div>;
}
