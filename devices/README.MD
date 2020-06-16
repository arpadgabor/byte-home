# Tips

1. Install [ESP-MDF](https://github.com/espressif/esp-mdf)
2. Add `alias get_mdf='. $HOME/esp/esp-mdf/export.sh'` to `~/.profile` and run every time you open a terminal for MDF development.
3. For VS Code development, [make sure paths are ok](#vs-code-properties-json).
4. Commands:
   * `idf.py menuconfig` for configurations
   * `idf.py build` for build
   * `idf.py flash -p /dev/ttyS* -b 115200` for flashing to device. * = number of port
   * `idf.py clean` to clean build folder
   * `idf.py monitor -p /dev/ttyS*` for serial monitor
   * `idf.py erase_flash -p /dev/ttyS* -b 115200` to erase flash memory from device aka "factory reset"

# Devices & Parts

1. Az-Delivery NodeMCU
    [Docs](https://cdn.shopify.com/s/files/1/1509/1638/files/ESP_-_32_NodeMCU_Developmentboard_Datenblatt_a3bf98d8-6a53-4d26-8f1c-c61b1c82af39.pdf?76837)
    [Pinout](https://cdn.shopify.com/s/files/1/1509/1638/files/ESP_-_32_NodeMCU_Developmentboard_Pinout_Diagram.jpg?4479111012146266271)

2. Lolin D32 Pro
    [Docs](https://docs.wemos.cc/en/latest/d32/d32_pro.html)
    [Pinout](https://docs.wemos.cc/en/latest/_static/boards/d32_pro_v2.0.0_3_16x9.jpg)

3. [Led Strip Guide](https://learn.adafruit.com/neopixel-levelshifter)

# VS Code Properties JSON

```json
{
    "configurations": [
        {
            "name": "Linux",
            "includePath": [
                "${workspaceRoot}/build/**",
                "${workspaceRoot}/components/**",
                "${workspaceRoot}/**",
                "~/esp/esp-mdf/**",
                "~/esp/esp-mdf/components/**",
                "~/esp/esp-mdf/esp-idf/**",
                "~/esp/esp-mdf/esp-idf/components/**"
            ],
            "browse": {
                "path": [
                    "~/esp/esp-mdf/components",
                    "~/esp/esp-mdf/esp-idf/components",
                    "${workspaceRoot}/components"
                ],
                "limitSymbolsToIncludedHeaders": false
            },
            "intelliSenseMode": "gcc-x64",
            "compilerPath": "${env:HOME}/esp/xtensa-esp32-elf/bin/xtensa-esp32-elf-gcc",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "configurationProvider": "vector-of-bool.cmake-tools"
        }
    ],
    "version": 4
}
```