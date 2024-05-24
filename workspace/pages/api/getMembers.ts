import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

const getArpData = async () => {
  const exec = require('child_process').exec;
  var cmd = 'arp -a > txt_json/arp.txt';
  exec(cmd);
};

const manageMemberCondition = async () => {
  await getArpData();
  const arp_text = fs.readFileSync("txt_json/arp.txt", 'utf8');
  const arp_list: string[] = arp_text.toString().split('\n');
  const current_ip_mac_list = arp_list.filter(data => data.startsWith('  111.111.11'));
  const current_ip_mac_json = current_ip_mac_list.map(ip_mac_set => {
    const part = ip_mac_set.trim().split(/\s+/);
    return { ip: part[0], mac: part[1] };
  });
  fs.writeFileSync("txt_json/ip_mac_list.json", JSON.stringify(current_ip_mac_json, null, 2), 'utf-8');

  const registered_mac_name_json = JSON.parse(fs.readFileSync('txt_json/database_mac_name.json', 'utf-8'));
  const current_member_list: { name: string }[] = [];
  registered_mac_name_json.forEach((registered_data: { mac: string; name: string }) => {
    current_ip_mac_json.forEach((current_data: { mac: string }) => {
      if (current_data.mac === registered_data.mac) {
        current_member_list.push({ name: registered_data.name });
      }
    });
  });
  fs.writeFileSync("txt_json/name_list.json", JSON.stringify(current_member_list, null), 'utf-8');
  return current_member_list.map(member => member.name);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await manageMemberCondition();
  res.status(200).json(data);
}
