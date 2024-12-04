module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Your backend server address
        changeOrigin: true,
        secure: false, // Disable SSL verification if needed
      },
    },
  },
};