const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lesson = require('../models/Lesson.model');

//  POST /api/projects  -  Creates a new project
router.post('/lessons', (req, res, next) => {
	const {teacher, title, styles,location,hours,days, firstDay,lastDay, price, details,cohost,image } = req.body;

	Lesson.create({ teacher, title, styles,location,hours,days, firstDay,lastDay, price, details,cohost,image })
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
});


router.get('/lessons', (req, res, next) => {
	Lesson.find().then((allLessons) => res.json(allLessons)).catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
// router.get('/projects/:projectId', (req, res, next) => {
// 	const { projectId } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(projectId)) {
// 		res.status(400).json({ message: 'Specified id is not valid' });
// 		return;
// 	}

// 	// Each Project document has `tasks` array holding `_id`s of Task documents
// 	// We use .populate() method to get swap the `_id`s for the actual Task documents
// 	Project.findById(projectId)
// 		.populate('tasks')
// 		.then((project) => res.status(200).json(project))
// 		.catch((error) => res.json(error));
// });

// PUT  /api/projects/:projectId  -  Updates a specific project by id
// router.put('/projects/:projectId', (req, res, next) => {
// 	const { projectId } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(projectId)) {
// 		res.status(400).json({ message: 'Specified id is not valid' });
// 		return;
// 	}

// 	Project.findByIdAndUpdate(projectId, req.body, { new: true })
// 		.then((updatedProject) => res.json(updatedProject))
// 		.catch((error) => res.json(error));
// });

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
// router.delete('/projects/:projectId', (req, res, next) => {
// 	const { projectId } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(projectId)) {
// 		res.status(400).json({ message: 'Specified id is not valid' });
// 		return;
// 	}

// 	Project.findByIdAndRemove(projectId)
// 		.then(() =>
// 			res.json({
// 				message: `Project with ${projectId} is removed successfully.`
// 			})
// 		)
// 		.catch((error) => res.json(error));
// });

module.exports = router;
