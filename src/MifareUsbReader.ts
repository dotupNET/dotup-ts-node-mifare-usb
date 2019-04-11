import { EventEmitter } from 'events';
import { HID } from 'node-hid';

const charMap = [
  '', '', '', '',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '\n'
]

// moto new HID(65535, 53);

export enum MifareUsbReaderEvents {
  'error' = 'error',
  'data' = 'data'
}

export class MifareUsbReader extends EventEmitter {

  private currentBuffer: number[] = [];
  private hid: HID;

  start(vid: number, pid: number): void {

    if (this.hid !== undefined) {
      return;
    }

    this.hid = new HID(vid, pid);

    this.hid.on('data', (data: Buffer) => {

      const usedBytes = data.filter(v => v > 0);
      const no = this.toNumber(usedBytes);

      // 40 = \n
      if (no === 40) {
        this.emit(MifareUsbReaderEvents.data, this.currentBuffer.map(x => charMap[x]).join(''));
        this.currentBuffer = [];
      } else if (no !== undefined) {
        this.currentBuffer.push(no);
      }

    });

    this.hid.on('error', e => this.emit(MifareUsbReaderEvents.error, e));
  }

  stop() {
    if (this.hid === undefined) {
      return;
    }

    this.hid.close();
    this.hid = undefined;
  }

  toNumber(arr: Uint8Array) {
    let buffer = Buffer.from(arr);
    return buffer.readUIntBE(0, arr.length);
  }

}
