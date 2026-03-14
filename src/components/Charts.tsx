import React from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
)

type LineProps = React.ComponentProps<typeof Line>
type BarProps = React.ComponentProps<typeof Bar>
type PieProps = React.ComponentProps<typeof Pie>

export function InflationSpendingChart(props: LineProps) {
  return <Line {...props} />
}

export function SavingsGrowthChart(props: LineProps) {
  return <Line {...props} />
}

export function AllocationPieChart(props: PieProps) {
  return <Pie {...props} />
}

export function IncomeSourcesChart(props: BarProps) {
  return <Bar {...props} />
}

