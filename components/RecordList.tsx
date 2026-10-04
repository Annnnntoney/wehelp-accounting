import type { AccountRecord } from '@/types/record'

interface RecordListProps {
  records: AccountRecord[]
  onDelete: (id: string) => void
}

export default function RecordList({ records, onDelete }: RecordListProps) {
  if (records.length === 0) {
    return <p className="record-list__empty">目前沒有紀錄</p>
  }

  return (
    <ul className="record-list">
      {records.map((record) => (
        <li key={record.id} className="record-list__item">
          <span className={record.amount > 0 ? 'amount amount--income' : 'amount amount--expense'}>
            {record.amount}
          </span>
          <span className="record-list__description">{record.description}</span>
          <button type="button" className="button" onClick={() => onDelete(record.id)}>
            刪除
          </button>
        </li>
      ))}
    </ul>
  )
}
