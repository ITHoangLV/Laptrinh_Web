import React, { useState, useEffect } from "react";
import "./style.css";

// Hàm để xác định màu sắc dựa trên ngày
function getColorByDueDate(date) {
    const currentDate = new Date();
    const taskDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((taskDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 2) {
        return "red"; // Còn 1-2 ngày
    } else if (daysRemaining <= 5) {
        return "orange"; // Còn 3-5 ngày
    } else {
        return "green"; // Còn hơn 6 ngày
    }
}

// Hàm tạo màu ngẫu nhiên
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Hàm để xác định thứ trong tuần
function getDayOfWeek(date) {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const taskDate = new Date(date);
    return days[taskDate.getDay()];
}

// Component để hiển thị từng nhiệm vụ
function Task({ task, onToggleComplete, onDeleteTask, updateTaskDate }) {
    const dueColor = getColorByDueDate(task.date);
    const borderColor = getRandomColor(); // Tạo màu viền ngẫu nhiên

    return (
        <div className="task">
            <input 
                type="checkbox"
                checked={task.complete}
                onChange={() => onToggleComplete(task.id)}
                className="custom-checkbox"  
                style={{ borderColor }} // Áp dụng màu viền ngẫu nhiên
            />
            <div className="task-content">
                <span className={`task-text ${task.complete ? 'completed' : ''}`}>
                    {task.name}
                </span>
                <div className="task-date-container">
                    <input 
                        type="date" 
                        value={task.date} // Hiển thị ngày hết hạn
                        onChange={(e) => updateTaskDate(task.id, e.target.value)} // Cập nhật ngày hết hạn
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                </div>
                <span className={`task-date ${dueColor}`}>
                    {getDayOfWeek(task.date)}
                </span>
            </div>
            <button onClick={() => onDeleteTask(task.id)} className="delete-button">
                <i className="fas fa-trash-alt"></i>
            </button>
        </div>
    );
}

// Component để nhập nhiệm vụ
function AddTask({ job, setJob, dueDate, setDueDate, addTask }) {
    return (
        <div className="add-task">
            <div 
                className="add-task-icon" 
                onClick={addTask} 
                role="button" 
                tabIndex={0} 
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <i className="fas fa-plus" style={{ color: 'orange', marginRight: '8px' }}></i>
                <input 
                    type="text" 
                    placeholder="Add task" 
                    value={job} 
                    onChange={e => setJob(e.target.value)} 
                    style={{ flexGrow: 1, border: 'none', outline: 'none', padding: '10px', borderRadius: '2px', boxShadow: '0 0 0 2px white inset' }}
                />
            </div>
            <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
            />
        </div>
    );
}

// Component chính để quản lý danh sách nhiệm vụ
function ToDoItem() {
    const [job, setJob] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [jobs, setJobs] = useState(() => {
        const storageJobs = JSON.parse(localStorage.getItem('jobs')) || [];
        return storageJobs;
    });

    useEffect(() => {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }, [jobs]);

    // Hàm thêm nhiệm vụ
    const addTask = () => {
        if (!job || !dueDate) return; // Kiểm tra nếu trường rỗng
        const newTask = {
            id: Date.now(),
            name: job,
            complete: false,
            date: dueDate // Lưu ngày hết hạn
        };
        setJobs(prevJobs => [...prevJobs, newTask]);
        setJob('');
        setDueDate('');
    };

    // Hàm toggle hoàn thành công việc
    const toggleComplete = (id) => {
        const updatedJobs = jobs.map(job =>
            job.id === id ? { ...job, complete: !job.complete } : job
        );
        setJobs(updatedJobs);
    };

    // Hàm xóa nhiệm vụ
    const deleteTask = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này không?")) {
            const updatedJobs = jobs.filter(job => job.id !== id);
            setJobs(updatedJobs);
        }
    };

    // Hàm cập nhật ngày hết hạn
    const updateTaskDate = (id, newDate) => {
        const updatedJobs = jobs.map(job =>
            job.id === id ? { ...job, date: newDate } : job
        );
        setJobs(updatedJobs);
    };

    return (
        <div className="todo-list">
            <h2>My work 🎯</h2>
            <AddTask 
                job={job}
                setJob={setJob}
                dueDate={dueDate}
                setDueDate={setDueDate}
                addTask={addTask}
            />
            <ul>
                {jobs.map((task) => (
                    <li key={task.id}>
                        <Task 
                            task={task} 
                            onToggleComplete={toggleComplete} 
                            onDeleteTask={deleteTask} 
                            updateTaskDate={updateTaskDate} // Truyền hàm cập nhật ngày hết hạn
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDoItem;
