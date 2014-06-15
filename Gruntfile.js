module.exports = function (grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: '.',
                    hostname: '0.0.0.0',
                    open: 'http://localhost:8080/example.html'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('example', 'Launch the example', ['connect:server:keepalive']);
};