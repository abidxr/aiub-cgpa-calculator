import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// --- Helper function to calculate KPIs ---
const calculateKpis = (courses) => {
  if (!courses || courses.length === 0) {
    return {
      totalCourses: 0,
      totalCredits: 0,
      cgpa: "N/A",
      highestGrade: "N/A",
      mostCommonGrade: "N/A",
      semesterGpas: [],
    };
  }

  const gradePoints = {
    "A+": 4.0,
    A: 3.75,
    "B+": 3.5,
    B: 3.25,
    "C+": 3.0,
    C: 2.75,
    "D+": 2.5,
    D: 2.25,
    F: 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;
  const gradeCounts = {};
  const semesterData = {};

  courses.forEach((course) => {
    const points = gradePoints[course.grade] * course.creditHours;
    totalPoints += points;
    totalCredits += course.creditHours;
    gradeCounts[course.grade] = (gradeCounts[course.grade] || 0) + 1;

    // Calculate per-semester GPA
    if (course.semester) {
      if (!semesterData[course.semester]) {
        semesterData[course.semester] = { points: 0, credits: 0 };
      }
      semesterData[course.semester].points += points;
      semesterData[course.semester].credits += course.creditHours;
    }
  });

  const cgpa =
    totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";

  const mostCommonGrade = Object.keys(gradeCounts).reduce((a, b) =>
    gradeCounts[a] > gradeCounts[b] ? a : b
  );

  const gradeOrder = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];
  const highestGrade = gradeOrder.find((grade) => gradeCounts[grade] > 0);

  // Calculate semester GPAs
  const semesterGpas = Object.keys(semesterData)
    .sort()
    .map((semester) => ({
      semester,
      gpa:
        semesterData[semester].credits > 0
          ? (
              semesterData[semester].points / semesterData[semester].credits
            ).toFixed(2)
          : "N/A",
    }));

  return {
    totalCourses: courses.length,
    totalCredits,
    cgpa,
    highestGrade,
    mostCommonGrade,
    semesterGpas,
  };
};

export default function Analytics({ courses, isDark }) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <div className="mt-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md text-gray-700 dark:text-gray-300 text-center">
        No course data available for analytics. Add some courses to see charts!
      </div>
    );
  }

  // ---------- Data Processing ----------
  const kpis = calculateKpis(courses);

  const gradeOrder = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];
  const gradeCounts = courses.reduce((acc, course) => {
    acc[course.grade] = (acc[course.grade] || 0) + 1;
    return acc;
  }, {});

  const sortedGrades = gradeOrder.filter((g) => gradeCounts[g]);

  const gradeDistributionData = {
    labels: sortedGrades,
    datasets: [
      {
        label: "Number of Courses",
        data: sortedGrades.map((grade) => gradeCounts[grade]),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Heatmap Data: Grades vs Credit Hours
  const creditHours = [...new Set(courses.map((c) => c.creditHours))].sort(
    (a, b) => a - b
  );
  const heatmapData = {
    labels: sortedGrades,
    datasets: creditHours.map((credit) => ({
      label: `${credit} Credit(s)`,
      data: sortedGrades.map((grade) => {
        const count = courses.filter(
          (c) => c.grade === grade && c.creditHours === credit
        ).length;
        return count;
      }),
      backgroundColor: `rgba(255, 99, 132, ${
        0.2 + (creditHours.indexOf(credit) * 0.3) / creditHours.length
      })`,
    })),
  };

  // ---------- Chart Options Generator ----------
  const getChartOptions = (titleText, xAxisLabel, yAxisLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: isDark ? "#E5E7EB" : "#1F2937" },
      },
      title: {
        display: true,
        text: titleText,
        color: isDark ? "#F9FAFB" : "#111827",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          color: isDark ? "#D1D5DB" : "#374151",
        },
        ticks: { color: isDark ? "#D1D5DB" : "#374151" },
        grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: isDark ? "#D1D5DB" : "#374151",
        },
        ticks: { color: isDark ? "#D1D5DB" : "#374151", precision: 0 },
        grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
        beginAtZero: true,
      },
    },
  });

  // Heatmap-specific options
  const heatmapOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: isDark ? "#E5E7EB" : "#1F2937" },
      },
      title: {
        display: true,
        text: "Grades vs Credit Hours",
        color: isDark ? "#F9FAFB" : "#111827",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Grade",
          color: isDark ? "#D1D5DB" : "#374151",
        },
        ticks: { color: isDark ? "#D1D5DB" : "#374151" },
        grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
      },
      y: {
        title: {
          display: true,
          text: "Number of Courses",
          color: isDark ? "#D1D5DB" : "#374151",
        },
        ticks: { color: isDark ? "#D1D5DB" : "#374151", precision: 0 },
        grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
        beginAtZero: true,
      },
    },
  };

  // Line chart-specific options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: isDark ? "#E5E7EB" : "#1F2937" },
      },
      title: {
        display: true,
        text: "GPA Trend Over Semesters",
        color: isDark ? "#F9FAFB" : "#111827",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Semester",
          color: isDark ? "#D1D5DB" : "#374151",
        },
        ticks: { color: isDark ? "#D1D5DB" : "#374151" },
        grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
      },
      y: {
        title: {
          display: true,
          text: "GPA",
          color: isDark ? "#D1D5DB" : "#374151",
        },
        ticks: { color: isDark ? "#D1D5DB" : "#374151" },
        grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
        min: 0,
        max: 4.0,
      },
    },
  };

  // --- KPI Card Component ---
  const KpiCard = ({ title, value, icon }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </p>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Analytics Dashboard
      </h2>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Current CGPA" value={kpis.cgpa} />
        <KpiCard title="Total Credits" value={kpis.totalCredits} />
        <KpiCard title="Highest Grade" value={kpis.highestGrade} />
        <KpiCard title="Most Common Grade" value={kpis.mostCommonGrade} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Grade Distribution */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
          <div className="h-80 w-full">
            <Bar
              data={gradeDistributionData}
              options={getChartOptions(
                "Grade Distribution",
                "Grade",
                "Number of Courses"
              )}
            />
          </div>
        </div>

        {/* Heatmap - Grades vs Credit Hours */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
          <div className="h-80 w-full">
            <Bar data={heatmapData} options={heatmapOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
