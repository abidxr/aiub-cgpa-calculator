import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ExcelJS from "exceljs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import new components
import Home from "./components/Home";
import Analytics from "./components/Analytics";
import GradingSystem from "./components/GradingSystem";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState("");
  const [creditHours, setCreditHours] = useState(3);
  const [loading, setLoading] = useState(false);

  // New state variables for previous CGPA and credits
  const [previousCgpa, setPreviousCgpa] = useState(0.0);
  const [previousCredits, setPreviousCredits] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem("cgpaCourses");
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
      // Load previous CGPA and credits from localStorage
      const storedPreviousCgpa = localStorage.getItem("previousCgpa");
      if (storedPreviousCgpa) {
        setPreviousCgpa(Number(storedPreviousCgpa));
      }
      const storedPreviousCredits = localStorage.getItem("previousCredits");
      if (storedPreviousCredits) {
        setPreviousCredits(Number(storedPreviousCredits));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      localStorage.removeItem("cgpaCourses");
      localStorage.removeItem("previousCgpa");
      localStorage.removeItem("previousCredits");
      toast.error("Failed to load saved data. It might be corrupted.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cgpaCourses", JSON.stringify(courses));
      // Save previous CGPA and credits to localStorage
      localStorage.setItem("previousCgpa", previousCgpa.toString());
      localStorage.setItem("previousCredits", previousCredits.toString());
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
      toast.error("Failed to save data automatically.");
    }
  }, [courses, previousCgpa, previousCredits]); // Add new dependencies

  const gradeToPoint = (grade) => {
    const mapping = {
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
    return mapping[grade] || 0;
  };

  const calculateCGPA = () => {
    let currentWeightedPoints = 0;
    let currentCreditHours = 0;

    courses.forEach((course) => {
      currentWeightedPoints += gradeToPoint(course.grade) * course.creditHours;
      currentCreditHours += course.creditHours;
    });

    // Calculate total weighted points and total credit hours including previous data
    const totalWeightedPoints =
      currentWeightedPoints + previousCgpa * previousCredits;
    const totalCreditHours = currentCreditHours + previousCredits;

    if (totalCreditHours === 0) return 0; // Avoid division by zero

    return (totalWeightedPoints / totalCreditHours).toFixed(2);
  };

  const calculateTotalCredits = () => {
    let currentCreditHours = 0;

    courses.forEach((course) => {
      currentCreditHours += course.creditHours;
    });

    // Calculate total weighted points and total credit hours including previous data
    const totalCreditHours = currentCreditHours + previousCredits;

    if (totalCreditHours === 0) return 0; // Avoid division by zero

    return totalCreditHours.toFixed(2);
  };

  // The rest of the functions (handleAddCourse, handleSaveToExcel, handleFileUpload,
  // handleDeleteCourse, handleClearAllData) will be passed to Home.jsx.
  // We'll modify handleClearAllData slightly to also clear previous CGPA/credits.
  const handleSaveToExcel = async () => {
    if (courses.length === 0) {
      toast.warn("No data to save to Excel!");
      return;
    }

    setLoading(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Courses");

      worksheet.columns = [
        { header: "Course Name", key: "courseName", width: 30 },
        { header: "Grade", key: "grade", width: 15 },
        { header: "Credit Hours", key: "creditHours", width: 15 },
      ];

      worksheet.addRows(courses);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cgpa_data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data saved to Excel!");
    } catch (error) {
      console.error("Error saving to Excel:", error);
      toast.error("Failed to save Excel file.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    if (!file.name.endsWith(".xlsx")) {
      toast.error("Please select a .xlsx file.");
      e.target.value = null;
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const buffer = evt.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          toast.error("No worksheet found in the Excel file.");
          setLoading(false);
          e.target.value = null;
          return;
        }

        const data = [];
        const validCreditHours = new Set([1, 2, 3]);

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          const courseNameValue = row.getCell(1).value;
          const gradeValue = row.getCell(2).value;
          const creditHoursValue = Number(row.getCell(3).value);

          if (
            courseNameValue &&
            gradeValue &&
            validCreditHours.has(creditHoursValue)
          ) {
            data.push({
              courseName: String(courseNameValue),
              grade: String(gradeValue).toUpperCase(),
              creditHours: creditHoursValue,
            });
          } else if (courseNameValue || gradeValue || creditHoursValue) {
            toast.warn(
              `Skipped a row due to invalid data (Row ${rowNumber}). Ensure credit hours are 1, 2, or 3.`
            );
          }
        });

        if (data.length === 0) {
          toast.warn(
            "No valid course data found in the Excel file. Ensure 'Course Name', 'Grade', and 'Credit Hours' (1, 2, or 3) are in the first three columns with valid data."
          );
        } else {
          toast.success(`Loaded ${data.length} courses from Excel!`);
        }
        setCourses(data);
        setPreviousCgpa(0.0);
        setPreviousCredits(0);
      } catch (error) {
        console.error("Error reading Excel file:", error);
        toast.error(
          "Failed to load Excel file. Please ensure it's a valid .xlsx file with 'Course Name', 'Grade', and 'Credit Hours' (1, 2, or 3) in the first three columns."
        );
      } finally {
        setLoading(false);
        e.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all course data and previous CGPA/credits? This cannot be undone."
      )
    ) {
      setCourses([]);
      setPreviousCgpa(0.0); // Clear previous CGPA
      setPreviousCredits(0); // Clear previous credits
      toast.info("All data cleared.");
    }
  };

  return (
    <div className="flex">
      <Sidebar toggleDarkMode={() => setIsDark(!isDark)} isDark={isDark} />

      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                courses={courses}
                setCourses={setCourses}
                courseName={courseName}
                setCourseName={setCourseName}
                grade={grade}
                setGrade={setGrade}
                creditHours={creditHours}
                setCreditHours={setCreditHours}
                loading={loading}
                setLoading={setLoading}
                isDark={isDark}
                calculateCGPA={calculateCGPA}
                calculateTotalCredits={calculateTotalCredits}
                previousCgpa={previousCgpa} // Pass previousCgpa
                setPreviousCgpa={setPreviousCgpa} // Pass setPreviousCgpa
                previousCredits={previousCredits} // Pass previousCredits
                setPreviousCredits={setPreviousCredits} // Pass setPreviousCredits
                handleClearAllData={handleClearAllData} // Pass the modified clear all
                handleSaveToExcel={handleSaveToExcel} // Pass these functions down
                handleFileUpload={handleFileUpload}
              />
            }
          />
          <Route
            path="/analytics"
            element={<Analytics courses={courses} isDark={isDark} />}
          />
          <Route
            path="/grading-system"
            element={<GradingSystem isDark={isDark} />}
          />
        </Routes>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
}
