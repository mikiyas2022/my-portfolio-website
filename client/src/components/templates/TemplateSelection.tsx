import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
} from '@mui/material';
import { RootState } from '../../redux/store';
import { setSelectedTemplate } from '../../redux/slices/templateSlice';

const TemplateSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates } = useSelector((state: RootState) => state.template);
  const { token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    navigate('/login');
    return null;
  }

  const handleTemplateSelect = (templateId: string) => {
    dispatch(setSelectedTemplate(templateId));
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Choose Template
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {template.name}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={template.imageUrl}
                  alt={template.name}
                  sx={{ 
                    borderRadius: 1,
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleTemplateSelect(template.id)}
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                      backgroundColor: '#45a049',
                    },
                  }}
                >
                  Choose
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TemplateSelection; 