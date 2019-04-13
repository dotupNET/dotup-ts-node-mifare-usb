#!/usr/bin/env node
import commander from 'commander';
import enquirer from 'enquirer';
import { Device, devices } from 'node-hid';
import { MifareUsbReader } from './MifareUsbReader';

class HidListner {

  async start(vid?: number, pid?: number): Promise<void> {
    const devs = devices();

    if (vid === undefined || pid === undefined) {
      const choices = devs.map(device => {
        return {
          name: `${device.product} - (vid:${device.vendorId} | pid:${device.productId})`,
          message: `${device.manufacturer} ${device.product} - (vid:${device.vendorId} | pid:${device.productId})`,
          value: device
        };
      });

      const answer = await enquirer.prompt<{ device: Device }>({
        type: 'select',
        name: 'device',
        message: 'Choose HID device',
        choices: choices,
        result: (selection) => {
          const v = choices.find(x => x.name === selection);
          return <any>v.value;
        }
      });

      vid = answer.device.vendorId;
      pid = answer.device.productId;
    }

    const reader = new MifareUsbReader();

    reader.on('data', code => {
      console.log(`code: ${code}`);
    });

    reader.on('error', error => {
      console.error(`error: ${error}`);
    });

    reader.start(vid, pid);
  }
}

const args = commander
  .option('-v, --vid <vendorId>', 'Vendor id of the HID device')
  .option('-p, --pid <productId>', 'Product id of the HID device')
  .parse(process.argv);

const v = args.vid === undefined ? undefined : Number.parseInt(args.vid);
const p = args.pid === undefined ? undefined : Number.parseInt(args.pid);

const listner = new HidListner();
listner
  .start(v, p)
  .catch(e => console.error(e))
  ;
