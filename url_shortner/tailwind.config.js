/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {
          backgroundImage: {
            'custom-image': "url('/bg.jpg')", // Define your custom background image
          },
        },
      },
    plugins: [require('flowbite/plugin')],
  }
  
  