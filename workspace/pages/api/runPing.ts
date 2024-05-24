import { NextApiRequest, NextApiResponse } from 'next';
const exec = require('child_process').exec;
const runPing = async () => {
  for (var ping_id = 2; ping_id < 255; ping_id++) {
    exec('ping 111.111.11.' + ping_id + ' -n 1');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runPing();
  res.status(200).json({ message: 'Ping executed' });
}