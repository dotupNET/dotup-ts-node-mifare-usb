# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

# dotup-ts-node-mifare-usb

## Description

## Installation

Requirements:
```shell
apt-get install libudev-dev
apt-get install libusb-dev
apt-get install libusb-1.0-0
apt-get install libusb-1.0-0-dev
```

>npm install -g dotup-ts-node-mifare-usb --unsafe-perm

>sudo visudo

add this line after the existing Defaults secure_path=... entry:
>Defaults !secure_path

access without root: Create file `codereader` in `/etc/udev/rules.d`
Product and vendor id is hex value
>SUBSYSTEM=="input", GROUP="input", MODE="0666"
>SUBSYSTEM=="usb", ATTRS{idVendor}=="`ffff`", ATTRS{idProduct}=="`35`", MODE:="666", GROUP="plugdev"
>KERNEL=="hidraw*", ATTRS{idVendor}=="`ffff`", ATTRS{idProduct}=="`35`", MODE="0666", GROUP="plugdev"

Activate the changes:
>sudo udevadm control --reload-rules

## Usage

List all HID devices
>hid-list

Listen to a HID device
>hid-listner -v 65535 -p 53

## Release Notes
### 1.0.3

Fixes/Features:
- hid-listner: device selector fails

### 1.0.2

Fixes/Features:
- Initial release

## License

MIT © [Peter Ullrich](https://github.com/dotupNET/)

**Enjoy!**

[npm-image]: https://badge.fury.io/js/dotup-ts-node-mifare-usb.svg
[npm-url]: https://npmjs.org/package/dotup-ts-node-mifare-usb
[travis-image]: https://travis-ci.org/dotupNET/dotup-ts-node-mifare-usb.svg?branch=master
[travis-url]: https://travis-ci.org/dotupNET/dotup-ts-node-mifare-usb
[daviddm-image]: https://david-dm.org/dotupNET/dotup-ts-node-mifare-usb.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/dotupNET/dotup-ts-node-mifare-usb
[coveralls-image]: https://coveralls.io/repos/dotupNET/dotup-ts-node-mifare-usb/badge.svg
[coveralls-url]: https://coveralls.io/r/dotupNET/dotup-ts-node-mifare-usb
