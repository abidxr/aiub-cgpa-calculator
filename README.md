## Features

- Add courses with **letter grades** and **credit hours**.
- Calculate **semester GPA** and **cumulative CGPA**.
- **Visual analytics**: grade distribution, GPA trends over semesters.
- **Excel export/import**: save your courses and reload them later.
- **Dark mode** for a better user experience.
- Responsive and mobile-friendly design.
- Customizable **semester credit distribution** for trend calculations.

---

## Tech Stack

- **Frontend:** React, TailwindCSS, Chart.js
- **Backend:** Node.js (for Excel file operations)
- **Storage:** Excel file (no database needed)
- **Charts & Analytics:** Chart.js

## Core Features

1.Course Management

-Add courses with course name, letter grade, credit hours.

-Validate inputs (no duplicate entries, correct grade formats).

-Save/load data via Excel files.

2.CGPA Calculation

-Converts letter grades → grade points using your university’s grading scale.

Calculates:

-Semester GPA (weighted by credit hours).

-Cumulative CGPA (using previous CGPA + credits).

-Supports custom semester credit distribution (default 12–6–12, configurable by user).

3.Analytics Dashboard

KPI Cards: Show current CGPA, total credits, highest grade, most common grade.

\*Charts:

-Bar chart: Grade distribution across courses.

-Heatmap: Relationship between grades and credit hours.

4.Grading System Page

-Displays the letter grade → grade point mapping.

-Includes special grades (I, W, UW).

5.Dark Mode

-User can toggle between light and dark modes.

-Charts and UI dynamically adjust colors for readability.

🔹 Why It’s Useful

-Saves students from manual GPA calculations.

-Gives clear visual insights into academic strengths/weaknesses.

-Helps in planning future semesters to reach academic goals.

-Portable: No login required, simple Excel export/import for persistence.
