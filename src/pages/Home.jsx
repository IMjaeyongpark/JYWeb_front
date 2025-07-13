import BoardList from '../components/board/BoardList';

export default function Home() {
  // enableSearch = false (검색 X)
  return (
    <div>
      <BoardList enableSearch={false} />
    </div>
  );
}
