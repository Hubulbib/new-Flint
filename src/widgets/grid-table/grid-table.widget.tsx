import { Grid } from 'gridjs-react'
import './grid-table.style.css'

export type IDataTable = string | number | Date

export const GridTableWidget = ({
  onClick,
  data = [],
  columns = [],
}: {
  onClick: any
  data: IDataTable[][]
  columns: string[]
}) => {
  return (
    <Grid
      style={{
        table: {
          border: '1px solid rgba(0, 98, 255, 0.3)',
        },
        td: {},
        th: {
          backgroundColor: 'rgba(0, 98, 255, 0.3)',
          color: 'rgba(0, 98, 255, 1)',
        },
        footer: {
          backgroundColor: 'rgba(0, 98, 255, 0.7)',
        },
      }}
      data={data}
      columns={columns}
      sort={true}
      pagination={{
        limit: 8,
      }}
      search={true}
      // @ts-ignore
      eventEmitter={{
        emit(event, ...args: any[]) {
          if (event === 'rowClick') {
            onClick(args[1]._cells.map((el: { data: any }) => el.data))
            //navigate(`/employee-base/${args[1]._cells[0].data}`)
          }
          return true
        },
      }}
    />
  )
}
