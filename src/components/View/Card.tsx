import {Item, Asset} from '@types'
import React, {CSSProperties, ReactNode, Ref, forwardRef, memo} from 'react'
import {VariableSizeGrid, GridOnItemsRenderedProps} from 'react-window'
import {Box} from 'theme-ui'

import useKeyPress from '../../hooks/useKeyPress'
import CardItem from '../Item/Card'

type Props = {
  height: number
  items: Item[]
  itemCount: number
  onItemsRendered: (props: GridOnItemsRenderedProps) => any
  selectedAssets?: Asset[]
  width: number
}

type VirtualCellProps = {
  columnIndex: number
  data: Record<string, any>
  rowIndex: number
  style: CSSProperties
}

const innerElementType = (props: {children: ReactNode; style: CSSProperties}) => {
  const {children, style} = props
  return (
    <Box
      sx={{
        mx: 'auto',
        position: 'relative',
        width: style.width
      }}
    >
      <div style={style}>{children}</div>
    </Box>
  )
}

const VirtualCell = memo(({columnIndex, data, rowIndex, style}: VirtualCellProps) => {
  const {columnCount, items, selectedIds, shiftPressed} = data
  const index = columnCount * rowIndex + columnIndex
  const item = items[index]
  const assetId = item?.asset?._id

  // Add padding to virtual cells
  const cellStyle = {
    ...style,
    left: Number(style.left) + 10,
    right: Number(style.left) + 10,
    top: Number(style.top) + 10,
    bottom: Number(style.top) + 10,
    width: Number(style.width) - 20,
    height: Number(style.height) - 20
  }

  return (
    <CardItem
      item={item}
      key={`grid-${assetId}`}
      selected={selectedIds.includes(assetId)}
      shiftPressed={shiftPressed}
      style={cellStyle}
    />
  )
})

const CardView = forwardRef((props: Props, ref: Ref<any>) => {
  const {height, items, itemCount, onItemsRendered, selectedAssets, width} = props

  const shiftPressed = useKeyPress('Shift')

  const selectedIds = (selectedAssets && selectedAssets.map(asset => asset._id)) || []

  const cardWidth = 260
  const cardHeight = 220

  const columnCount = Math.floor(width / cardWidth)
  const rowCount = Math.ceil(itemCount / columnCount)

  return (
    <VariableSizeGrid
      className="custom-scrollbar"
      columnCount={columnCount}
      columnWidth={() => cardWidth}
      height={height}
      innerElementType={innerElementType}
      itemData={{
        columnCount,
        items,
        selectedIds,
        shiftPressed
      }}
      onItemsRendered={onItemsRendered}
      ref={ref}
      rowCount={rowCount}
      rowHeight={() => cardHeight}
      style={{overflowX: 'hidden'}}
      width={width}
    >
      {VirtualCell}
    </VariableSizeGrid>
  )
})

export default CardView
