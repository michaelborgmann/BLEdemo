#include <SPI.h>
#include <BLEPeripheral.h>

#define LED_PIN     3
#define BUTTON_PIN  4

#define BLE_REQ     10
#define BLE_RDY     2
#define BLE_RST     9

int currentState;
int debounceState;
int switchState = 0;
int ledState = 0;

BLEPeripheral blePeripheral = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);
BLEService lightswitch = BLEService("FF10");

BLECharCharacteristic switchCharacteristic = BLECharCharacteristic("FF11", BLERead | BLEWrite);
BLEDescriptor switchDescriptor = BLEDescriptor("2901", "Switch");

BLECharCharacteristic stateCharacteristic = BLECharCharacteristic("FF12", BLENotify);
BLEDescriptor stateDescriptor = BLEDescriptor("2901", "State");

void setup() {
  Serial.begin(9600);
  
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);

  blePeripheral.setLocalName("Light Switch");
  blePeripheral.setDeviceName("Smart Light Switch");
  blePeripheral.setAdvertisedServiceUuid(lightswitch.uuid());

  blePeripheral.addAttribute(lightswitch);
  blePeripheral.addAttribute(switchCharacteristic);
  blePeripheral.addAttribute(switchDescriptor);
  blePeripheral.addAttribute(stateCharacteristic);
  blePeripheral.addAttribute(stateDescriptor);

  switchCharacteristic.setEventHandler(BLEWritten, switchCharacteristicWritten);
  
  blePeripheral.begin();

  Serial.println(F("Smart Light Switch"));
}

void loop() {
  blePeripheral.poll();

  currentState = digitalRead(BUTTON_PIN);
  delay(10);
  debounceState = digitalRead(BUTTON_PIN);

  if (currentState == debounceState) {
    if (currentState != switchState) {

      if (currentState == LOW) {
        //Button just released
      } else {
        Serial.print(F("Button event: "));
        if (ledState == 0) {
          stateCharacteristic.setValue(1);
          switchCharacteristic.setValue(1);
          digitalWrite(LED_PIN, HIGH);
          ledState = 1;
          Serial.println(F("light on"));
        } else {
          stateCharacteristic.setValue(0);
          switchCharacteristic.setValue(0);
          digitalWrite(LED_PIN, LOW);
          ledState = 0;
          Serial.println(F("light off"));
        }
      }
      switchState = currentState;
    }
  }
}

void switchCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  Serial.print(F("Characteristic event: "));

  if (switchCharacteristic.value()) {
    Serial.println(F("light on"));
    digitalWrite(LED_PIN, HIGH);
    ledState = 1;
  } else {
    Serial.println(F("light off"));
    digitalWrite(LED_PIN, LOW);
    ledState = 0;
    stateCharacteristic.setValue(0);
  }
}
