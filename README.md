1. Create a `.env` file in the root of the project and add the following environment variables. Watch the `.env.example` file for reference.
2. Up redis cluster
    ```bash
    docker-compose up -d
    ```

3. Install dependencies
    ```bash 
    npm install
    ```

4. Run the project
    ```bash 
    npm run dev
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
