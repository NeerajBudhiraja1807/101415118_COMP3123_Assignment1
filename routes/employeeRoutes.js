const express = require('express');
const router = express.Router();
const Employee = require('/Users/neerajbudhiraja/Desktop/Semester 5/COMP3123 Full Stack Development/Assignments/COMP3123_Assignment1/models/Employee');
const mongoose = require('mongoose');

// GET /api/v1/emp/employees - Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/v1/emp/employees - Create new employees
router.post('/employees', async (req, res) => {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    try {
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee_id: newEmployee._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/v1/emp/employees/:eid - Get an employee by ID
router.get('/employees/:eid', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/v1/emp/employees/:eid - Update an employee by ID
router.put('/employees/:eid', async (req, res) => {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    try {
        const employee = await Employee.findByIdAndUpdate(req.params.eid, {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        }, { new: true });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/v1/emp/employees?eid=<employee_id> - Delete employee by ID
router.delete('/employees', async (req, res) => {
    try {
        const { eid } = req.query;

        if (!eid) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(eid)) {
            return res.status(400).json({ message: 'Invalid employee ID format' });
        }

        const employee = await Employee.findByIdAndDelete(eid);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Changed response to include the desired message
        res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;