module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        os:['Open Sans', 'sans-serif']
      },

      colors: {
        //primary
        black: '#2B2F2D',
        white: '#F6F6F6',
        green: '#2EA06B',
        beige: '#FAE7D5',
        //accent
        'light-green' : '#E5F8EB',

        //border
        'stroke-grey': '#C9CDD4',

        //tags
        'tag-blue': {
          light: '#E5F3FF', 
          dark: '#0085FF',   
        },
        'tag-orange': {
          light: '#FFF4E8', 
          dark: '#FF9F2D',   
        },
        'tag-red': {
          light: '#FF3B3B', 
          dark: '#E92C2C',   
        },
        'tag-grey': {
          light: '#E8E8E8', 
          dark: '#585757',   
        },
        'tag-green': {
          light: '#E5F3FF', 
          dark: '#0085FF',   
        },
        
      },

    },
  },
  plugins: [],
}

