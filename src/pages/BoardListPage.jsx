import BoardList from '../components/board/BoardList';

export default function BoardListPage() {
  // enableSearch = true (검색 O)
  return (
    <div>
      <BoardList enableSearch={true} />
    </div>
  );
}
