import "./App.css";
import React, {useEffect, useState, useRef} from "react";
import {InfinitySpin} from "react-loader-spinner"; // Ensure this is installed
import {v4 as uuidv4} from "uuid";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
 // State for tasks, quote, and loading status
 const [tasks, setTasks] = useState([]);
 const [quote, setQuote] = useState("");
 const [loading, setLoading] = useState(true);
 const [isEditing, setIsEditing] = useState(false); // State for edit mode
 const [editingTask, setEditingTask] = useState(null); // State for the task being edited

 const inputRef = useRef(null); // For task input field
 const deleteRef = useRef(null); // For delete all tasks button
 const deleteTaskRef = useRef(null); // For delete specific task button

 const [showScrollTopButton, setShowScrollTopButton] = useState(false);

 // Fetch a motivational quote
 const getQuote = async () => {
  try {
   const response = await fetch(
    "https://api.api-ninjas.com/v1/quotes?category=inspirational",
    {
     headers: {"X-Api-Key": "+zmEud3f+L5IwAOYL6w7ZQ==GYvEunaU6Ojv6JH7"},
    }
   );

   if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
   }

   const result = await response.json();
   setQuote(result[0].quote); // Update state with the fetched quote
  } catch (error) {
   console.error("Error:", error);
  } finally {
   setLoading(false); // Hide the spinner after fetching
  }
 };

 // Load tasks from localStorage
 const loadTasks = () => {
  const taskList = [];
  for (let i = 0; i < localStorage.length; i++) {
   taskList.push({
    key: localStorage.key(i),
    value: localStorage.getItem(localStorage.key(i)),
   });
  }
  setTasks(taskList);
 };

 // Add a new task
 const handleSubmit = () => {
  const taskInput = inputRef.current.value.trim();
  if (!taskInput) {
   toast.error("Task cannot be empty!");
   inputRef.current.focus();
   return;
  }

  if (isEditing) {
   if (editingTask.value === taskInput) {
    toast.info("No changes made.");
    inputRef.current.focus();
    return;
   }
   // Edit task if in edit mode
   localStorage.setItem(editingTask.key, taskInput);
   toast.success("Task updated successfully!");
   setIsEditing(false);
   setEditingTask(null);
  } else {
   // Add new task
   const key = uuidv4();
   localStorage.setItem(key, taskInput);
   toast.success("Task added successfully!");
  }

  inputRef.current.value = ""; // Clear input field
  inputRef.current.focus();
  loadTasks(); // Reload tasks after adding or editing
 };

 // Cancel edit mode
 const handleCancelEdit = () => {
  setIsEditing(false);
  setEditingTask(null);
  inputRef.current.value = ""; // Clear input field
  inputRef.current.focus();
 };

 // Delete all tasks
 const deleteAllTasks = () => {
  if (tasks.length === 0) {
   toast.info("No tasks available to delete!");
   inputRef.current.focus();
   return;
  }
  localStorage.clear();
  loadTasks(); // Reload tasks after clearing
  toast.warn("All Tasks deleted!");
  inputRef.current.focus();
 };

 // Delete a specific task
 const deleteTask = (key) => {
  localStorage.removeItem(key);
  loadTasks(); // Reload tasks after deletion
  toast.warn("Task deleted!");
  inputRef.current.focus();
 };

 // Edit a specific task
 const editTask = (task) => {
  inputRef.current.focus();
  setIsEditing(true);
  setEditingTask(task);
  inputRef.current.value = task.value; // Pre-fill the input with the task value
 };

 // UseEffect hook for initial loading
 useEffect(() => {
  inputRef.current.focus();
  loadTasks(); // Load tasks from localStorage when component mounts
  getQuote(); // Fetch a quote
 }, []);

 useEffect(() => {
  const handleScroll = () => {
   inputRef.current.focus();
   if (window.scrollY > 100) {
    setShowScrollTopButton(true); // Show button if scrolled more than 100px
   } else {
    setShowScrollTopButton(false); // Hide button if scrolled less than 100px
   }
  };

  window.addEventListener("scroll", handleScroll);

  // Cleanup the event listener on unmount
  return () => {
   window.removeEventListener("scroll", handleScroll);
  };
 }, []);

 // Scroll to the top when the button is clicked
 const scrollToTop = () => {
  window.scrollTo({
   top: 0,
   left: 0,
   behavior: "smooth", // This ensures smooth scrolling
  });
 };
 const handleKeyDown = (event) => {
  if (event.key === "Enter") {
   handleSubmit();
  }
 };
 return (
  <>
   {/* Toast Notifications */}
   <ToastContainer
    position="bottom-center"
    autoClose={2500}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
   />

   {/* Main Content */}
   <div className="bg-[url('./assets/images/leaf.jpg')] bg-cover bg-no-repeat bg-center bg-fixed">
    {/* Header */}
    <div className="flex w-full justify-between items-center rounded-b-full">
     <h1 className="text-white text-5xl m-5 cursor-pointer">Taskly</h1>
     <i
      ref={deleteRef}
      onClick={deleteAllTasks}
      className="brand fa-solid fa-trash text-xl bg-white m-5 cursor-pointer"
     ></i>
    </div>

    {/* Quote Section */}
    <div className="flex justify-center mt-3 mb-7 text-center">
     {loading ? (
      <InfinitySpin
       visible={true}
       width="200"
       color="#fff"
       ariaLabel="infinity-spin-loading"
      />
     ) : (
      <h3 className="text-white text-2xl p-4" data-aos="fade-up">
       "{quote}"
      </h3>
     )}
    </div>

    {/* Task Input Section */}
    <div className="task rounded-t-3xl bg-white flex justify-center">
     <div className="mt-12 text-center">
      <input
       onKeyDown={handleKeyDown}
       ref={inputRef}
       type="text"
       placeholder={isEditing ? "Edit Your Task" : "Enter Your Task"}
       className="p-2 border-2 rounded"
      />
      <button
       onClick={handleSubmit}
       className="hover:scale-90 transition-all duration-200 ease-in-out"
      >
       {isEditing ? "Update" : "Submit"}
      </button>
      {isEditing && (
       <button
        onClick={handleCancelEdit}
        className="hover:scale-90 transition-all duration-200 ease-in-out bg-red-200 text-red-700 rounded ml-3"
       >
        Cancel
       </button>
      )}
     </div>
    </div>

    {/* Task List Section */}
    <div className="min-h-screen flex flex-col items-center bg-white">
     {tasks.length === 0 ? (
      <p className="text-gray-500 mt-5 text-xl">
       No tasks available. Add a new task!
      </p>
     ) : (
      tasks.map((task) => (
       <div
        data-aos="fade-right"
        key={task.key}
        className="flex justify-between text-pretty text-start items-center p-5 bg-white shadow-lg border-2 w-4/5 mx-16 mt-5 max-md:flex-col rounded"
       >
        <h2 className="text-xl">{task.value}</h2>
        <div className="flex">
         <i
          onClick={() => editTask(task)}
          className="fa-regular fa-pen-to-square text-2xl m-3 cursor-pointer"
          style={{color: "#000"}}
         ></i>
         <i
          onClick={() => deleteTask(task.key)}
          className="fa-solid fa-trash text-2xl m-3 cursor-pointer"
          style={{color: "#000"}}
         ></i>
        </div>
       </div>
      ))
     )}
    </div>
   </div>

   {/* Footer */}
   <div className="footer flex w-auto text-white text-center justify-center items-center p-4 font-bold">
    Taskly | &copy; 2025
   </div>
   {showScrollTopButton && (
    <i
     data-aos="zoom-in"
     className="fa-solid fa-arrow-up animate-bounce"
     onClick={scrollToTop}
     style={{
      borderRadius: "100%",
      padding: "15px",
      fontSize: "20px",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
     }}
    ></i>
   )}
  </>
 );
}

export default App;
