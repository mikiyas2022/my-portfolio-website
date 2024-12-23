import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Grid, Button } from '@mui/material';
import ProjectCard from '../projects/ProjectCard';
import ProjectForm from '../forms/ProjectForm';
import { RootState } from '../../redux/store';
import { setProjects } from '../../redux/slices/projectSlice';
import config from '../../config';

const Home = () => {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const { projects } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        dispatch(setProjects(data));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token, dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Projects
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setIsFormOpen(true)}
        sx={{ mb: 4 }}
      >
        Add New Project
      </Button>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      <ProjectForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </Container>
  );
};

export default Home; 