import { AxiosRequestConfig } from 'axios';
import { Agent } from 'https';

export function getAllowedIPs(): string[] {
  const allowedIps: string[] = [
    '172.31.4.234',
    '54.169.81.114', // enigma-dev IPs
    '172.31.5.158',
    '54.169.18.164',
    '54.179.242.211', // enigma-prod IPs
    '172.31.22.116',
    '52.77.233.82', // prod-enigma-tms
    '18.141.169.207', // prod-enigma-frontend
    '3.1.27.225', // prod-enigma-common
    '127.0.0.1',
  ];

  if (process.env.NODE_ENV !== 'production') {
    allowedIps.push('localhost');
    allowedIps.push('127.0.0.1');
  }

  return allowedIps;
}

export function getAxiosRequestConfig(rejectUnauthorized = false): AxiosRequestConfig {
  return {
    httpsAgent: new Agent({ rejectUnauthorized }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
