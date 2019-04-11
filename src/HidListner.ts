#!/usr/bin/env node
import { devices, Device } from 'node-hid';
import { MifareUsbReader, MifareUsbReaderEvents } from './MifareUsbReader';
import enquirer from 'enquirer';

class HidListner {

  async start(): Promise<void> {
    const devs = devices();
    const reader = new MifareUsbReader();

    const choices = devs.map(device => {
      return {
        name: `${device.product} - (vid:${device.vendorId} | pid:${device.productId})`,
        value: device
      };
    });

    const answer = await enquirer.prompt<Device>({
      type: 'select',
      name: 'device',
      message: 'Choose device',
      choices: choices
    });

    const vid = answer.vendorId;
    const pid = answer.productId;

    reader.on(MifareUsbReaderEvents.data, code => {
      console.log(`code: ${code}`);
    });

    reader.on(MifareUsbReaderEvents.error, error => {
      console.error(`error: ${error}`);
    });

    reader.start(vid, pid);
  }
}

const listner = new HidListner();
listner
  .start()
  .catch(e => console.error(e))
  ;
