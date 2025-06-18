import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();

    const goToAbout = () => {
        navigate('/APItest');
    };


    return <div>
        <button onClick={goToAbout}>소개 페이지로 이동</button>
    </div>;
}
