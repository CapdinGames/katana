module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
    
    // Metadata.
    meta: {
        basePath: '/',
        srcPath: 'sass',
        deployPath: 'css'
    },
    // compass
    compass: {                  // Task
      dev: {                    // Another target
        options: {
          sassDir: '<%= meta.srcPath %>',
          cssDir: '<%= meta.deployPath %>',
          debugInfo: true,
          environment: "development"
        }
      },
      prod: {                    // Another target
        options: {
          sassDir: '<%= meta.srcPath %>',
          cssDir: 'prod/<%= meta.deployPath %>',
          environment: "production"
        }
      }
    },
    // javascript compression. This task is only used for test results.
    
    uglify: {
      my_target: {
        files: {
          'prod/script/logoutput.min.js': ['script/libs/jQuery-2-0-3.js','script/plugins/jquery-datatables.js', 'script/log.js']
        }
      }
    },
    
    requirejs: {
      compile: {
        options: {
          baseUrl: 'script/',
          dir: "prod/",
          optimize: 'uglify',
          mainConfigFile:'script/main.js'
        }
      },
      compileLog: {
        options: {
          baseUrl: 'script/testresults',
          paths: {
          jquery: '../libs/jQuery-2-0-3', //Use this to minifiy jquery into your main
          //jquery: 'empty:' //Use this to continue using CDN loading
          
          datatables: '../plugins/jquery-datatables'
        },
          name: 'testresults-main',
          out: 'prod/script/testresults/testresults-main.js',
          removeCombined: false
        }
      }
    },
    // watch
    watch: {
      css: {
          files: [
              '<%= meta.srcPath %>/**/*.scss'
          ],
          tasks: ['compass:dev'],
          options: {
            livereload: true // refreshes the browser on changes install an extension for your browser for this
          }
          
      }
    }
  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch'); // run grunt watch for converting sass files to css in realtime
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Define your tasks here
  grunt.registerTask('default', ['compass']); 
  grunt.registerTask('default', ['uglify']); 
  grunt.registerTask('default', ['requirejs']); 
  grunt.registerTask('prod', ['compass:prod', 'requirejs:compile', 'requirejs:compileLog']); // grunt prod for production 

};