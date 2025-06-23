export function formatBoardDate(datetimeString) {
    if (!datetimeString) return '';
    const date = new Date(datetimeString);
  
    const now = new Date();
    // 오늘 날짜 여부 확인
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  
    if (isToday) {
      // 시:분 2자리로 표시
      const hour = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${hour}:${min}`;
    } else {
      // 월.일 2자리로 표시
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}.${day}`;
    }
  }
  