# This folder contains secrets

Create a file `config.h` with the following contents:

```c
#define MQTT_URI "mqtt://<username>:<password>@<host>:<port>"
// eg. ports: 1883, 8080, 8081, 8883

#define WIFI_SSID <ssid>
#define WIFI_PASS <pass>
```