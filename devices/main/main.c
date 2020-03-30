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
char* device_uuid;


void cb_connection_ok(void *pvParameter){
	ESP_LOGE(TAG, "WIFI 1 CONNECTED!");
	esp_restart();
}

void read_dht(void *pvParameters)
{
	int16_t temperature = 0;
	int16_t humidity = 0;
	float delay = 10000; //ms

	for(;;)
	{
		if (dht_read_data(sensor_type, dht_gpio, &humidity, &temperature) == ESP_OK) {
			char *msg;
			asprintf(&msg, 
				" { \"sensors\": { \"humidity\": %.1f, \"temperature\": %.1f } }",
				(float)humidity/10, (float)temperature/10
			);
			int err = node_write_task(msg);
			free(msg);

			switch(err) {
				case 0:
					ESP_LOGI(TAG, "Humidity: %d%% Temp: %dC\n", humidity, temperature);
					break;
				case 1:
					ESP_LOGE(TAG, "ERR1: Not connected to mesh!");
					break;
				case 2:
					ESP_LOGE(TAG, "ERR2: Not connected to root!");
					break;
				case 3:
					ESP_LOGE(TAG, "ERR3: Could not send message!");
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

bool read_uuid() {
	nvs_handle handle;
	ESP_LOGI(TAG, "Reading UUID");

	if(nvs_open("devid", NVS_READONLY, &handle) == ESP_OK){
		ESP_LOGI(TAG, "NVS Open");

		device_uuid = (char*)malloc(sizeof(char[36]));
		memset(device_uuid, 0x00, sizeof(char[36]));

		size_t sz = sizeof(char[36]);
		uint8_t *buff = (uint8_t*)malloc(sizeof(uint8_t) * sz);
		memset(buff, 0x00, sizeof(char[36]));

		esp_err_t esp_err = nvs_get_blob(handle, "devid", buff, &sz);
		if(esp_err != ESP_OK){
			free(buff);
			return false;
		}

		memcpy(device_uuid, buff, sz);
		device_uuid[36] = '\0';
		ESP_LOGI(TAG, "UUID: %s", device_uuid);

		return true;
	}

	ESP_LOGE(TAG, "Could not read UUID");
	return false;
}

void write_uuid(char *uuid) {
	nvs_handle handle;

	ESP_LOGI(TAG, "Writing UUID %s", uuid);

	nvs_open("devid", NVS_READWRITE, &handle);
	esp_err_t esp_err = nvs_set_blob(handle, "devid", uuid, 36);

	if(esp_err != ESP_OK) {
		ESP_LOGE(TAG, "Failed to write UUID");
	}

	esp_restart();
}

void app_main()
{
	nvs_flash_init();
	read_uuid();
	if(wifi_manager_fetch_wifi_sta_config()) {
		if(mesh_start()){
			ESP_LOGW(TAG, "Waiting 20s for connection...");
			vTaskDelay(20000 / portTICK_PERIOD_MS);

			if(read_uuid()) {
				ESP_LOGW(TAG, "Starting reading sensors...");
				xTaskCreate(read_dht, "read_dht", configMINIMAL_STACK_SIZE * 3, NULL, 5, NULL);
			} else {
				char *msg;
				ESP_LOGW(TAG, "Setting up device...");
				device_uuid = malloc(sizeof(char[3]));
				strcpy(device_uuid, "");
				asprintf(&msg, "{ \"sensors\": [{ \"type\": \"humidity\", \"unit\": \"%%\" }, { \"type\": \"temperature\", \"unit\": \"C\" }] }");
				node_write_task(msg);
			}
		} else {
			ESP_LOGE(TAG, "Mesh else...");
		}
	} else {
		wifi_manager_start();
		wifi_manager_set_callback(EVENT_STA_GOT_IP, &cb_connection_ok);
	}
}
