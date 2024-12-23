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
    
    // Redirect based on template
    switch (templateId) {
      case 'template1': // Modern Portfolio
        navigate('/modern-portfolio');
        break;
      case 'template2': // Creative Portfolio
        navigate('/creative-portfolio');
        break;
      case 'template3': // Professional Portfolio
        navigate('/professional-portfolio');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Choose Template
        </Typography>
        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: '1200px', mx: 'auto' }}
        >
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
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
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2 }}
                  >
                    {template.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleTemplateSelect(template.id)}
                    sx={{ 
                      mt: 'auto',
                      backgroundColor: '#4CAF50',
                      '&:hover': {
                        backgroundColor: '#45a049',
                      },
                      py: 1.5,
                      fontWeight: 'bold',
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
    </Box>
  );
};

export default TemplateSelection; 