import React, { useRef } from 'react';
import styles from './FileUploader.module.css';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUploader({ onChange }) {
  const [files, setFiles] = React.useState([]);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = useRef();

  const handleFiles = (fileList) => {
    let newFiles = Array.from(fileList);
    // 용량 체크 & 중복 제거
    newFiles = newFiles.filter(file => {
      if (file.size > MAX_SIZE) {
        alert(`"${file.name}" 파일은 10MB를 초과할 수 없습니다.`);
        return false;
      }
      // 중복방지(이름+크기)
      if (files.find(f => f.name === file.name && f.size === file.size)) {
        return false;
      }
      return true;
    });
    const merged = [...files, ...newFiles];
    setFiles(merged);
    onChange(merged);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);

  const onInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange(next);
  };

  return (
    <div className={styles.uploaderRoot}>
      <div
        className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current.click()}
        tabIndex={0}
      >
        {files.length === 0
          ? <span>여기로 파일을 드래그하거나 클릭해서 첨부</span>
          : <span>{files.length}개 파일 첨부됨</span>}
      </div>
      <input
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={onInputChange}
      />
      <div className={styles.fileList}>
        {files.map((file, idx) => (
          <div className={styles.fileBox} key={file.name + file.size}>
            {file.type.startsWith('image/') &&
              <img className={styles.thumb} src={URL.createObjectURL(file)} alt="thumb" />}
            <span className={styles.fileName}>{file.name}</span>
            <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); removeFile(idx); }} type="button">&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
}
