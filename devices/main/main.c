#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_log.h"
#include "wifi_manager.h"
#include "wifimesh.h"
#include "mdf_common.h"
#include "mwifi.h"
#include "dht.h"

static const dht_sensor_type_t sensor_type = DHT_TYPE_AM2301;

static const gpio_num_t dht_gpio = 4;

static const char TAG[] = "BYTE";

void cb_connection_ok(void *pvParameter){
	ESP_LOGE(TAG, "WIFI 1 CONNECTED!");
	esp_restart();
}


void dht_test(void *pvParameters)
{
    int16_t temperature = 0;
    int16_t humidity = 0;
	float delay = 3000;

    // DHT sensors that come mounted on a PCB generally have
    // pull-up resistors on the data pin.  It is recommended
    // to provide an external pull-up resistor otherwise...

    //gpio_set_pull_mode(dht_gpio, GPIO_PULLUP_ONLY);

    for(;;)
    {
        if (dht_read_data(sensor_type, dht_gpio, &humidity, &temperature) == ESP_OK) {
			char *msg;
			asprintf(&msg, 
				"{ \"type\": \"sensors\", \"count\": 2, \"data\": [{ \"name\": \"humidity\", \"value\": %.1f, \"unit\": \"%%\" }, { \"name\": \"temperature\", \"value\": %.1f, \"unit\": \"C\" }] }",
				(float)humidity/10, (float)temperature/10
			);
			int err = node_write_task(msg);
			free(msg);

			switch(err) {
				case 0:
					ESP_LOGI(TAG, "Humidity: %d%% Temp: %dC\n", humidity, temperature);
					delay = 3000;
					break;
				case 1:
					ESP_LOGE(TAG, "ERR1: Not connected to mesh!");
					delay = delay * 1.1;
					break;
				case 2:
					ESP_LOGE(TAG, "ERR2: Not connected to root!");
					delay = delay * 1.1;
					break;
				case 3:
					ESP_LOGE(TAG, "ERR3: Could not send message!");
					delay = delay * 1.1;
					break;
				default:
					break;
			}
		}
        else
            ESP_LOGW(TAG, "Could not read data from sensor\n");

        vTaskDelay((int)delay / portTICK_PERIOD_MS);
    }
}

void app_main()
{
	nvs_flash_init();

	if(wifi_manager_fetch_wifi_sta_config()) {
		initMesh();
	} else {
		wifi_manager_start();
		wifi_manager_set_callback(EVENT_STA_GOT_IP, &cb_connection_ok);
	}
	xTaskCreate(dht_test, "dht_test", configMINIMAL_STACK_SIZE * 3, NULL, 5, NULL);
}
