
require('dotenv').config()

module.exports = {

    outputDir: process.env.VUE_APP_TODO_OUTDIR,

    devServer: {
      // remove vue-cli-service's progress output
      progress: false
    }, 
        
  }
