import { EventEmitter } from "events";
import { HID } from "node-hid";
import { MifareUsbReaderEvents } from "./MifareUsbReaderEvents";

const charMap = [
  "", "", "", "",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "\n"
];

export class MifareUsbReader extends EventEmitter {

  private currentBuffer: number[] = [];
  private hid: HID | undefined;

  start(vid: number, pid: number): void {

    if (this.hid !== undefined) {
      return;
    }

    this.hid = new HID(vid, pid);

    this.hid.on("data", (data: Buffer) => {

      try {

        const usedBytes = data.filter((v, i, a) => v > 0 && a.length > 0);
        const no = this.toNumber(usedBytes);

        // 40 = \n
        if (no === 40) {
          this.emit("data", this.currentBuffer.map(x => charMap[x]).join(""));
          this.currentBuffer = [];
        } else if (no !== undefined) {
          this.currentBuffer.push(no);
        }

      } catch (error) {
        this.emit("error", error);
      }

    });

    this.hid.on("error", e => this.emit("error", e));
  }

  stop() {
    if (this.hid === undefined) {
      return;
    }

    this.hid?.close();
    this.hid = undefined;
  }

  toNumber(arr: Uint8Array): number | undefined {
    if (arr.length < 1) {
      return undefined;
    }
    const buffer = Buffer.from(arr);
    return buffer.readUIntBE(0, arr.length);
  }

  on(event: MifareUsbReaderEvents, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this;
  }

}
