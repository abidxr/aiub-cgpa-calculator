import React, { useState } from "react"; // Import useState for editing state
import ExcelJS from "exceljs";
import { toast } from "react-toastify";

export default function Home({
  courses,
  setCourses,
  courseName,
  setCourseName,
  grade,
  setGrade,
  creditHours,
  setCreditHours,
  loading,
  setLoading,
  isDark,
  calculateCGPA,
  calculateTotalCredits,
  previousCgpa,
  setPreviousCgpa,
  previousCredits,
  setPreviousCredits,
  handleClearAllData,
  handleSaveToExcel,
  handleFileUpload,
}) {
  // New state for tracking the currently edited row
  const [editingIndex, setEditingIndex] = useState(null);
  // New state for holding temporary edited course data
  const [editedCourse, setEditedCourse] = useState(null);

  const handleAddCourse = () => {
    if (!courseName || !grade || !creditHours) {
      toast.error("Please fill in course name, grade, and credit hours!");
      return;
    }

    setCourses([
      ...courses,
      { courseName, grade, creditHours: Number(creditHours) },
    ]);
    setCourseName("");
    setGrade("");
    setCreditHours(3);
    toast.success("Course added successfully!");
  };

  const handleDeleteCourse = (indexToDelete) => {
    // If we're editing this row, cancel editing first
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
      setEditedCourse(null);
    }
    const newCourses = courses.filter((_, index) => index !== indexToDelete);
    setCourses(newCourses);
    toast.info("Course deleted.");
  };

  // --- New functions for editing rows ---

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedCourse({ ...courses[index] }); // Copy the course data to a temp state for editing
  };

  const handleSaveEdit = (index) => {
    if (
      !editedCourse.courseName ||
      !editedCourse.grade ||
      !editedCourse.creditHours
    ) {
      toast.error("Please fill in all fields for the edited course!");
      return;
    }
    if (
      isNaN(editedCourse.creditHours) ||
      editedCourse.creditHours < 1 ||
      editedCourse.creditHours > 3
    ) {
      toast.error("Credit hours must be 1, 2, or 3.");
      return;
    }

    const updatedCourses = courses.map((course, i) =>
      i === index
        ? { ...editedCourse, creditHours: Number(editedCourse.creditHours) }
        : course
    );
    setCourses(updatedCourses);
    setEditingIndex(null); // Exit edit mode
    setEditedCourse(null); // Clear edited course state
    toast.success("Course updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null); // Exit edit mode
    setEditedCourse(null); // Clear edited course state
    toast.info("Edit cancelled.");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse({
      ...editedCourse,
      [name]: value,
    });
  };

  // --- End new functions for editing rows ---

  const Loader = () => (
    <div className="flex justify-center items-center mt-5">
      <div className="animate-spin rounded-full border-t-2 border-b-2 border-blue-500 w-12 h-12"></div>
    </div>
  );

  return (
    <>
      <h1 className="text-2xl font-bold text-blue-400">AIUB CGPA Calculator</h1>

      <div className="mt-5 flex flex-wrap gap-4 items-end p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold w-full text-gray-900 dark:text-gray-100 mb-2">
          Previous Academic Record
        </h2>
        <div className="flex flex-col flex-grow">
          <label
            htmlFor="previousCgpa"
            className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Previous CGPA
          </label>
          <input
            type="number"
            id="previousCgpa"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600"
            placeholder="e.g., 3.50"
            value={previousCgpa === 0 ? "" : previousCgpa}
            onChange={(e) => setPreviousCgpa(Number(e.target.value))}
            min="0"
            max="4"
            step="0.01"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label
            htmlFor="previousCredits"
            className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Previous Total Credits
          </label>
          <input
            type="number"
            id="previousCredits"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600"
            placeholder="e.g., 60"
            value={previousCredits === 0 ? "" : previousCredits}
            onChange={(e) => setPreviousCredits(Number(e.target.value))}
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="mt-5 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
        <p className="font-bold text-xl text-green-500">
          Current CGPA: {calculateCGPA()}
        </p>
        <p className="font-bold text-xl mt-1 text-green-500">
          Total Credits: {calculateTotalCredits()}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 items-end">
        <div className="flex flex-col">
          <label htmlFor="courseName" className="text-sm font-medium mb-1">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            placeholder="e.g., Data Structures"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            disabled={editingIndex !== null} // Disable input when editing
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="grade" className="text-sm font-medium mb-1">
            Grade
          </label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            disabled={editingIndex !== null} // Disable select when editing
          >
            <option value="" disabled>
              Select Grade
            </option>
            {["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="creditHours" className="text-sm font-medium mb-1">
            Credit Hours
          </label>
          <select
            id="creditHours"
            value={creditHours}
            onChange={(e) => setCreditHours(Number(e.target.value))}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded w-20 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            disabled={editingIndex !== null} // Disable select when editing
          >
            {[1, 2, 3].map((hours) => (
              <option key={hours} value={hours}>
                {hours}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200"
          disabled={editingIndex !== null} // Disable add button when editing
        >
          Add Course
        </button>
      </div>

      {courses.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">
                  Course Name
                </th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">
                  Grade
                </th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">
                  Credit Hours
                </th>
                <th className="p-3 border-b border-gray-300 dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {editingIndex === index ? (
                    // Render input fields when in edit mode
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          name="courseName"
                          value={editedCourse.courseName}
                          onChange={handleEditChange}
                          className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          name="grade"
                          value={editedCourse.grade}
                          onChange={handleEditChange}
                          className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          {[
                            "A+",
                            "A",
                            "B+",
                            "B",
                            "C+",
                            "C",
                            "D+",
                            "D",
                            "F",
                          ].map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          name="creditHours"
                          value={editedCourse.creditHours}
                          onChange={handleEditChange}
                          className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          {[1, 2, 3].map((hours) => (
                            <option key={hours} value={hours}>
                              {hours}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(index)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // Render static text when not in edit mode
                    <>
                      <td className="p-3">{course.courseName}</td>
                      <td className="p-3">{course.grade}</td>
                      <td className="p-3">{course.creditHours}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditClick(index)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={handleSaveToExcel}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition duration-200 flex-grow sm:flex-grow-0"
          disabled={loading || editingIndex !== null} // Disable when editing
        >
          {loading ? "Saving..." : "Download Data (Excel)"}
        </button>
        <label
          htmlFor="file-upload"
          className={`bg-purple-600 hover:bg-purple-700 text-white p-2 rounded cursor-pointer transition duration-200 flex-grow sm:flex-grow-0 text-center ${
            loading || editingIndex !== null
              ? "opacity-50 cursor-not-allowed"
              : "" // Disable when editing
          }`}
        >
          {loading ? "Loading..." : "Upload Data (Excel)"}
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept=".xlsx"
          disabled={loading || editingIndex !== null} // Disable when editing
        />
        <button
          onClick={handleClearAllData}
          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded transition duration-200 flex-grow sm:flex-grow-0"
          disabled={loading || editingIndex !== null} // Disable when editing
        >
          Clear All Data
        </button>
      </div>

      {loading && <Loader />}
    </>
  );
}
