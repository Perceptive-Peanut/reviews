/* eslint-disable */
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const rnd = Math.floor(Math.random() * 1000);
  const response = http.get('http://localhost:3000/reviews');
  check(response, {
    "is status 200": (r) => r.status === 200,
    "is id the same we asked": (r) => {
      const id = Number(r.json("id"));
      return id === rnd;
    }
  });
}

export let options = {
  vus: 1,
  duration: '5s',
  // thresholds: {
  //     'failed requests': ['rate<0.02'],
  //     http_req_duration: ['p(95)<500'],
  //     http_reqs: ['count>6000']
  // },
};