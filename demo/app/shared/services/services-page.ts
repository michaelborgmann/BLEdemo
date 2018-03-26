import observable = require ('data/observable');
import observableArray = require('data/observable-array');
import frameModule = require('ui/frame');
import dialogs = require('ui/dialogs');
import bluetooth = require('nativescript-bluetooth');

var _peripheral;

export function pageLoaded(args) {
    console.log("[!] services-page.pageLoaded");

    var page = args.object;
  
    // might as well not load the rest of the page in this case (nav back)
    if (page.navigationContext === undefined) {
      return;
    }
  
    _peripheral = page.navigationContext.peripheral;
    var discoveredServices = new observableArray.ObservableArray();
    page.bindingContext = _peripheral;
    _peripheral.set('isLoading', true);
  
    bluetooth.connect(
      {
        UUID: _peripheral.UUID,
        // NOTE: we could just use the promise as this cb is only invoked once
        onConnected: function (peripheral) {
          console.log("------- Peripheral connected: " + JSON.stringify(peripheral));
          peripheral.services.forEach(function(value) {
            console.log("---- ###### adding service: " + value.UUID);
            discoveredServices.push(observable.fromObject(value));
          });
          _peripheral.set('isLoading', false);
          _peripheral.set('services', discoveredServices);
        },
        onDisconnected: function (peripheral) {
          dialogs.alert({
            title: "Disconnected",
            message: "Disconnected from peripheral: " + JSON.stringify(peripheral),
            okButtonText: "OK, thanks"
          });
        }
      }
    );
  }

  export function onServiceTap(args) {
    console.log("[!] services-page.onServiceTap");

    var index = args.index;
    var service = _peripheral.get("services").getItem(index);
    console.log("--- service selected: " + service.UUID);
  
    var navigationEntry = {
      moduleName: "shared/characteristics/characteristics-page",
      context: {
        peripheral: _peripheral,
        service: service
      },
      animated: true
    };
    var topmost = frameModule.topmost();
    topmost.navigate(navigationEntry);
  }
  
  export function onDisconnectTap(args) {
    console.log("Disconnecting peripheral " + _peripheral.UUID);
    bluetooth.disconnect(
      {
        UUID: _peripheral.UUID
      }
    ).then(
      function() {
        // going back to previous page
        frameModule.topmost().navigate({
          moduleName: "shared/main/main-page",
          animated: true,
          transition: {
            name: "slideRight"
          }
        });
      },
      function (err) {
        console.log(err);
        // still going back to previous page
        frameModule.topmost().navigate({
          moduleName: "shared/main/main-page",
          animated: true,
          transition: {
            name: "slideRight"
          }
        });
      }
    );
  }