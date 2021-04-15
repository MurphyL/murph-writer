import { config } from 'dotenv';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';
import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

const { parsed: ENV_CONFIG } = config();

function serve() {
    let server;

    function toExit() {
        if (server) {
            server.kill(0);
        }
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            require('child_process').spawn('npm', ['run', 'backend'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
    },
    plugins: [
        svelte({
            compilerOptions: {
                dev: !production
            }
        }),
        css({ output: 'bundle.css' }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        json(),
        replace({
            preventAssignment: true,
            exclude: [ 'node_modules', 'public' ],
            _APP_ENV: JSON.stringify(Object.assign(ENV_CONFIG, {
                DEBUG: !production
            })),
        }),
        !production && serve(),
        !production && livereload({
            watch: 'public',
            port: 35740
        }),
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
