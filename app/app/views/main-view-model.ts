import observable = require ('data/observable');
import observableArray = require('data/observable-array');
import frameModule = require('ui/frame');
import dialogs = require('ui/dialogs');
import bluetooth = require('nativescript-bluetooth');

var observablePeripheralArray = new observableArray.ObservableArray();

export class DemoAppModel extends observable.Observable {

    peripherals = observablePeripheralArray;

    constructor() { super(); }

    doIsBluetoothEnabled() {
        bluetooth.isBluetoothEnabled().then(function(enabled) {
            dialogs.alert({
              title: "Enabled?",
              message: enabled ? "Yes" : "No",
              okButtonText: "OK, thanks"
            });
        });
    }

    doStartScanning() {
        // this one uses automatic permission handling
        var that = this;
        that.set('isLoading', true);
        // reset the array
        observablePeripheralArray.splice(0, observablePeripheralArray.length);
        bluetooth.startScanning({
            serviceUUIDs: [], // pass an empty array to scan for all services
            seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
            onDiscovered: function (peripheral) {
                observablePeripheralArray.push(observable.fromObject(peripheral));
            }
        }).then(function() {
            that.set('isLoading', false);
        }, function (err) {
            that.set('isLoading', false);
            dialogs.alert({
                title: "Whoops!",
                message: err,
                okButtonText: "OK, got it"
            });
        });
    }

    doStopScanning() {
        var that = this;
        bluetooth.stopScanning().then(function() {
            that.set('isLoading', false);
        }, function (err) {
            dialogs.alert({
                title: "Whoops!",
                message: err,
                okButtonText: "OK, so be it"
            });
        });
    }

    onPeripheralTap(args) {
        var index = args.index;
        var peri = observablePeripheralArray.getItem(index)
    
        var navigationEntry = {
          moduleName: "services-page",
          context: {
            info: "something you want to pass to your page",
            foo: 'bar',
            peripheral: peri
          },
          animated: true
        };
        var topmost = frameModule.topmost();
        topmost.navigate(navigationEntry);
    };
}