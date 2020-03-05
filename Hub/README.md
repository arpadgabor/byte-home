# ByteHome Hub

`v0.1`

The source code for ByteHome Hubs.

# How to use

*Note: Might migrate to micropython in near future*

1. Get [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/get-started/index.html)
2. Build project `idf.py build`
3. Flash to device `idf.py flash -p <serial port> -b <baudrate>` (eg. `idf.py flash -p /dev/ttyS4 -b 19200`)
4. Monitor logs `idf.py monitor -p <serial port>`

# Devices to use

Pretty much any ESP32 device. I'm using the [Lolin D32 Pro](https://docs.wemos.cc/en/latest/d32/d32_pro.html).