"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function BarChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Haircut", "Facial", "Smoothing", "Keratin", "Waxing", "Makeup"],
        datasets: [
          {
            label: "Number of Appointments",
            data: [25, 18, 12, 8, 15, 22],
            backgroundColor: [
              "rgba(246, 173, 225, 0.7)",
              "rgba(199, 146, 234, 0.7)",
              "rgba(246, 173, 225, 0.7)",
              "rgba(199, 146, 234, 0.7)",
              "rgba(246, 173, 225, 0.7)",
              "rgba(199, 146, 234, 0.7)",
            ],
            borderColor: [
              "rgba(246, 173, 225, 1)",
              "rgba(199, 146, 234, 1)",
              "rgba(246, 173, 225, 1)",
              "rgba(199, 146, 234, 1)",
              "rgba(246, 173, 225, 1)",
              "rgba(199, 146, 234, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
