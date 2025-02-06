## Node v20.18.1

1. Install dependencies
    ```bash 
    npm install
    ```
   
2. Create an `.env` file in the project root. See the `.env.example` file for reference. For a successful start it is enough to move all variables and their values from `.env.example` to `.env`


3. Up redis cluster
    ```bash
    docker-compose up -d
    ```

4. Run the project
    ```bash 
    npm run start:dev
    ```
5. API:
   - Subscribe to topic:

    ```bash  
    curl -N \
    -H "Accept: text/event-stream" \
    -H "Cache-Control: no-cache" \
    'http://localhost:3000/topics/test-topic'
    ```
   
   - Post message to topic:
   
   ```bash  
   curl -X POST 'http://localhost:3000/topics/test-topic' \
   -H 'Content-Type: application/json' \
   -d '{"name": "John Doe", "email": "john@example.com", "message": "Hello World"}'
   ```
   
6. Install k6
    ```bash 
    sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get install k6
    ```
7. Run stress test
    ```bash 
    k6 run stress_test.js
    ```
   
8. Shut down docker containers
    ```bash 
    docker-compose down --volumes
    ```
