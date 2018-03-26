# BLEdemo

This is just a simple demo to learn about [Bluetooth LE](https://de.wikipedia.org/wiki/Bluetooth_Low_Energy) and [NativeScript](https://www.nativescript.org/).

## Arduino

I'm using a very simple circuit from the book [Make: Bluetooth](https://www.makershed.com/products/make-bluetooth), a variation of the [Smart Light Switch](https://makezine.com/projects/diy-smart-light-switch/).

### Components
* [Arduino](https://www.arduino.cc/) UNO Rev 3
* [Adafruit Bluefruit LE](https://www.adafruit.com/product/1697) shield
* A Breadboard
* An LED
* A 220Ω and 10kΩ resistor
* Jumper wires
* A tactile switch

### Schematics: Smart Light Switch

The purpose of this switch is simply to turn the LED light on/off, either by pressing the switch or by BLE. This can be done on your smartphone with the app [LightBlue](https://punchthrough.com/), for example.

After assembling the circuit upload the [SmartLightSwitch.ino](https://github.com/michaelborgmann/BLEdemo/blob/master/SmartLightSwitch.ino) to the Arduino.

![alt text](https://i0.wp.com/makezine.com/wp-content/uploads/2016/04/ble-light-switch.jpg?resize=620%2C482&ssl=1 "Smart Light Switch")

## NativeScript Mobile App

To control the Smart Light Switch with BLE I am creating a crossplatform mobile app using [NativeScript](https://www.nativescript.org/) with [TypeScript](http://www.typescriptlang.org/) and the [NativeScript Bluetooth](https://github.com/EddyVerbruggen/nativescript-bluetooth) plugin.

It seems like the iOS Simulator doesn't support Bluetooth anymore, and you have to use an iPhone. Find your device id with `instruments -s devices` and run the app on the device with `tns run ios --device [ID]`.
