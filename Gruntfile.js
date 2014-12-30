
module.exports = function(grunt) {
  // Project configuration.
grunt.initConfig({
  watch : {
    less : {
      files : ["app/styles/*.less"],
      tasks : ['css:dev']
    },
    scripts: {
      files: 'app/js/*.js',
      tasks: 'uglify:dev',
    },
    livereload : {
      files : ['app/index.html', ".tmp/styles/*.css", ".tmp/js/*.min.js"],
      options : {
        livereload : true
      }
    }
  },
  less : {
    all : {
      files : {
        ".tmp/styles/main.css" : "app/styles/main.less" // Destionation : source
      }
    }
  },
  autoprefixer: {
    all : {
      files : {
        ".tmp/styles/main.css" : ".tmp/styles/main.css" // Destionation : source
      }
    }
  },
  cssmin: {
    // Ne pas utiliser dev car bug, du coup concat sans mifiny en dessous
    dev: {
      files: {
        ".tmp/styles/main.min.css" : ["app/bower_components/normalize-css/*.css", ".tmp/styles/*.css"] 
      }
    },
    dist: {
      files: {
        "dist/styles/main.min.css" : ["app/bower_components/normalize-css/*.css", ".tmp/styles/*.css"] 
      }
    }
  },  
  concat_css: {
    // Remplace minify en dev sinon pb le css est dupliqué (bug) et du coup pas de mis a jour sans redemarage serveur
    options: {},
    dev: {
      src: ["app/bower_components/normalize-css/*.css", ".tmp/styles/main.css"],
      dest: ".tmp/styles/main.min.css"
    }
  },
  clean: {
    clean: [".tmp", "dist"]
  },
  connect : {
    server : {
      options : {
        host : "localhost",
        base : ['app', '.tmp'],
        livereload : 35729
      }
    }
  },
  imagemin: {                          // Task
    dist: {                          // Target
      options: {                       // Target options
        optimizationLevel: 3
      },
      files: [{
        expand: true,                  // Enable dynamic expansion
        cwd: 'app/',                   // Src matches are relative to this path
        src: ['img/**/*.{png,jpg,gif}'],   // Actual patterns to match
        dest: 'dist/'                  // Destination path prefix
      }]
    },
  },
  uglify: {
    dist: {
      files: [{
        'dist/js/app.min.js': ['app/js/*.js']
      }]
    },
    dev: {
      files: [{
        '.tmp/js/app.min.js': ['app/js/*.js']
      }]
    }
  },
  concat: {
    options: {
      separator: ';',
    },
    dist: {
      src: ['app/bower_components/**/*.min.js', 'app/vendor/*.min.js'],
      dest: 'dist/js/lib.min.js'
    },
    dev: {
      files: {
        '.tmp/js/lib.min.js' : ['app/bower_components/**/*.min.js', 'app/vendor/*.min.js'],
        '.tmp/js/app.min.js': ['app/js/*.js']
      }
    }
  },
  copy: {
    dist: {
      files: [

        // includes files within path and its sub-directories
        {expand: true, cwd:'app/', src: ['*.{php,html}'], dest: 'dist/'},
        {expand: true, cwd:'app/', src: ['json/**/*'], dest: 'dist/'},
      ]
    }
  }
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-concat-css');

  // Default task(s).
  grunt.registerTask('default', ['css']);
  grunt.registerTask('css:dev', ['less', 'autoprefixer', 'concat_css:dev']);
  grunt.registerTask('css:dist', ['less', 'autoprefixer', 'cssmin:dist']);
  grunt.registerTask('server', ['clean', 'css:dev', 'concat:dev', 'connect', 'watch']);
  grunt.registerTask('build', ['clean', 'css:dist', 'imagemin', 'concat:dist','uglify:dist' , 'copy:dist']);

};