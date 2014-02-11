module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      // uglify: {
      //    scripts: {
      //       options: {
      //          mangle: true
      //       },
      //       files: {
      //          'js/min/main.min.js': ['js/*.js']
      //       }
      //    }
      // },
      watch: {
         // scripts: {
         //    files: ['js/*.js'],
         //    tasks: ['uglify:scripts'],
         //    options: {
         //       event: ['changed']
         //    }
         // },
         templates: {
            files: ['templates/*.hbs', 'Gruntfile.js'],
            tasks: ['handlebars:compileTemplates'],
            options: {
               event: ['added', 'deleted', 'changed']
            }
         }
      },
      jshint: {
         scripts: {
            files: ['js/*.js'],
            options: {
               reporter: 'report/',
               reporterOutput: 'jshint_scripts_report.html'
            }
         },
         gruntfile: {
            files: ['Gruntfile.js'],
            options: {
               reporter: 'report/',
               reporterOutput: 'jshint_gruntfile_report.html'
            }
         }
      },
      handlebars: {
         compileTemplates: {
            options: {
               namespace: 'templates',
               processName: function(filePath) {
                  var sFilePath = filePath.split('/');
                  return sFilePath[sFilePath.length-1].split('.')[0];
               },
               amd: true
            },
            files: {
               'templates/templates.js': ['templates/*.hbs']
            },
         }
      }
   });


   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-handlebars');
   grunt.loadNpmTasks('grunt-contrib-watch');

   /* have to set the default task */
   grunt.registerTask('default', ['uglify', 'handlebars', 'jshint', 'watch']);

};