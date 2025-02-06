import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 1000 },
    { duration: '1m', target: 1000 },
    { duration: '30s', target: 0 },
  ],
};

const largePayload = JSON.stringify({
  data: 'a'.repeat(1024 * 100),
});

export default function () {
  const url = 'http://localhost:3000/topics/test-topic';
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  http.post(url, largePayload, params);
  
  sleep(0.001);
}
