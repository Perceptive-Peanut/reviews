/* eslint-disable */
import http from 'k6/http';
import { check } from 'k6';


export default function () {
  const rnd = Math.floor(Math.random() * 1000012);
  const response = http.get(`http://localhost:3000/reviews/meta?product_id=${rnd}`);
  check(response, {
    'is status 200': (r) => r.status === 200,
    'transaction time < 50ms' : (r) => r.timings.duration < 50,
    'transaction time < 100ms' : (r) => r.timings.duration < 100,
    'transaction time < 200ms' : (r) => r.timings.duration < 200,
    'transaction time < 500ms' : (r) => r.timings.duration < 500,
    'transaction time < 1000ms' : (r) => r.timings.duration < 1000,
    'transaction time < 2000ms' : (r) => r.timings.duration < 2000
  });
}

export let options = {
  vus: 100,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01']
  }
};

// export default function () {
//   const rnd = Math.floor(Math.random() * 1000012);
//   const response = http.get(`http://localhost:3000/reviews?product_id=${rnd}`);
//   check(response, {
//     'is status 200': (r) => r.status === 200,
//     'transaction time < 50ms' : (r) => r.timings.duration < 50,
//     'transaction time < 100ms' : (r) => r.timings.duration < 100,
//     'transaction time < 200ms' : (r) => r.timings.duration < 200,
//     'transaction time < 500ms' : (r) => r.timings.duration < 500,
//     'transaction time < 1000ms' : (r) => r.timings.duration < 1000,
//     'transaction time < 2000ms' : (r) => r.timings.duration < 2000
//   });
// }