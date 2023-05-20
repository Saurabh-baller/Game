import { TableType } from './TableType.js'
const keys = Object.keys(TableType)
const HORIZONTAL = keys[0]
const VERTICAL = keys[1]

export const HorizontalButtonTypes = ['TURQ_12', 'GRAY_12']
export const VerticalButtonTypes = [
  'TURQ_12',
  'GRAY_12',
  'PINK_LR',
  'YELLOW_LR',
  'ROAD_LR',
  'EARTH_LR',
  'TRIANGLE_LR'
]

export const TableButtonsTypes = [
  {
    TURQ_12: {
      type: 'turq12',
      forTable: [HORIZONTAL, VERTICAL],
    },

    GRAY_12: {
      type: 'gray12',
      forTable: [HORIZONTAL, VERTICAL],
    },

    PINK_LR: {
      type: 'pinkLR',
      forTable: [VERTICAL],
    },

    YELLOW_LR: {
      id: 4,
      type: 'yellowLR',
      forTable: [VERTICAL],
    },

    ROAD_LR: {
      type: 'roadLeft',
      forTable: [VERTICAL],
    },

    EARTH_LR: {
      type: 'earthLeft',
      forTable: [VERTICAL],
    },

    TRIANGLE_LR: {
      type: 'triangleLeft',
      forTable: [VERTICAL],
    },
  },
]
