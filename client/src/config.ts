const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  cloudinaryUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
};

export default config; 