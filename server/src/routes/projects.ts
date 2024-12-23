import express from 'express';
import { Project } from '../models/Project';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all projects');
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching project:', req.params.id);
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// POST new project
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    console.log('Creating new project:', req.body);
    const { title, description, technologies, thumbnail } = req.body;
    const project = new Project({
      title,
      description,
      technologies,
      thumbnail,
      user: req.user.id
    });
    const savedProject = await project.save();
    console.log('Project created successfully:', savedProject);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// PUT update project
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    console.log('Updating project:', req.params.id);
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log('Project updated successfully:', updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// DELETE project
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    console.log('Deleting project:', req.params.id);
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await project.deleteOne();
    console.log('Project deleted successfully');
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router; 