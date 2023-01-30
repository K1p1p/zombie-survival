# Zombie survival
Simple multiplayer browser game

# Attention points
- Server must ignore tsconfig.json for it shall not be compiled as a module.<br>
Hence the '--skip-project' in package.json 'server' script

- Browser blocks local file access due CORS policy. Do not forget to run a local file server.<br>
    ``` sh
    npm run file-server
    ```

- Client TS imports need .js extension otherwise they won't be found during runtime.
