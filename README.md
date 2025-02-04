1. Install dependencies
    ```bash 
    npm install
    ```
2. Create a `.env` file in the root of the project and add the following environment variables. Watch the `.env.example` file for reference.

3. Run the project
    ```bash 
    npm run dev
    ```
4. API:
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
