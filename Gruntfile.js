module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  	watch : {
  		less : {
  			files : ["app/styles/*.less"],
  			tasks : ['css']
  		},
  		livereload : {
  			files : ['app/index.html', ".tmp/styles/*.css"],
  			options : {
  				livereload : true
  			}
  		}
  	},
  	less : {
  		dev : {
  			files : {
  				".tmp/styles/main.css" : "app/styles/main.less" // Destionation : source
  			}
  		}
  	},
  	autoprefixer: {
  		dev : {
  			files : {
  				".tmp/styles/main.css" : ".tmp/styles/main.css" // Destionation : source
  			}
  		}
  	},
  	clean: {
	  clean: [".tmp"]
	},
  	connect : {
  		server : {
  			options : {
  				host : "localhost",
  				base : ['app', '.tmp'],
  				livereload : 35729
  			}
  		}
  	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['css']);
  grunt.registerTask('css', ['less', 'autoprefixer']);
  grunt.registerTask('server', ['clean', 'css', 'connect', 'watch']);

};