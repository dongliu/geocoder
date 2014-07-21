module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'geocodecsv.js'],
      options: {
        globals: {
          console: true,
          module: true
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mocha']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'mochaTest']);

  grunt.registerTask('default', ['jshint']);

};