import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from 'react-icons/io';
import axios from 'axios';

function TaskManager() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Add your backend URL in .env
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Close Modals
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [backendUrl]);

  // Add task
  const handleAddTask = async () => {
    const newTask = { description: taskDescription, status: 'Pending' };
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit task
  const handleEditTask = async () => {
    const updatedTask = { description: taskDescription, status: taskStatus };
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/description`, updatedTask);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Update status
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/status`, { status });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Modal with selected task details
  const openEditModal = (task) => {
    setTaskId(task._id);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setShowEditModal(true);
  };

  return (
    <div className='container mt-5'>
      <h2>Task Manager</h2>
      <div className="d-flex justify-content-between align-items-center my-3">
        <h4>Tasks</h4>
        <IoIosAddCircle
          size={30}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowAddModal(true)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.description}</td>
              <td>
                <Form.Select
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </td>
              <td>
                <FiEdit
                  style={{ cursor: 'pointer' }}
                  onClick={() => openEditModal(task)}
                />
              </td>
              <td>
                <MdDelete
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteTask(task._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Task Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Edit task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTask}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TaskManager;
