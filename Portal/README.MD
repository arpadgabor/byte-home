```c
***ERROR*** A stack overflow in task Tmr Svc has been detected.
abort() was called at PC 0x4008a2d8 on core 0
0x4008a2d8: vApplicationStackOverflowHook at /home/arpad/esp/esp-mdf/esp-idf/components/esp32/panic.c:707


Backtrace: 0x4008a094:0x3ffbd170 0x4008a2c1:0x3ffbd190 0x4008a2d8:0x3ffbd1b0 0x40087808:0x3ffbd1d0 0x40086a40:0x3ffbd1f0 0x400869f2:0xeb86afbb
0x4008a094: invoke_abort at /home/arpad/esp/esp-mdf/esp-idf/components/esp32/panic.c:707

0x4008a2c1: abort at /home/arpad/esp/esp-mdf/esp-idf/components/esp32/panic.c:707

0x4008a2d8: vApplicationStackOverflowHook at /home/arpad/esp/esp-mdf/esp-idf/components/esp32/panic.c:707

0x40087808: vTaskSwitchContext at /home/arpad/esp/esp-mdf/esp-idf/components/freertos/tasks.c:3507

0x40086a40: _frxt_dispatch at /home/arpad/esp/esp-mdf/esp-idf/components/freertos/portasm.S:406

0x400869f2: _frxt_int_exit at /home/arpad/esp/esp-mdf/esp-idf/components/freertos/portasm.S:206
```