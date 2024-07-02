"use client"

import React, { useEffect, useState } from "react"
import { subDays, subMonths, subWeeks } from "date-fns"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import "../styles/PieChartComponent.css"

interface EmailData {
  status: string
  createdAt: string
}

const COLORS = ["#1abc9c", "#e74c3c"]
// const COLORS = ['#28a745', '#f57363'];

const PieChartComponent: React.FC = () => {
  const [filter, setFilter] = useState("day")
  const [data, setData] = useState<EmailData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_EMAIL_STATS_URL
        if (!url) {
          throw new Error("API URL is not defined.")
        }
        const response = await fetch(url)
        const result: EmailData[] = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filterData = () => {
    let filteredData = data
    const now = new Date()

    if (filter === "day") {
      filteredData = data.filter(
        (item) => new Date(item.createdAt) >= subDays(now, 1)
      )
    } else if (filter === "week") {
      filteredData = data.filter(
        (item) => new Date(item.createdAt) >= subWeeks(now, 1)
      )
    } else if (filter === "month") {
      filteredData = data.filter(
        (item) => new Date(item.createdAt) >= subMonths(now, 1)
      )
    }

    return filteredData
  }

  const groupedData = filterData().reduce(
    (acc, item) => {
      if (item.status === "sent") {
        acc.success++
      } else if (item.status === "failed" || item.status.includes("failed")) {
        acc.failure++
      }
      return acc
    },
    { success: 0, failure: 0 }
  )

  const chartData = [
    { name: "Success", value: groupedData.success },
    { name: "Failure", value: groupedData.failure },
  ]

  const totalEmails = filterData().length
  const totalSuccess = groupedData.success
  const totalFailures = groupedData.failure

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="pie-chart-container">
      <div className="filter-container">
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <div className="chart-and-table">
        <ResponsiveContainer width="50%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="summary-table">
          <table>
            <tbody>
              <tr>
                <th>Total Emails</th>
                <td>{totalEmails}</td>
              </tr>
              <tr>
                <th>Total Success</th>
                <td>{totalSuccess}</td>
              </tr>
              <tr>
                <th>Total Failures</th>
                <td>{totalFailures}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PieChartComponent
