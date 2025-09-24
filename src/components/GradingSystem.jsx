import React from "react";

const gradingScale = [
  { percent: "90 - 100", grade: "A+", point: "4.00" },
  { percent: "85 - < 90", grade: "A", point: "3.75" },
  { percent: "80 - < 85", grade: "B+", point: "3.50" },
  { percent: "75 - < 80", grade: "B", point: "3.25" },
  { percent: "70 - < 75", grade: "C+", point: "3.00" },
  { percent: "65 - < 70", grade: "C", point: "2.75" },
  { percent: "60 - < 65", grade: "D+", point: "2.50" },
  { percent: "50 - < 60", grade: "D", point: "2.25" },
  { percent: "< 50", grade: "F", point: "0.00" },
  { percent: "-", grade: "I (Incomplete)", point: "N/A" },
  { percent: "-", grade: "W (Withdrawal)", point: "N/A" },
  { percent: "-", grade: "UW (Unofficial Withdrawal)", point: "N/A" },
];

const GradingSystem = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🎓 Grading System
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Numerical %
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Letter Grade
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                Grade Point
              </th>
            </tr>
          </thead>
          <tbody>
            {gradingScale.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                  {item.percent}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center font-semibold">
                  {item.grade}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center">
                  {item.point}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        ⚡ Note: "I" = Incomplete, "W" = Withdrawal, "UW" = Unofficial
        Withdrawal. These do not affect GPA/CGPA.
      </p>
    </div>
  );
};

export default GradingSystem;
